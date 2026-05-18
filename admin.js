let config = null;
let fileHandle = null;
let dragSrcIndex = null;

const statusEl = document.getElementById('status');
const tilesEl = document.getElementById('tiles');
const countEl = document.getElementById('count');

function setStatus(msg, kind = '') {
  statusEl.textContent = msg;
  statusEl.className = 'status ' + kind;
  if (msg && kind === 'success') {
    setTimeout(() => { if (statusEl.textContent === msg) statusEl.textContent = ''; }, 3000);
  }
}

function getNested(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setNested(obj, path, val) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((o, k) => (o[k] = o[k] || {}), obj);
  target[last] = val;
}

async function loadConfig() {
  try {
    const res = await fetch('config.json?_=' + Date.now());
    config = await res.json();
    renderAll();
    setStatus('Loaded config.json (' + config.images.length + ' images)', 'success');
  } catch (err) {
    setStatus('Failed to load config.json: ' + err.message, 'error');
  }
}

function renderAll() {
  for (const input of document.querySelectorAll('[data-meta]')) {
    const val = getNested(config, input.dataset.meta) || '';
    input.value = val;
    input.oninput = () => setNested(config, input.dataset.meta, input.value);
  }
  renderTiles();
}

function renderTiles() {
  tilesEl.innerHTML = '';
  countEl.textContent = `(${config.images.length})`;

  config.images.forEach((img, idx) => {
    const tile = document.createElement('div');
    tile.className = 'tile' + (img.featured ? ' featured' : '');
    tile.draggable = true;
    tile.dataset.index = idx;

    tile.innerHTML = `
      <span class="position-badge">${idx + 1}</span>
      <button type="button" class="featured-toggle ${img.featured ? 'active' : ''}" title="Toggle featured">
        ${img.featured ? '★' : '☆'}
      </button>
      <img class="tile-img" src="images/${img.category}/${img.file}" alt="" loading="lazy">
      <div class="tile-body">
        <div class="tile-filename">${img.category ? img.category + ' / ' : ''}${img.file}</div>
        <input class="tile-field title" data-field="title" placeholder="Title" value="${escapeAttr(img.title || '')}">
        <input class="tile-field meta" data-field="medium" placeholder="Medium" value="${escapeAttr(img.medium || '')}">
        <input class="tile-field meta" data-field="year" placeholder="Year" value="${escapeAttr(img.year || '')}">
      </div>
    `;

    tile.querySelector('.featured-toggle').addEventListener('click', e => {
      e.stopPropagation();
      img.featured = !img.featured;
      renderTiles();
    });

    for (const field of tile.querySelectorAll('.tile-field')) {
      field.addEventListener('input', () => {
        img[field.dataset.field] = field.value;
      });
      field.addEventListener('mousedown', e => e.stopPropagation());
    }

    tile.addEventListener('dragstart', e => {
      dragSrcIndex = idx;
      tile.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    tile.addEventListener('dragend', () => {
      tile.classList.remove('dragging');
      for (const t of tilesEl.querySelectorAll('.drop-target')) t.classList.remove('drop-target');
    });
    tile.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      for (const t of tilesEl.querySelectorAll('.drop-target')) t.classList.remove('drop-target');
      tile.classList.add('drop-target');
    });
    tile.addEventListener('drop', e => {
      e.preventDefault();
      const targetIdx = idx;
      if (dragSrcIndex === null || dragSrcIndex === targetIdx) return;
      const [moved] = config.images.splice(dragSrcIndex, 1);
      config.images.splice(targetIdx, 0, moved);
      dragSrcIndex = null;
      renderTiles();
    });

    tilesEl.appendChild(tile);
  });
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function configJson() {
  return JSON.stringify(config, null, 2) + '\n';
}

async function saveToDisk() {
  if (!('showSaveFilePicker' in window)) {
    setStatus('Browser does not support direct save. Use Download instead.', 'error');
    return;
  }
  try {
    if (!fileHandle) {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: 'config.json',
        types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
      });
    }
    const writable = await fileHandle.createWritable();
    await writable.write(configJson());
    await writable.close();
    setStatus('Saved to ' + fileHandle.name, 'success');
  } catch (err) {
    if (err.name !== 'AbortError') setStatus('Save failed: ' + err.message, 'error');
  }
}

function downloadConfig() {
  const blob = new Blob([configJson()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'config.json';
  a.click();
  URL.revokeObjectURL(url);
  setStatus('Downloaded config.json — replace the file in your repo and commit.', 'success');
}

document.getElementById('reload-btn').addEventListener('click', loadConfig);
document.getElementById('save-btn').addEventListener('click', saveToDisk);
document.getElementById('download-btn').addEventListener('click', downloadConfig);

window.addEventListener('beforeunload', e => {
  if (config) {
    e.preventDefault();
    e.returnValue = '';
  }
});

loadConfig();
