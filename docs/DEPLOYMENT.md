# Deploying ServeProGen to Hostinger

The site is static HTML, CSS and JavaScript plus one PHP file for the contact form.
It runs on the existing **Hostinger Business** plan as a **separate website**.

> **Never deploy to `awaistechhacks.com`.** That WordPress site lives on the same
> hosting account. Every step below names the ServeProGen website explicitly. Before
> any upload or Git deployment, check the domain shown at the top of hPanel.

## Contents

1. [How the pieces fit](#1-how-the-pieces-fit)
2. [Before you start](#2-before-you-start)
3. [Stage on a free temporary subdomain](#3-stage-on-a-free-temporary-subdomain)
4. [Upload the site](#4-upload-the-site) (two routes: Git or ZIP)
5. [Set up the private folder and contact form](#5-set-up-the-private-folder-and-contact-form)
6. [Verify staging](#6-verify-staging)
7. [Launch on the real domain](#7-launch-on-the-real-domain)
8. [Turn on email delivery](#8-turn-on-email-delivery)
9. [Rollback](#9-rollback)
10. [Launch checklist](#10-launch-checklist)

---

## 1. How the pieces fit

```
/home/<account>/domains/<serveprogen-domain>/
├── public_html/          ← the built site (build/client), replaced on every deploy
│   ├── index.html, about/, services/, work/, …   pre-rendered pages
│   ├── assets/           hashed JS/CSS/fonts (cached for a year)
│   ├── api/contact.php   the only PHP that runs
│   └── .htaccess         clean URLs, 404, HTTPS, caching, security headers
└── private/              ← uploaded ONCE, never replaced by deploys
    ├── mail-config.php   your SMTP settings (server only, never in Git)
    ├── vendor/phpmailer/ PHPMailer 6.x
    └── storage/          rate-limit data (writable)
```

`api/contact.php` finds `private/` automatically (one level above `public_html`).

| Setting                                      | Where it lives                                                         | Example                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| Canonical URL, indexing                      | Build time: `.env.production.local` or the deploy workflow's variables | `VITE_SITE_URL=https://serveprogen.com`, `VITE_NOINDEX=false` |
| SMTP credentials, recipient, allowed origins | Server only: `private/mail-config.php`                                 | see `server/private/mail-config.example.php`                  |
| Contact details shown on the site            | `app/content/site.ts`                                                  | `contact.email`                                               |

## 2. Before you start

- [ ] The site passes locally: `npm run check` and `npm run test:e2e` (see README).
- [ ] You have reviewed it with `npm run build && npm run serve` on http://localhost:4173.
- [ ] The code is pushed to your private GitHub repository.

## 3. Stage on a free temporary subdomain

Staging proves the real hosting behaviour (`.htaccess`, PHP, HTTPS) before you buy the domain.

1. hPanel → **Websites** → **Add website** → choose the **Business** plan → **Empty website**
   (or "Skip, I'll create later" for the builder) → choose **use a temporary domain**.
   Hostinger assigns something like `random-words.hostingersite.com`.
2. Wait until the website shows as ready (a few minutes).
3. Note the temporary domain; you will use it as the staging URL.

> The temporary site is public but tells search engines not to index it: staging builds
> are always `noindex` and their `robots.txt` blocks crawlers.

## 4. Upload the site

Pick **one** route. Route A is the recommended long-term setup.

### Route A: GitHub deployment (recommended)

1. GitHub repository → **Settings → Secrets and variables → Actions → Variables**:
   - `STAGING_SITE_URL` = `https://<temporary-domain>` (optional)
2. GitHub → **Actions → Publish build for Hostinger → Run workflow → target: staging**.
   This runs the checks, builds the site and pushes the static output to the branch
   **`deploy-staging`**.
3. hPanel → the **staging website** → **Advanced → Git** (or **GIT** in the sidebar):
   - Connect GitHub if asked, choose your repository, branch **`deploy-staging`**,
     directory empty (= `public_html`).
   - Enable **auto-deployment** if offered, so each publish updates staging.
4. Click **Deploy**.

Later, production uses the same steps with target **production** and branch
**`deploy-production`** on the production website.

### Route B: ZIP upload (no GitHub needed)

1. On your computer:
   ```bash
   npm run build
   npm run package:hostinger
   ```
   This creates `exports/serveprogen-hostinger-<commit>.zip` with `public_html/`,
   `private/` and `UPLOAD.txt`. Preview builds are refused, and no secrets are included.
2. hPanel → the **staging website** → **Files → File Manager**.
3. Open `public_html`, delete the default placeholder files (`default.php` etc.) **only
   in this website's folder**, upload the zip, **Extract**, then move the _contents_ of the
   extracted `public_html/` up into the real `public_html`.
4. Move the extracted `private/` folder to the domain folder, next to `public_html`.

## 5. Set up the private folder and contact form

Do this once per website (staging and production each have their own).

1. Make sure `private/` sits **next to** `public_html` (not inside it). With Route A,
   upload `server/private/` from the repository via File Manager.
2. In `private/`, copy `mail-config.example.php` to **`mail-config.php`**.
3. Edit `mail-config.php`:
   - `mode` → `'dry_run'` for now (validates forms and replies "test mode, not sent").
   - `allowed_origins` → `['https://<your-staging-domain>']`
   - `hash_salt` → a long random string (any password generator, 40+ characters).
4. Check `private/storage/` is writable (permission 755 is normal on Hostinger).

The site never claims a message was sent unless the SMTP server accepted it.

## 6. Verify staging

Open the staging URL and check:

- [ ] Home, About, Services (+5 service pages), Portfolio, Process, Insights, Contact,
      Privacy, Terms all load, **and reload correctly** when you refresh on them.
- [ ] `/services/` redirects to `/services` (no trailing slash).
- [ ] An unknown URL (e.g. `/nope`) shows the branded 404.
- [ ] The padlock shows (HTTPS). hPanel → **SSL** → install the free certificate if not.
- [ ] The contact form validates, and a real submission shows
      **"Test mode: your message was not sent."** (dry run).
- [ ] Mobile: open the menu, navigate, close it.
- [ ] `https://<staging>/robots.txt` says `Disallow: /`.

## 7. Launch on the real domain

Only after you approve the finished site.

1. **Buy the domain** (hPanel → Domains). Hostinger domains point at your hosting
   automatically; for a domain bought elsewhere, set its nameservers to Hostinger's
   (hPanel → Domains → DNS / Nameservers shows the exact values).
2. **Add it as its own website**: hPanel → Websites → Add website → Business plan →
   use the purchased domain. Do **not** attach it to awaistechhacks.com.
3. **SSL**: hPanel → Security → SSL → install the free certificate for the domain
   (and `www`). Wait until it shows **Active**.
4. **Production settings**: GitHub variables `PRODUCTION_SITE_URL=https://<domain>` and
   `PRODUCTION_INDEXING=true` (Route A), or for Route B create `.env.production.local`:
   ```
   VITE_SITE_URL=https://<domain>
   VITE_NOINDEX=false
   ```
   then `npm run build && npm run package:hostinger`.
5. **Publish** (Route A: run the workflow with target **production**, connect the
   production website to branch `deploy-production`; Route B: upload as in step 4).
6. **Private folder** for production (section 5), with
   `allowed_origins => ['https://<domain>', 'https://www.<domain>']`.
7. **Canonical host**: in `public/.htaccess`, uncomment the "Remove www." rule if you
   want `https://<domain>` as the single address, then publish again.
8. **HSTS**: once HTTPS has worked for a few days, uncomment the
   `Strict-Transport-Security` header in `public/.htaccess` and publish again.
9. **Search engines**: check `https://<domain>/robots.txt` allows indexing and
   `https://<domain>/sitemap.xml` lists the pages. Submit the sitemap in Google Search
   Console and Bing Webmaster Tools.

## 8. Turn on email delivery

1. hPanel → **Emails** → create a mailbox on the domain, e.g. `hello@<domain>`.
2. hPanel shows its SMTP settings (usually `smtp.hostinger.com`, port 465, SSL).
3. Edit `private/mail-config.php` on the server: SMTP user/password, `from_email`
   (must be the mailbox), `to_email` (where inquiries go), then `mode => 'live'`.
4. Send a real test inquiry from the site. It should arrive with **Reply-To** set to the
   visitor's address. If it fails, the visitor sees an honest error, and the PHP error
   log (hPanel → Advanced → PHP error logs) explains why.
5. Add the public email to `app/content/site.ts` (`contact.email`) and publish, so it
   appears in the footer, contact page and legal pages.

## 9. Rollback

- **Route A**: every publish is a commit on `deploy-<target>`. In GitHub, re-run the
  workflow on an older commit of `main`, or in hPanel → Git, deploy the previous
  commit of the deploy branch.
- **Route B**: keep the previous `serveprogen-hostinger-<commit>.zip`. Upload and
  extract it the same way.
- **Before risky changes**: hPanel → Websites → the ServeProGen site → **Backups**
  → create a backup. The `private/` folder is never touched by deploys.
- **Emergency**: switch `mode` back to `'dry_run'` in `mail-config.php` to stop email
  instantly without redeploying.

## 10. Launch checklist

- [ ] Projects you want public have `published: true` and an empty `unconfirmed` list.
- [ ] Contact email, location and social links set in `app/content/site.ts` (optional).
- [ ] Privacy Policy and Terms reviewed by you (and ideally a lawyer); legal entity,
      jurisdiction and contact email filled in.
- [ ] Clash Display font added (`public/fonts/README.md`), or Geist fallback accepted.
- [ ] Production build with `VITE_SITE_URL` and `VITE_NOINDEX=false`.
- [ ] SSL active, HTTPS redirect working, www/non-www decided.
- [ ] Contact form tested in `live` mode with a real inquiry.
- [ ] Sitemap submitted to search engines.
- [ ] awaistechhacks.com still loads normally.
