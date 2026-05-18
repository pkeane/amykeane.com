# amykeane.com

Static portfolio site for Amy Keane's artwork. Hosted on GitHub Pages.

## Structure

- `index.html` — page shell
- `styles.css` — styling
- `script.js` — loads `config.json` and renders the gallery
- `config.json` — site content (artist info, image order, featured flags, captions)
- `images/` — artwork files, organized into `flowers/`, `landscapes/`, `still_lifes/`

## Editing the site

All content lives in `config.json`. To change the site, edit that file and push.

### Reordering images

Images appear in the order listed in the `images` array. Move entries up/down to change display order.

### Featuring images

Set `"featured": true` on any image to surface it in the "Featured" section at the top of the page.

### Captions

Each image can have a `title`, `year`, and `medium`. Leave any blank to omit.

```json
{
  "file": "IMG_1234.jpeg",
  "title": "Untitled",
  "year": "2024",
  "medium": "Oil on canvas",
  "featured": true
}
```

### Artist info

Edit `artist.bio`, `artist.location`, `artist.email`, `artist.instagram` in `config.json`. Empty fields are hidden.

## Adding new images

1. Drop the file into the appropriate subfolder: `images/flowers/`, `images/landscapes/`, or `images/still_lifes/`
2. Add an entry to the `images` array in `config.json` with `file`, `category`, and any captions
3. Commit and push

Example entry:
```json
{
  "file": "IMG_1234.jpeg",
  "category": "flowers",
  "title": "",
  "year": "",
  "medium": "",
  "featured": false
}
```

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Admin (drag-and-drop editor)

For a visual way to reorder, feature, and caption images without editing JSON by hand, open:

```
http://localhost:8000/admin.html
```

(requires Chrome or Edge for "Save to disk"; Firefox/Safari can use the "Download config.json" button instead)

In the admin page:
- **Drag tiles** to reorder
- Click the **☆** in the top-right of a tile to mark it featured
- Click **title / medium / year** fields to edit captions inline
- Edit site/artist info at the top
- Click **Save to disk** — the first time, it'll prompt you to pick the location (choose `config.json` in the repo and overwrite). Subsequent saves write to the same file automatically.
- Then commit and push.
