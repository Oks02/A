# Adminix — landing page

A single-page marketing site. It's plain HTML, CSS and JS: no framework, no build step, no dependencies.

```
index.html          page markup
styles.css          all styles (design tokens at the top under :root)
main.js             scroll reveals, sticky mobile CTA, form submit
favicon.ico         browser tab icon (16/32/48 px), at the root where browsers and Google look first
site.webmanifest    app name and icons for Android home screens
assets/favicon-96.png       sharper tab icon (Google uses multiples of 48 px)
assets/apple-touch-icon.png 180 px iPhone home-screen icon on white
assets/icon-192.png, icon-512.png  Android icons on white
assets/logo.png      full logo, transparent
assets/logo-mark.png 256px mark for home-screen icons
assets/og-image.png 1200×630 social share image (LinkedIn / Instagram / Slack previews)
robots.txt          lets all crawlers in, points to the sitemap
sitemap.xml         the single page URL for Google Search Console
```

## Page structure

Follows the standard B2B SaaS landing order: hero → social proof (ticker) → problem → solution (Today vs With Adminix) → how it works → use cases → who it's for → FAQ (objections) → final CTA.

## Run locally

Needs [Node.js](https://nodejs.org) (any current LTS). From this folder:

```bash
npx serve . -l 8000
```

Open http://localhost:8000. To outline every placeholder in pink, open **http://localhost:8000/?placeholders**.

There's nothing to install or build: `npx` fetches the `serve` static server on first run. The site itself is plain HTML, CSS and JS.

## Deploy

- **Netlify:** drag the folder into the dashboard, or connect the repo. Leave the build command empty and set the publish directory to `/`. The form works with no setup through Netlify Forms.
- **Vercel:** import the repo, pick the "Other" framework preset and leave the build command empty. The form needs an external endpoint (see the checklist below).

## Before going live: fill these in

In the code, each item is marked with an HTML comment `PLACEHOLDER(...)`. Run `grep -n PLACEHOLDER index.html` to list them. Drafted claims that need a fact check are marked `VERIFY(...)`.

| # | What | Where |
|---|------|-------|
| 1 | **Turnaround promise**: "within 48 hours" for the pilot sample (set; change it if you can't keep it) | Closing CTA copy |
| 2 | **Form endpoint**: Netlify needs nothing. On Vercel, set `action` to a Formspree, Basin or Tally URL | `<form class="lead-form">` (`form-endpoint`) |
| 3 | **Final CTA copy**: "See it with your own catalog" appears 3×, plus "Try your catalog" in the nav | Hero, form button, sticky mobile bar |
| 4 | **Hero visual**: the hero is typographic for now. When you have a real product screenshot or short screen recording of Adminix, add it at the `hero-visual` comment (`.hero-video` is already styled) | Hero (`hero-visual`) |
| 5 | **FAQ: data protection** (drafted, verify): EU hosting, encryption in transit and at rest, access limited to client team and Adminix support staff, NDA before pilot, DPA for production, deletion on request, no training models for other clients | FAQ (`VERIFY(data-policy)`) |
| 5a | **FAQ: integrations** (drafted, verify): ERP, PIM or promo planning system via API, SFTP or scheduled export; affected posters regenerate on price change | FAQ (`VERIFY(integrations)`) |
| 6 | **Domain**: set to `https://www.adminix.io`. If the page lives at another URL, replace it everywhere in the `<head>` (canonical, Open Graph, Twitter, JSON-LD), `robots.txt` and `sitemap.xml`. `og:image` **must** stay an absolute URL for LinkedIn | `<head>` (`domain`) |
| 8 | **Logo**: uses the older Adminix logo (`assets/logo.png`, made transparent and cropped from the PNG you supplied), on a white label in the header and footer. When the new logo is ready, replace `assets/logo.png`, `assets/logo-mark.png` (icon), then regenerate `favicon.ico` and the icon PNGs listed at the top; prefer SVG if you have it, and update the `width`/`height` on the two `<img>` tags. Re-render the OG image too | `logo` |

Also check:
- **Case study:** the Fozzy Group section was removed until the contract is signed. When it is (and they approve being named), it can come back between Use cases and Who it's for, with real metrics and a quote; it's in git history (commit before "Remove Fozzy case study").
- The success message ("we'll be in touch within one business day") is a commitment. Edit it in `main.js` if you can't keep it.
- The Problem figures (100–200 posters a week, 3–5 days per campaign) and the "Today vs With Adminix" points in the Solution section (3–5 days vs hours, AI validation of prices, product names and brand guidelines, one manager instead of designers, subscription plus pay per poster) come from the Adminix investor deck. Re-check them if anything has changed.
- The mock prices use ₴. Change them in `index.html` if you're targeting a non-UA audience.
- No analytics are included. Add your snippet before `</head>`. A successful form submit already fires `gtag('event', 'generate_lead')` if gtag is present.
- After deploying, re-scrape the page in the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) so the share preview picks up the image.

## SEO and Google indexing

Already in place:
- Title (under 60 characters), meta description (under 155), `robots` set to index and follow, canonical URL and `hreflang`.
- Open Graph and Twitter tags with the 1200×630 share image.
- JSON-LD structured data: Organization (logo, email, LinkedIn), WebSite, WebPage, SoftwareApplication and FAQPage. The FAQ entries copy the visible FAQ text; if you edit a FAQ answer, update the JSON-LD too.
- `robots.txt` and `sitemap.xml` at the site root.
- One `<h1>`, one `<h2>` per section, `lang="en"`, alt text on images, mobile viewport.

After you deploy:
1. Add the domain in [Google Search Console](https://search.google.com/search-console) and verify it (a DNS TXT record is easiest; or add the `google-site-verification` meta tag it gives you to the `<head>`).
2. Submit `https://www.adminix.io/sitemap.xml` under Sitemaps.
3. Use URL Inspection → Request indexing for the home page.
4. Check the structured data with the [Rich Results Test](https://search.google.com/test/rich-results).
5. Update `<lastmod>` in `sitemap.xml` when the page changes meaningfully.

If the landing page replaces an existing page on adminix.io, set up a 301 redirect from any old URLs so their ranking carries over.

## Customizing

- **Colors and fonts:** the tokens at the top of `styles.css`, matching the adminix.io look: light gray page (`--bg`), white rounded cards with soft shadows, Adminix blue (`--blue`, #2563EB) for buttons, pill labels and highlights, and dark navy (`--navy`) for the "With Adminix" and AI-validation panels. Headings use Inter Tight in Title Case, body text uses Inter. The red and yellow inside the sample posters are the sample retailer's colors, not Adminix's.
