# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **static GitHub Pages site** (a personal CV / portfolio). There is no package manager, no build step, no backend/services, no database, and no automated tests or linters. Do not go looking for `package.json`, a `Makefile`, or CI config — none exist.

- **Content:** plain HTML pages (`index.html`, `index_en.html`, `index_zh.html`, `index_en_industrial.html`, `index_zh_industrial.html`, and the `*-Project-Highlight*.html` pages) plus `neurips.css` / `profile.css` and inline `*.svg` diagrams.
- **Run / preview locally:** serve the repo root with any static file server, e.g. `python3 -m http.server 8000` from `/workspace`, then open `http://localhost:8000/index.html`. The README suggests opening files directly, but a static server is preferable for browser-based testing.
- **Lint / test / build:** none applicable. "Deployment" is just GitHub Pages serving these files as-is.
- Several `*-Project-Highlight.html` root files are `<meta refresh>` / JS locale redirects to `_en` / `_zh` variants.
