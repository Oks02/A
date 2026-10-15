# Adminix — landing page

A single-page marketing site. It's plain HTML, CSS and JS: no framework, no build step, no dependencies.

```
index.html          page markup
styles.css          all styles (design tokens at the top under :root)
main.js             scroll reveals, sticky mobile CTA, form submit
assets/favicon.png   browser tab icon (logo mark only)
assets/logo.png      full logo, transparent
assets/logo-mark.png 256px mark for home-screen icons
assets/og-image.png 1200×630 social share image (LinkedIn / Instagram / Slack previews)
```

## Page structure

Follows the standard B2B SaaS landing order: hero → social proof (ticker) → problem → solution (Today vs With Adminix) → how it works → use cases → who it's for → FAQ (objections) → final CTA.

## Run locally

```bash
python3 -m http.server 8000   # or: npx serve .
```

Open http://localhost:8000. To outline every placeholder in pink, open **http://localhost:8000/?placeholders**.

## Deploy

- **Netlify:** drag the folder into the dashboard, or connect the repo. Leave the build command empty and set the publish directory to `/`. The form works with no setup through Netlify Forms.
- **Vercel:** import the repo, pick the "Other" framework preset and leave the build command empty. The form needs an external endpoint (see the checklist below).

## Before going live: fill these in

In the code, each item is marked with an HTML comment `PLACEHOLDER(...)`. Run `grep -n PLACEHOLDER index.html` to list them.

| # | What | Where |
|---|------|-------|
| 1 | **Turnaround promise**: `[within 48 hours]` | Closing CTA copy |
| 2 | **Form endpoint**: Netlify needs nothing. On Vercel, set `action` to a Formspree, Basin or Tally URL | `<form class="lead-form">` (`form-endpoint`) |
| 3 | **Final CTA copy**: "See it with your own catalog" appears 3×, plus "Try your catalog" in the nav | Hero, form button, sticky mobile bar |
| 4 | **Hero visual**: the hero is typographic for now. When you have a real product screenshot or short screen recording of Adminix, add it at the `hero-visual` comment (`.hero-video` is already styled) | Hero (`hero-visual`) |
| 5 | **FAQ: data handling**: the "What happens to our data?" answer needs your hosting location, retention period and access policy | FAQ (`data-policy`) |
| 6 | **Domain**: replace `https://adminix.example` in the canonical, `og:url` and `og:image` tags. `og:image` **must** be an absolute URL for LinkedIn | `<head>` (`domain`) |
| 7 | **Contact**: confirm `hello@adminix.io`, and add the real LinkedIn URL | Footer (`contact`) |
| 8 | **Logo**: uses the older Adminix logo (`assets/logo.png`, made transparent and cropped from the PNG you supplied), on a white label in the header and footer. When the new logo is ready, replace `assets/logo.png`, `assets/logo-mark.png` (icon) and `assets/favicon.png`; prefer SVG if you have it, and update the `width`/`height` on the two `<img>` tags. Re-render the OG image too | `logo` |

Also check:
- **Case study:** the Fozzy Group section was removed until the contract is signed. When it is (and they approve being named), it can come back between Use cases and Who it's for, with real metrics and a quote; it's in git history (commit before "Remove Fozzy case study").
- The success message ("we'll be in touch within one business day") is a commitment. Edit it in `main.js` if you can't keep it.
- The Problem figures (100–200 posters a week, 3–5 days per campaign) and the "Today vs With Adminix" points in the Solution section (3–5 days vs hours, AI validation of prices, product names and brand guidelines, one manager instead of designers, subscription plus pay per poster) come from the Adminix investor deck. Re-check them if anything has changed.
- The mock prices use ₴. Change them in `index.html` if you're targeting a non-UA audience.
- No analytics are included. Add your snippet before `</head>`. A successful form submit already fires `gtag('event', 'generate_lead')` if gtag is present.
- After deploying, re-scrape the page in the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) so the share preview picks up the image.

## Customizing

- **Colors and fonts:** the tokens at the top of `styles.css`. Calm enterprise palette: `--signal` (deep Adminix navy-blue) for the hero, How it works and final CTA bands; white and light-gray content sections; `--accent` (Adminix blue) for labels and focus states; `--tag` (warm amber) only for primary buttons, the hanging price tag and the Adminix highlights. Headlines use Archivo at a condensed width; labels and data use JetBrains Mono. The red inside the sample posters is the sample retailer's color, not Adminix's.
