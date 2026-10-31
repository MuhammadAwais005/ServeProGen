<?php
/**
 * Contact form mail settings: TEMPLATE ONLY.
 *
 * On Hostinger, copy this file to a folder OUTSIDE public_html, e.g.
 *   /home/<account>/serveprogen-private/mail.php
 * and fill in the real values there. Never commit the real file.
 * public/api/contact.php (Phase 4) reads it from that private path.
 */
return [
    'smtp_host'     => 'smtp.hostinger.com',
    'smtp_port'     => 465,
    'smtp_secure'   => 'ssl',
    'smtp_user'     => 'hello@your-domain.example',
    'smtp_password' => 'SET-ON-SERVER-ONLY',
    'from_email'    => 'hello@your-domain.example',
    'from_name'     => 'ServeProGen Website',
    'to_email'      => 'hello@your-domain.example',
    // Comma-separated origins allowed to post the form.
    'allowed_origins' => 'https://your-domain.example',
];
