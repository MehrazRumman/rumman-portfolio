# Mehraz Hossain Rumman — Portfolio

Personal portfolio site for Mehraz Hossain Rumman, software engineer in Dhaka, Bangladesh.
Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Structure

```
index.html                  # the whole site (single page)
styles.css                  # theme tokens, layout, responsive rules
script.js                   # analytics config, theme toggle, nav, typewriter, spotlight, clock
404.html                    # GitHub Pages "not found" page
favicon.svg
assets/                     # drop your resume PDF here (see below)
.github/workflows/deploy.yml  # deploys to GitHub Pages on push to main
```

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

The repo is already wired to `https://github.com/MehrazRumman/rumman-portfolio`, so the site
will be served at **https://mehrazrumman.github.io/rumman-portfolio/**.

1. Push the `main` branch:

   ```sh
   git push -u origin main
   ```

2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The included workflow deploys on every push to `main`. The first run takes about a minute.

Alternatively, set **Source** to **Deploy from a branch** (`main`, `/ (root)`). The `.nojekyll`
file is already present so Pages serves the files as-is.

## Before you publish

- **Resume PDF:** the "Résumé" button links to `assets/Mehraz_Hossain_Rumman_Resume.pdf`.
  Copy your PDF into `assets/` with that exact name, or edit the `href` in `index.html`.
- **Profile photo:** the hero uses your GitHub avatar. To use a different photo, put it in
  `assets/` and update the `<img class="avatar">` source in `index.html`.
- **KachaMorich link:** the resume lists a GitHub organization but not its URL. The card
  currently points at your GitHub profile. Update the `href` on the KachaMorich card.
- **DSP with FFT:** the resume links to a Google Drive file. Add the link if you want it public.
- **Renaming the repo:** the canonical URL in `index.html` and the home link in `404.html` both
  assume the `/rumman-portfolio/` path. Update them if the repo name changes.

## Analytics (who is visiting)

Open `script.js` and fill in **one** of the two IDs at the top of the file. Nothing is loaded
until you do, and nothing is loaded when the site is opened locally.

```js
var ANALYTICS = {
  goatcounter: '',   // e.g. 'mehraz'  → dashboard at https://mehraz.goatcounter.com
  ga4: ''            // e.g. 'G-XXXXXXXXXX'
};
```

- **GoatCounter** (recommended): free for personal sites, no cookies, no consent banner. Sign up at
  https://www.goatcounter.com, pick a code, paste it, push. The dashboard shows visits, unique
  visitors, pages, referrers, countries, browsers and screen sizes.
- **Google Analytics 4**: create a property at https://analytics.google.com and paste the
  Measurement ID. More detail (real-time view, demographics) but heavier and cookie-based.

Neither can tell you *who* a visitor is by name. That is by design and by law. You get counts,
countries, referrers and devices.

## Customising

Colors are CSS custom properties at the top of `styles.css`: `--bg`, `--text`, `--accent` and
`--accent-2` (the gradient pair). Dark is the default; the `[data-theme="light"]` block holds the
light palette. Fonts (Geist and Geist Mono) load from Google Fonts in the `<head>` of `index.html`.

The hero terminal lines live in `index.html` inside `<pre id="terminal">`. Each `.tline` has a
`data-cmd` (the typed command) and its text content (the output).
