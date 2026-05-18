const CATEGORIES = [
  { key: 'flowers', label: 'Flowers', page: 'flowers.html' },
  { key: 'still_lifes', label: 'Still Lifes', page: 'still_lifes.html' },
  { key: 'landscapes', label: 'Landscapes', page: 'landscapes.html' }
];

async function loadSite() {
  const res = await fetch('config.json');
  const config = await res.json();

  document.title = config.site.title || 'Portfolio';
  const titleEl = document.getElementById('site-title');
  if (titleEl) titleEl.textContent = config.site.title || '';
  const taglineEl = document.getElementById('site-tagline');
  if (taglineEl) taglineEl.textContent = config.site.tagline || '';

  const contactBits = [];
  if (config.artist.location) contactBits.push(config.artist.location);
  if (config.artist.email) contactBits.push(`<a href="mailto:${config.artist.email}">${config.artist.email}</a>`);
  if (config.artist.instagram) {
    const handle = config.artist.instagram.replace(/^@/, '');
    contactBits.push(`<a href="https://instagram.com/${handle}">@${handle}</a>`);
  }
  const footerEl = document.getElementById('footer-contact');
  if (footerEl) footerEl.innerHTML = contactBits.join(' &middot; ');

  const page = document.body.dataset.page;
  if (page === 'home') {
    renderHome(config);
  } else if (page === 'category') {
    renderCategory(config);
  }
}

function pickHero(images, category) {
  const inCat = images.filter(i => i.category === category);
  return inCat.find(i => i.featured) || inCat[0] || null;
}

function renderHome(config) {
  if (config.artist.bio) {
    document.getElementById('bio').textContent = config.artist.bio;
    document.getElementById('bio-section').hidden = false;
  }

  const grid = document.getElementById('hero-grid');
  grid.innerHTML = '';

  for (const cat of CATEGORIES) {
    const hero = pickHero(config.images, cat.key);
    if (!hero) continue;

    const card = document.createElement('a');
    card.className = 'hero-card';
    card.href = cat.page;
    card.innerHTML = `
      <div class="hero-img-wrap">
        <img src="images/${hero.category}/${hero.file}" alt="${cat.label}" loading="lazy">
      </div>
      <h2 class="hero-label">${cat.label}</h2>
    `;
    grid.appendChild(card);
  }
}

function renderCategory(config) {
  const catKey = document.body.dataset.category;
  const catLabel = document.body.dataset.categoryLabel || catKey;
  document.title = `${catLabel} — ${config.site.title || ''}`;

  const images = config.images.filter(i => i.category === catKey);
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

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
    gallery.appendChild(tile);
  }

  wireLightbox();
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

function wireLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', e => { if (e.target.id === 'lightbox') closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

loadSite();
