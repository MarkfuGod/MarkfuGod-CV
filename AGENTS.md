# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **static GitHub Pages site** (a personal CV/profile). It is
plain HTML + CSS + SVG with no build system, package manager, dependencies,
tests, or lint tooling. There is nothing to compile or install.

- **Run/preview locally:** serve the repo root with any static server, e.g.
  `python3 -m http.server 8000`, then open `http://localhost:8000/index.html`.
  (Python 3 is preinstalled.) Opening the HTML files directly in a browser also
  works, per `README.md`.
- **Entry points:** `index.html` (long profile), `index_en.html` /
  `index_zh.html` (academic resume EN/ZH), `index_en_industrial.html` /
  `index_zh_industrial.html` (industry resume EN/ZH). Pages cross-link via the
  nav bar. Styling lives in `profile.css` and `neurips.css`.
- **No lint/test/build:** there are no automated checks. Verify changes by
  loading the affected page(s) in a browser and checking layout/links.
