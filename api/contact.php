<?php
/**
 * ServeProGen contact endpoint: POST /api/contact.php (JSON in, JSON out).
 *
 * Mirrors the rules in app/lib/contact.ts. Keep both in sync; the unit test
 * tests/unit/contact.test.ts fails if the option lists drift apart.
 *
 * Secrets and PHPMailer live in a private folder OUTSIDE public_html:
 *   <domain root>/private/mail-config.php
 *   <domain root>/private/vendor/phpmailer/src/*.php
 *   <domain root>/private/storage/            (writable, rate-limit data)
 * Override the location with the SERVEPROGEN_PRIVATE_DIR environment variable.
 *
 * Responses never claim delivery unless the SMTP server accepted the message.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

const SERVICES = [
    'Full-Stack Web Development',
    'AI & Machine Learning',
    'SaaS Product Development',
    'Business Process Automation',
    'Custom Software Solutions',
    'Other',
];

const BUDGETS = [
    'Not sure yet',
    'Under $1,000',
    '$1,000 – $5,000',
    '$5,000 – $15,000',
    '$15,000+',
];

const LIMITS = [
    'name_min' => 2,
    'name_max' => 100,
    'email_max' => 254,
    'company_max' => 120,
    'message_min' => 20,
    'message_max' => 5000,
    'min_fill_ms' => 3000,
    'max_age_ms' => 86400000,
    'max_body_bytes' => 20000,
];

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $status, string $error, array $fields = []): never
{
    $body = ['ok' => false, 'error' => $error];
    if ($fields) {
        $body['fields'] = $fields;
    }
    respond($status, $body);
}

function str_len(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

/* ---------- Request checks ---------- */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail(405, 'method');
}

$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
if (!str_starts_with($contentType, 'application/json')) {
    fail(415, 'method');
}

$raw = file_get_contents('php://input', false, null, 0, LIMITS['max_body_bytes'] + 1);
if ($raw === false || strlen($raw) > LIMITS['max_body_bytes']) {
    fail(413, 'validation');
}

$input = json_decode($raw, true);
if (!is_array($input)) {
    fail(400, 'validation');
}

/* ---------- Configuration ---------- */

$privateDir = getenv('SERVEPROGEN_PRIVATE_DIR') ?: dirname(__DIR__, 2) . '/private';
$configFile = $privateDir . '/mail-config.php';
if (!is_file($configFile)) {
    error_log('[contact] mail-config.php not found; form is not configured.');
    fail(503, 'not_configured');
}
$config = require $configFile;
if (!is_array($config) || !in_array($config['mode'] ?? '', ['dry_run', 'live'], true)) {
    error_log('[contact] mail-config.php is invalid.');
    fail(503, 'not_configured');
}

/* ---------- Origin check ---------- */

$allowed = $config['allowed_origins'] ?? [];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($allowed && $origin !== '' && !in_array($origin, $allowed, true)) {
    fail(403, 'spam');
}

/* ---------- Validation (mirrors app/lib/contact.ts) ---------- */

$text = static fn(string $key): string => is_string($input[$key] ?? null) ? trim($input[$key]) : '';

$name = $text('name');
$email = $text('email');
$company = $text('company');
$service = $text('service');
$budget = $text('budget');
$message = $text('message');
$website = $text('website');
$startedAt = $input['startedAt'] ?? null;
$consent = $input['consent'] ?? null;

// Bots: honeypot filled, or submitted impossibly fast / from a stale page.
$nowMs = (int) floor(microtime(true) * 1000);
if ($website !== '') {
    fail(400, 'spam');
}
if (!is_int($startedAt) || $nowMs - $startedAt < LIMITS['min_fill_ms'] || $nowMs - $startedAt > LIMITS['max_age_ms']) {
    fail(400, 'spam');
}

$errors = [];
if (str_len($name) < LIMITS['name_min']) {
    $errors['name'] = 'Please enter your full name.';
} elseif (str_len($name) > LIMITS['name_max']) {
    $errors['name'] = 'Please keep your name under 100 characters.';
}
if (str_len($email) > LIMITS['email_max'] || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $errors['email'] = 'Enter a valid email address, like name@company.com.';
}
if (str_len($company) > LIMITS['company_max']) {
    $errors['company'] = 'Please keep the company name under 120 characters.';
}
if (!in_array($service, SERVICES, true)) {
    $errors['service'] = 'Choose the service you need.';
}
if ($budget !== '' && !in_array($budget, BUDGETS, true)) {
    $errors['budget'] = 'Choose a budget range from the list.';
}
if (str_len($message) < LIMITS['message_min']) {
    $errors['message'] = 'Please describe your project in at least 20 characters.';
} elseif (str_len($message) > LIMITS['message_max']) {
    $errors['message'] = 'Please keep the description under 5,000 characters.';
}
if ($consent !== true) {
    $errors['consent'] = "Please confirm you've read the privacy policy.";
}
// Header injection guard for anything that could reach a mail header.
foreach (['name' => $name, 'email' => $email, 'company' => $company] as $field => $value) {
    if (preg_match('/[\r\n]/', $value)) {
        $errors[$field] = 'Please remove line breaks from this field.';
    }
}
if ($errors) {
    fail(422, 'validation', $errors);
}

