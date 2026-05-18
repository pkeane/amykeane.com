# amykeane.com

Static portfolio site for Amy Keane's artwork. Hosted on GitHub Pages.

## Structure

- `index.html` — page shell
- `styles.css` — styling
- `script.js` — loads `config.json` and renders the gallery
- `config.json` — site content (artist info, image order, featured flags, captions)
- `images/` — artwork files

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

1. Drop the file into `images/`
2. Add an entry to the `images` array in `config.json`
3. Commit and push

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000
