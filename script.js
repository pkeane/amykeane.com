async function loadSite() {
  const res = await fetch('config.json');
  const config = await res.json();

  document.title = config.site.title || 'Portfolio';
  document.getElementById('site-title').textContent = config.site.title || '';
  document.getElementById('site-tagline').textContent = config.site.tagline || '';

  if (config.artist.bio) {
    document.getElementById('bio').textContent = config.artist.bio;
    document.getElementById('bio-section').hidden = false;
  }

  const contactBits = [];
  if (config.artist.location) contactBits.push(config.artist.location);
  if (config.artist.email) contactBits.push(`<a href="mailto:${config.artist.email}">${config.artist.email}</a>`);
  if (config.artist.instagram) {
    const handle = config.artist.instagram.replace(/^@/, '');
    contactBits.push(`<a href="https://instagram.com/${handle}">@${handle}</a>`);
  }
  document.getElementById('footer-contact').innerHTML = contactBits.join(' &middot; ');

  const featured = config.images.filter(img => img.featured);
  const rest = config.images.filter(img => !img.featured);

  if (featured.length > 0) {
    document.getElementById('featured-section').hidden = false;
    renderGallery(document.getElementById('featured-gallery'), featured);
  }

  renderGallery(document.getElementById('gallery'), rest);
}

function renderGallery(container, images) {
  container.innerHTML = '';
  for (const img of images) {
    const tile = document.createElement('div');
    tile.className = 'tile';

    const imgEl = document.createElement('img');
    imgEl.src = `images/${img.category}/${img.file}`;
    imgEl.alt = img.title || '';
    imgEl.loading = 'lazy';
    tile.appendChild(imgEl);

    if (img.title || img.year || img.medium) {
      const cap = document.createElement('div');
      cap.className = 'tile-caption';
      if (img.title) {
        const t = document.createElement('div');
        t.className = 'title';
        t.textContent = img.title;
        cap.appendChild(t);
      }
      const metaBits = [img.medium, img.year].filter(Boolean).join(', ');
      if (metaBits) {
        const m = document.createElement('div');
        m.className = 'meta';
        m.textContent = metaBits;
        cap.appendChild(m);
      }
      tile.appendChild(cap);
    }

    tile.addEventListener('click', () => openLightbox(img));
    container.appendChild(tile);
  }
}

function openLightbox(img) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = `images/${img.category}/${img.file}`;
  const captionBits = [img.title, img.medium, img.year].filter(Boolean).join(' &middot; ');
  document.getElementById('lightbox-caption').innerHTML = captionBits;
  lb.hidden = false;
}

function closeLightbox() {
  document.getElementById('lightbox').hidden = true;
}

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target.id === 'lightbox') closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

loadSite();
