# Krushi Bhoomi Farms

Static HTML/CSS/JavaScript website for Krushi Bhoomi Farms, with a PHP endpoint
for contact and newsletter submissions.

## Local preview

Use the PHP router so clean URLs such as `/about`, `/farmland`, and `/contact`
serve the matching `.html` files:

```sh
php -S 127.0.0.1:8080 router.php
```

## Contact form setup

The web server must support PHP 8+ with the cURL extension enabled.

1. Copy `.env.example` to `.env` on the server.
2. Set `RESEND_API_KEY` to a Resend API key.
3. Set `CONTACT_TO_EMAIL` to the inbox that should receive submissions.
4. Verify a sending domain in Resend and set `RESEND_FROM_EMAIL` to an address
   on that domain, such as `Krushi Bhoomi Website <website@example.com>`.
5. Upload `.env` alongside `contact.php`. It is excluded from Git and blocked
   from web access by the included `.htaccess` rules.

Both the contact form and homepage subscription form submit to `contact.php`.
