# Server code (contact form)

The site is static. The only server code is the contact form endpoint.

| Path in this repo                        | Goes to on Hostinger              | Purpose                                     |
| ---------------------------------------- | --------------------------------- | ------------------------------------------- |
| `public/api/contact.php`                 | `public_html/api/contact.php`     | Validates, rate-limits and sends inquiries  |
| `server/private/vendor/phpmailer/`       | `private/vendor/phpmailer/`       | PHPMailer 6.x (bundled, no Composer needed) |
| `server/private/mail-config.example.php` | `private/mail-config.example.php` | Template for the real config                |
| (never in Git)                           | `private/mail-config.php`         | SMTP credentials and settings, server only  |
| `server/private/storage/`                | `private/storage/`                | Rate-limit data (must be writable)          |

`private/` sits **next to** `public_html`, never inside it, and has its own
`.htaccess` denying web access as a second safeguard.

## Modes

- `dry_run`: validates submissions and replies "Test mode: your message was not sent."
  Use locally and on staging.
- `live`: sends over SMTP. Use only after a real mailbox exists. The site reports
  success only when the SMTP server accepted the message.

## Protection

Origin allow-list, honeypot field, minimum fill time (3 s), per-IP rate limit (hashed
IPs, no raw addresses stored), size limits, server-side validation mirroring the
browser rules (kept in sync by `tests/unit/contact.test.ts`), header-injection safe.

## Local testing

`npm run serve` runs the production build with PHP's built-in server for `/api/*`
(if PHP is installed) using `server/private/`. Without a `mail-config.php` the form
replies that it is not set up yet, which is the honest state.

Full setup: [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md), sections 5 and 8.
