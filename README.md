# Adminix — landing page

A single-page marketing site. It's plain HTML, CSS and JS: no framework, no build step, no dependencies.

```
index.html          page markup (all 6 sections)
styles.css          all styles (design tokens at the top under :root)
main.js             hero animation, scroll reveals, sticky mobile CTA, form submit
assets/favicon.svg
assets/og-image.png 1200×630 social share image (LinkedIn / Instagram / Slack previews)
```

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
| 1 | **Fozzy Group metrics**: `[X]` creatives produced and `[Y%]` faster | Results section (`metric-1`, `metric-2`) |
| 2 | **Fozzy Group quote**: quote, name, title. You can also delete the `<figure>` | Results section (`quote`) |
| 3 | **Fozzy Group sign-off**: written OK to name them publicly, plus a logo if allowed. Check the line "One of Ukraine's largest retail groups…" | Results section (`fozzy-approval`) |
| 4 | **Turnaround promise**: `[within 48 hours]` | Closing CTA copy |
| 5 | **Form endpoint**: Netlify needs nothing. On Vercel, set `action` to a Formspree, Basin or Tally URL | `<form class="lead-form">` (`form-endpoint`) |
| 6 | **Final CTA copy**: "See it with your own catalog" appears 3×, plus "Try your catalog" in the nav | Hero, form button, sticky mobile bar |
| 7 | **Hero visual**: currently an animated CSS mock. To swap in a real video, GIF or screenshot, use the snippet in the comment | Hero (`hero-visual`) |
| 8 | **Domain**: replace `https://adminix.example` in the canonical, `og:url` and `og:image` tags. `og:image` **must** be an absolute URL for LinkedIn | `<head>` (`domain`) |
| 9 | **Contact**: email and LinkedIn URL | Footer (`contact`) |
| 10 | **Logo**: the current mark is a placeholder "A". Replace it with the real SVG in the nav, the footer, `favicon.svg` and the OG image | `logo` |

Also check:
- The success message ("we'll be in touch within one business day") is a commitment. Edit it in `main.js` if you can't keep it.
- The "120 SKUs × 6 formats × 3 channels = 2,160" figure in the Problem section is labeled *illustrative*. Swap in real numbers if you have them.
- The mock prices use ₴. Change them in `index.html` and `main.js` (`skus` array) if you're targeting a non-UA audience.
- No analytics are included. Add your snippet before `</head>`. A successful form submit already fires `gtag('event', 'generate_lead')` if gtag is present.
- After deploying, re-scrape the page in the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) so the share preview picks up the image.

## Customizing

- **Colors and fonts:** the tokens at the top of `styles.css`. The accent is `--accent` (vermilion) and the secondary is `--promo` (shelf-tag yellow).
- **Hero mock products:** the `skus` array in `main.js` and the matching `<li>` rows and `.prod-N` SVGs in `index.html`.
