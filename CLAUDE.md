# amykeane.com

Static portfolio site for **Amy Keane's** artwork. Live at https://amykeane.com
(GitHub Pages, repo `pkeane/amykeane.com`, served from the **`main` branch root**;
`CNAME` holds the custom domain). No build step.

## The one thing to know
**All site content lives in `config.json`** — artist bio, image order, category
assignment, `featured` flags, captions. To change the site, edit that file and push.
Don't hand-edit the gallery HTML.

- Image **order** = order of entries in the `images` array.
- Each category's hero on the landing page = first image in that category with
  `"featured": true`, falling back to the category's first image.

## Layout
- `index.html` — landing page, three category hero tiles.
- `flowers.html`, `still_lifes.html`, `landscapes.html` — category galleries.
- `script.js` — renders landing vs. category page off `data-page` on `<body>`.
- `styles.css` — shared styling.
- `images/` — artwork in `flowers/`, `landscapes/`, `still_lifes/`.
- `admin.html` / `admin.js` / `admin.css` — local editing helper for `config.json`.

`README.md` has the fuller field-by-field guide to `config.json`.

## Working here
Deploy = commit and push to `main`. This is Amy's site, not Peter's — keep captions and
bio wording as she has them unless asked to change them.