/* ---------- Rate limit (per hashed IP, per hour) ---------- */

$storage = $privateDir . '/storage';
if (!is_dir($storage) || !is_writable($storage)) {
    error_log('[contact] storage folder missing or not writable.');
    fail(503, 'not_configured');
}
$salt = (string) ($config['hash_salt'] ?? '');
$ipHash = hash('sha256', $salt . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
$bucket = $storage . '/rl-' . substr($ipHash, 0, 32) . '.json';
$limit = max(1, (int) ($config['rate_limit_per_hour'] ?? 5));

$handle = fopen($bucket, 'c+');
if ($handle === false) {
    fail(500, 'server');
}
flock($handle, LOCK_EX);
$hits = json_decode((string) stream_get_contents($handle), true);
$hits = is_array($hits) ? array_values(array_filter($hits, static fn($t) => is_int($t) && $t > time() - 3600)) : [];
if (count($hits) >= $limit) {
    flock($handle, LOCK_UN);
    fclose($handle);
    fail(429, 'rate_limited');
}
$hits[] = time();
ftruncate($handle, 0);
rewind($handle);
fwrite($handle, json_encode($hits));
flock($handle, LOCK_UN);
fclose($handle);

// Remove rate-limit files older than a day (cheap housekeeping, ~1% of requests).
if (random_int(1, 100) === 1) {
    foreach (glob($storage . '/rl-*.json') ?: [] as $file) {
        if (filemtime($file) < time() - 86400) {
            @unlink($file);
        }
    }
}

/* ---------- Dry run: validated, deliberately not sent ---------- */

if ($config['mode'] === 'dry_run') {
    respond(200, ['ok' => true, 'delivered' => false, 'mode' => 'dry-run']);
}

/* ---------- Send ---------- */

$vendor = $privateDir . '/vendor/phpmailer/src';
foreach (['Exception', 'PHPMailer', 'SMTP'] as $class) {
    if (!is_file("$vendor/$class.php")) {
        error_log('[contact] PHPMailer not found in private/vendor.');
        fail(503, 'not_configured');
    }
    require_once "$vendor/$class.php";
}

$plain = static fn(string $label, string $value): string => $label . ': ' . ($value !== '' ? $value : '—');
$body = implode("\n", [
    'New project inquiry from the ServeProGen website',
    '',
    $plain('Name', $name),
    $plain('Email', $email),
    $plain('Company', $company),
    $plain('Service', $service),
    $plain('Budget', $budget),
    '',
    'Project description:',
    $message,
]);
$esc = static fn(string $v): string => nl2br(htmlspecialchars($v !== '' ? $v : '—', ENT_QUOTES | ENT_HTML5, 'UTF-8'));
$html = '<h2 style="font-family:sans-serif">New project inquiry</h2><table style="font-family:sans-serif;font-size:14px">'
    . '<tr><td><b>Name</b></td><td>' . $esc($name) . '</td></tr>'
    . '<tr><td><b>Email</b></td><td>' . $esc($email) . '</td></tr>'
    . '<tr><td><b>Company</b></td><td>' . $esc($company) . '</td></tr>'
    . '<tr><td><b>Service</b></td><td>' . $esc($service) . '</td></tr>'
    . '<tr><td><b>Budget</b></td><td>' . $esc($budget) . '</td></tr>'
    . '</table><p style="font-family:sans-serif;font-size:14px"><b>Project description</b><br>' . $esc($message) . '</p>';

try {
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = (string) $config['smtp_host'];
    $mail->Port = (int) $config['smtp_port'];
    $mail->SMTPAuth = ($config['smtp_user'] ?? '') !== '';
    $mail->Username = (string) ($config['smtp_user'] ?? '');
    $mail->Password = (string) ($config['smtp_password'] ?? '');
    $secure = $config['smtp_secure'] ?? 'ssl';
    if ($secure === 'ssl') {
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    } elseif ($secure === 'tls') {
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    } else {
        $mail->SMTPSecure = '';
        $mail->SMTPAutoTLS = false;
    }
    $mail->Timeout = 15;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom((string) $config['from_email'], (string) ($config['from_name'] ?? 'ServeProGen Website'));
    $mail->addAddress((string) $config['to_email']);
    $mail->addReplyTo($email, $name);
    $mail->Subject = 'Project inquiry: ' . $service . ' — ' . $name;
    $mail->isHTML(true);
    $mail->Body = $html;
    $mail->AltBody = $body;
    $mail->send();
} catch (Throwable $e) {
    // Log the technical reason server-side only; never echo it to the browser.
    error_log('[contact] send failed: ' . $e->getMessage());
    fail(502, 'server');
}

respond(200, ['ok' => true, 'delivered' => true]);
