# NineOrbit — Website

A static, dependency-free, fast-loading multi-page website for NineOrbit, a digital marketing agency based in Faridabad, Haryana, serving Delhi, Gurugram, Noida, Greater Noida and Ghaziabad.

## What's inside

```
nineorbit/
├── index.html                    Home
├── about.html                    About Us
├── services.html                 Services hub
├── website-development.html      Website Design & Development
├── seo.html                      SEO
├── google-ads.html               Google Ads / PPC
├── meta-ads.html                 Meta Ads
├── social-media-marketing.html   Social Media Marketing
├── ecommerce-marketing.html      Ecommerce Marketing
├── website-optimization.html     Website Optimization
├── local-seo.html                Local SEO
├── contact.html                  Contact + lead form
├── privacy-policy.html
├── terms-conditions.html
├── 404.html
├── sitemap.xml
├── robots.txt
├── css/style.css                 Design system + all component styles
├── js/main.js                    Mobile nav, form validation & submission
├── netlify/functions/contact.js  Serverless email handler (Resend)
└── netlify.toml                  Hosting + redirect configuration
```

No build step, no framework, no heavy JavaScript libraries — plain semantic HTML5, one CSS file and one small JS file, which is why the site loads fast by default. Google Fonts (Space Grotesk, Inter, IBM Plex Mono) are the only external assets loaded for design; hero/section imagery can be swapped in from Unsplash/Pexels URLs of your choosing — see "Images" below.

## Deploying (Netlify — recommended)

1. Push this folder to a GitHub repository (or drag-and-drop the folder into Netlify's dashboard).
2. In Netlify: **Add new site → Import an existing project**, and select the repository. Build command: none. Publish directory: `.` (already set in `netlify.toml`).
3. Netlify will automatically detect the function in `netlify/functions/contact.js` and expose it. The `netlify.toml` redirect makes it reachable at `/api/contact`, which is what `js/main.js` calls.
4. Add your custom domain (e.g. `www.nineorbit.in`) under **Domain settings**, and update the canonical/OG URLs in each page's `<head>` and in `sitemap.xml` if the final domain differs.

### Required environment variables (Site settings → Environment variables)

The contact form will not send email until these are set — the function returns a clear error instead of pretending to work:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | API key from a [Resend](https://resend.com) account (or swap the function for SendGrid/SMTP if preferred) |
| `CONTACT_TO_EMAIL` | Destination inbox — `sushil194ss@gmail.com` |
| `CONTACT_FROM_EMAIL` | A verified sending address/domain in your Resend account, e.g. `enquiries@nineorbit.in` |

If you'd rather not run a serverless function, the form can instead be pointed at a service like Formspree — change the `fetch('/api/contact', …)` call in `js/main.js` to your Formspree endpoint.

## Deploying (Vercel)

Vercel also works well: import the repo, framework preset "Other", no build command, output directory `.`. Convert `netlify/functions/contact.js` into a Vercel API route at `api/contact.js` (same logic, `export default async function handler(req, res) {...}` signature) and set the same three environment variables under **Project Settings → Environment Variables**.

## Before going live — checklist

- [ ] Replace `https://www.nineorbit.in/` in every page's canonical/OG tags and in `sitemap.xml` with your final domain.
- [ ] Set the three contact-form environment variables (above) and test a real submission.
- [ ] Add `images/logo.png` and `images/og-cover.jpg` (referenced in structured data / social previews) — a square logo mark and a 1200×630 social share image.
- [ ] Update the Google Maps embed query in `contact.html` if the office address changes.
- [ ] Swap any Unsplash/Pexels placeholder image URLs for final choices, keeping `loading="lazy"` and explicit `width`/`height` on each `<img>`.
- [ ] Run Lighthouse (Chrome DevTools) on the deployed site and confirm Performance/SEO/Accessibility/Best Practices scores.

## Images

No binary image assets are bundled in this deliverable. Section backgrounds are handled with CSS gradients and the hand-built SVG "orbit" diagram, so the site works fully without any images. If you'd like photography (team, workspace, devices, analytics dashboards), add `<img>` tags pointing to licensed Unsplash/Pexels URLs with:

```html
<img src="https://images.unsplash.com/..." alt="Descriptive alt text" width="800" height="600" loading="lazy">
```

## Editing content

Every page is plain HTML — open any `.html` file and edit the text directly. The two Python scripts (`../build.py`, `../pages.py`, `../pages2.py`, kept outside this folder) were used to generate the service/legal pages consistently and are not required to run the site; they're provided so future content changes across all pages can be made in one place and regenerated if useful.
