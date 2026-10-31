# Server code (contact form)

The site is static. The only server code is the contact form endpoint, built in Phase 4.

| Path                               | Ships to                           | Purpose                                                    |
| ---------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| `public/api/contact.php` (Phase 4) | `public_html/api/`                 | Validates the form, rate-limits, sends mail with PHPMailer |
| `server/composer.json` (Phase 4)   | Installed on the server            | PHPMailer dependency                                       |
| `server/config/mail.example.php`   | Nowhere (template)                 | Shape of the private mail config                           |
| Real `mail.php`                    | Server only, outside `public_html` | SMTP credentials. Never in Git.                            |

SMTP host and port above are the usual Hostinger values; confirm them in hPanel when the mailbox is created.
