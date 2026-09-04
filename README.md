# Mehraz Hossain Rumman — Portfolio

Personal portfolio site for Mehraz Hossain Rumman, software engineer in Dhaka, Bangladesh.
Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Structure

```
index.html                  # the whole site (single page)
styles.css                  # theme tokens, layout, responsive rules
script.js                   # theme toggle, mobile nav, scroll reveal, active nav link
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
  `assets/` and update the `<img src>` in the hero section of `index.html`.
- **KachaMorich link:** the resume lists a GitHub organization but not its URL. The card
  currently points at your GitHub profile. Update the `href` on the KachaMorich card.
- **DSP with FFT:** the resume links to a Google Drive file. Add the link if you want it public.
- **Renaming the repo:** the canonical URL in `index.html` and the home link in `404.html` both
  assume the `/rumman-portfolio/` path. Update them if the repo name changes.

## Customising

All colors are CSS custom properties at the top of `styles.css`. Change `--accent`,
`--grad-a` and `--grad-b` in both the dark and light blocks to re-theme the site.
