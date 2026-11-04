# Custom domain setup (for later)

No domain has been bought and no DNS has been changed. This page explains how
to connect a personal domain once you have chosen one. `yourname.dev` below is
a **placeholder**, not a real or reserved domain.

## Current hosting

| | |
| --- | --- |
| Platform | Vercel (deployed automatically by the Vercel GitHub app on every push to `main`) |
| Repository | https://github.com/satetapongsa/My-Portfolio |
| Live URL | https://satetapong-portfolio.vercel.app |
| Build | `npm run build` → `dist/` (Vite), configured in `vercel.json` |
| Custom domains supported? | Yes — Vercel supports custom domains on all plans, including the free Hobby plan |
| HTTPS | Automatic: Vercel issues and renews the TLS certificate once DNS points to it |

The site is a single-page app. `vercel.json` rewrites every path without a file
extension to `index.html`, so routes such as `/projects/wavy-ide` keep working
on any domain.

## 1. Buy a domain

From any registrar (Cloudflare, Namecheap, Porkbun, Google-hosted registrars,
or a Thai registrar for `.co.th` / `.in.th`). Vercel can also sell domains
directly. Nothing in this repository needs a domain to work.

## 2. Add it to the Vercel project

Vercel dashboard → the portfolio project → **Settings → Domains** → **Add** →
enter `yourname.dev`. Vercel will also suggest adding `www.yourname.dev` and
redirecting one to the other — accept that.

## 3. Point DNS at Vercel

Use **one** of these approaches.

### Option A — keep your registrar's DNS (most common)

Add the records Vercel shows on the Domains page. Vercel now gives
**project-specific** values, so copy them from the dashboard rather than from
an old tutorial:

| Host | Type | Value |
| --- | --- | --- |
| `@` (apex, `yourname.dev`) | `A` | the IPv4 address shown in the Vercel dashboard |
| `www` | `CNAME` | the CNAME target shown in the Vercel dashboard |

Do not add both an `A` and a `CNAME` record for the same host name, and remove
any old `A`/`AAAA`/`CNAME` records for `@` and `www` that point elsewhere
(parking pages, previous hosts).

### Option B — let Vercel manage DNS

Change the domain's **nameservers** at your registrar to the ones Vercel
lists (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`). Vercel then creates the
records itself. Any email (MX) or verification (TXT) records must be recreated
in Vercel.

DNS changes usually apply within minutes but can take up to 48 hours.

## 4. HTTPS

Nothing to do. Once the Domains page shows the domain as **Valid
Configuration**, Vercel issues the certificate automatically and serves the
site over HTTPS, redirecting HTTP.

## 5. Update the site's own URLs

The site's metadata uses the current Vercel URL. After the domain works,
replace `https://satetapong-portfolio.vercel.app` with the new address in:

| File | What uses it |
| --- | --- |
| `src/config/site.ts` (`SITE_URL`) | canonical links, Open Graph URLs, article share links |
| `index.html` | canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD |
| `public/robots.txt` | sitemap location |
| `scripts/generate-sitemap.mjs` (`SITE`) | sitemap URLs (regenerated on every build) |
| `scripts/generate-og.mjs` (`url`) | the address printed on the share image — then run `npm run og` |

Then commit and push; Vercel redeploys automatically. Keep the
`.vercel.app` address: Vercel continues to serve it, and you can redirect it to
the custom domain from the Domains page.

## 6. Check

- `https://yourname.dev` and `https://www.yourname.dev` both load (one redirects to the other).
- A deep link such as `https://yourname.dev/journal` loads directly.
- Paste the URL into the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or LinkedIn Post Inspector to refresh the share preview.
