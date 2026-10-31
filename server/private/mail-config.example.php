<?php
/**
 * ServeProGen contact form configuration: TEMPLATE.
 *
 * 1. Copy this file to mail-config.php in the SAME private folder on the server
 *    (outside public_html), e.g. /home/<account>/domains/<domain>/private/mail-config.php
 * 2. Fill in the real values. Never commit mail-config.php (it is git-ignored).
 *
 * Modes:
 *   'dry_run' → validates submissions and answers "test mode, not sent". Use on staging.
 *   'live'    → sends email over SMTP. Use only after a real mailbox exists.
 */
return [
    'mode' => 'dry_run',

    // SMTP (Hostinger: confirm host/port in hPanel → Emails → your mailbox → Connect apps)
    'smtp_host'     => 'smtp.hostinger.com',
    'smtp_port'     => 465,
    'smtp_secure'   => 'ssl',            // 'ssl' (port 465) or 'tls' (port 587)
    'smtp_user'     => 'hello@your-domain.example',
    'smtp_password' => 'SET-ON-SERVER-ONLY',

    // Addresses
    'from_email' => 'hello@your-domain.example',   // must be the SMTP mailbox
    'from_name'  => 'ServeProGen Website',
    'to_email'   => 'hello@your-domain.example',   // where inquiries are delivered

    // Only these origins may post the form (scheme + host, no trailing slash).
    'allowed_origins' => ['https://your-domain.example', 'https://www.your-domain.example'],

    // Abuse protection
    'rate_limit_per_hour' => 5,
    // Random secret used to hash IP addresses for rate limiting. Generate one, e.g.
    // php -r "echo bin2hex(random_bytes(32));"
    'hash_salt' => 'CHANGE-ME-TO-A-LONG-RANDOM-STRING',
];
