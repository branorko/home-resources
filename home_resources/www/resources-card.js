/**
 * resources-card.js  v1.0.0
 * Home Resources — Lovelace custom card for Home Assistant
 *
 * Data stored via /api/home_resources/data  (Python backend → HA Store)
 * Supports multiple languages — auto-detected from hass.locale.language
 */

const VERSION = '1.0.0';
const API_URL = '/api/home_resources/data';
const POLL_MS = 20000;

/* ══════════════════════════════════════════════════════════════════
   TRANSLATIONS
   Add a new language by copying one block and translating the values.
   The key must match the BCP-47 language tag that HA reports
   (e.g. 'sk', 'en', 'cs', 'de', 'fr', 'hu', 'pl' …)
   ══════════════════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  sk: {
    title:            '🏠 Sklad',
    btnCategories:    '🏷 Kategórie',
    btnPhotos:        '📷 Fotky',
    btnAddItem:       '+ Položka',
    searchPlaceholder:'Hľadať...',
    allCategories:    'Všetky',
    units:            'ks',
    noItems:          'Zatiaľ žiadne položky. Kliknite na + Položka.',
    noResults:        'Žiadne položky zodpovedajú filtru.',
    loading:          '⏳ Načítavam...',
    saved:            'Uložené ✓',
    loaded:           'Načítané ✓',
    saveError:        'Chyba ukladania!',
    loadError:        'Chyba načítania',
    photo:            'Fotka:',
    noPhoto:          '— bez fotky —',
    dateNotSet:       'dátum nenastavený',
    expiredDays:      (d) => `expirovaný ${Math.abs(d)}d`,
    expiresToday:     'vyprší dnes!',
    expiresInDays:    (d) => `za ${d} dní`,
    addUnit:          '+ Kus',
    rename:           '✏️ Premenovať',
    delete:           '🗑 Odstrániť',
    renamePrompt:     'Nový názov:',
    deleteConfirm:    (name) => `Odstrániť "${name}"?`,
    modalAddTitle:    'Nová položka',
    labelName:        'Názov',
    namePlaceholder:  'napr. Mlieko',
    labelCategory:    'Kategória',
    btnCancel:        'Zrušiť',
    btnAdd:           'Pridať',
    modalPhotosTitle: 'Knižnica fotiek',
    labelAddPhoto:    'Pridať fotku',
    photoNamePh:      'Názov fotky...',
    photoUrlPh:       'https://... (URL obrázka)',
    btnAddUrl:        'Pridať URL',
    btnClose:         'Zavrieť',
    deletePhotoConfirm:(name) => `Zmazať fotku "${name}"?`,
    deletePhotoBtn:   '× zmazať',
    modalCatsTitle:   'Kategórie',
    newCategoryPh:    'Nová kategória...',
    btnAddCat:        '+ Pridať',
    deleteCatConfirm: (name, n) => `Kategória "${name}" sa používa v ${n} položkách. Naozaj zmazať?`,
    defaultCategories:['Potraviny', 'Hygiena', 'Lekárnička'],
    defaultPhotoNames:['Pasta', 'Oil', 'Rice', 'Shampoo', 'Soap', 'Medicine'],
  },
  en: {
    title:            '🏠 Inventory',
    btnCategories:    '🏷 Categories',
    btnPhotos:        '📷 Photos',
    btnAddItem:       '+ Item',
    searchPlaceholder:'Search...',
    allCategories:    'All',
    units:            'pcs',
    noItems:          'No items yet. Click + Item to add one.',
    noResults:        'No items match the current filter.',
    loading:          '⏳ Loading...',
    saved:            'Saved ✓',
    loaded:           'Loaded ✓',
    saveError:        'Save error!',
    loadError:        'Load error',
    photo:            'Photo:',
    noPhoto:          '— no photo —',
    dateNotSet:       'no expiry date',
    expiredDays:      (d) => `expired ${Math.abs(d)}d ago`,
    expiresToday:     'expires today!',
    expiresInDays:    (d) => `in ${d} days`,
    addUnit:          '+ Unit',
    rename:           '✏️ Rename',
    delete:           '🗑 Delete',
    renamePrompt:     'New name:',
    deleteConfirm:    (name) => `Delete "${name}"?`,
    modalAddTitle:    'New Item',
    labelName:        'Name',
    namePlaceholder:  'e.g. Milk',
    labelCategory:    'Category',
    btnCancel:        'Cancel',
    btnAdd:           'Add',
    modalPhotosTitle: 'Photo Library',
    labelAddPhoto:    'Add photo',
    photoNamePh:      'Photo name...',
    photoUrlPh:       'https://... (image URL)',
    btnAddUrl:        'Add URL',
    btnClose:         'Close',
    deletePhotoConfirm:(name) => `Delete photo "${name}"?`,
    deletePhotoBtn:   '× remove',
    modalCatsTitle:   'Categories',
    newCategoryPh:    'New category...',
    btnAddCat:        '+ Add',
    deleteCatConfirm: (name, n) => `Category "${name}" is used in ${n} items. Delete anyway?`,
    defaultCategories:['Food', 'Hygiene', 'Medicine'],
    defaultPhotoNames:['Pasta', 'Oil', 'Rice', 'Shampoo', 'Soap', 'Medicine'],
  },
  cs: {
    title:            '🏠 Sklad',
    btnCategories:    '🏷 Kategorie',
    btnPhotos:        '📷 Fotky',
    btnAddItem:       '+ Položka',
    searchPlaceholder:'Hledat...',
    allCategories:    'Vše',
    units:            'ks',
    noItems:          'Zatím žádné položky. Klikněte na + Položka.',
    noResults:        'Žádné položky neodpovídají filtru.',
    loading:          '⏳ Načítám...',
    saved:            'Uloženo ✓',
    loaded:           'Načteno ✓',
    saveError:        'Chyba ukládání!',
    loadError:        'Chyba načtení',
    photo:            'Fotka:',
    noPhoto:          '— bez fotky —',
    dateNotSet:       'datum nenastaveno',
    expiredDays:      (d) => `prošlé ${Math.abs(d)}d`,
    expiresToday:     'vyprší dnes!',
    expiresInDays:    (d) => `za ${d} dní`,
    addUnit:          '+ Kus',
    rename:           '✏️ Přejmenovat',
    delete:           '🗑 Odstranit',
    renamePrompt:     'Nový název:',
    deleteConfirm:    (name) => `Odstranit "${name}"?`,
    modalAddTitle:    'Nová položka',
    labelName:        'Název',
    namePlaceholder:  'např. Mléko',
    labelCategory:    'Kategorie',
    btnCancel:        'Zrušit',
    btnAdd:           'Přidat',
    modalPhotosTitle: 'Knihovna fotek',
    labelAddPhoto:    'Přidat fotku',
    photoNamePh:      'Název fotky...',
    photoUrlPh:       'https://... (URL obrázku)',
    btnAddUrl:        'Přidat URL',
    btnClose:         'Zavřít',
    deletePhotoConfirm:(name) => `Smazat fotku "${name}"?`,
    deletePhotoBtn:   '× smazat',
    modalCatsTitle:   'Kategorie',
    newCategoryPh:    'Nová kategorie...',
    btnAddCat:        '+ Přidat',
    deleteCatConfirm: (name, n) => `Kategorie "${name}" se používá v ${n} položkách. Opravdu smazat?`,
    defaultCategories:['Potraviny', 'Hygiena', 'Lékárna'],
    defaultPhotoNames:['Těstoviny', 'Olej', 'Rýže', 'Šampon', 'Mýdlo', 'Léky'],
  },
  de: {
    title:            '🏠 Lager',
    btnCategories:    '🏷 Kategorien',
    btnPhotos:        '📷 Fotos',
    btnAddItem:       '+ Artikel',
    searchPlaceholder:'Suchen...',
    allCategories:    'Alle',
    units:            'St.',
    noItems:          'Noch keine Artikel. Klicken Sie auf + Artikel.',
    noResults:        'Keine Artikel entsprechen dem Filter.',
    loading:          '⏳ Laden...',
    saved:            'Gespeichert ✓',
    loaded:           'Geladen ✓',
    saveError:        'Speicherfehler!',
    loadError:        'Ladefehler',
    photo:            'Foto:',
    noPhoto:          '— kein Foto —',
    dateNotSet:       'kein Ablaufdatum',
    expiredDays:      (d) => `abgelaufen vor ${Math.abs(d)}T`,
    expiresToday:     'läuft heute ab!',
    expiresInDays:    (d) => `in ${d} Tagen`,
    addUnit:          '+ Einheit',
    rename:           '✏️ Umbenennen',
    delete:           '🗑 Löschen',
    renamePrompt:     'Neuer Name:',
    deleteConfirm:    (name) => `"${name}" löschen?`,
    modalAddTitle:    'Neuer Artikel',
    labelName:        'Name',
    namePlaceholder:  'z.B. Milch',
    labelCategory:    'Kategorie',
    btnCancel:        'Abbrechen',
    btnAdd:           'Hinzufügen',
    modalPhotosTitle: 'Fotobibliothek',
    labelAddPhoto:    'Foto hinzufügen',
    photoNamePh:      'Fotoname...',
    photoUrlPh:       'https://... (Bild-URL)',
    btnAddUrl:        'URL hinzufügen',
    btnClose:         'Schließen',
    deletePhotoConfirm:(name) => `Foto "${name}" löschen?`,
    deletePhotoBtn:   '× löschen',
    modalCatsTitle:   'Kategorien',
    newCategoryPh:    'Neue Kategorie...',
    btnAddCat:        '+ Hinzufügen',
    deleteCatConfirm: (name, n) => `Kategorie "${name}" wird in ${n} Artikeln verwendet. Trotzdem löschen?`,
    defaultCategories:['Lebensmittel', 'Hygiene', 'Medizin'],
    defaultPhotoNames:['Nudeln', 'Öl', 'Reis', 'Shampoo', 'Seife', 'Medizin'],
  },
};

/** Resolve the best matching locale from hass.locale.language */
function resolveLocale(hassLang) {
  if (!hassLang) return TRANSLATIONS.en;
  // exact match first (e.g. 'sk', 'en', 'cs', 'de')
  const base = hassLang.split('-')[0].toLowerCase();
  return TRANSLATIONS[base] || TRANSLATIONS.en;
}

/* ─── Helpers ──────────────────────────────────────────────────── */

function svgThumb(emoji, bg) {
  return `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='8' fill='${encodeURIComponent(bg)}'/><text x='32' y='45' font-size='32' text-anchor='middle'>${emoji}</text></svg>`;
}

const PHOTO_EMOJIS = [
  { emoji: '🍝', bg: '#FAEEDA' },
  { emoji: '🫒', bg: '#EAF3DE' },
  { emoji: '🍚', bg: '#F1EFE8' },
  { emoji: '🧴', bg: '#E6F1FB' },
  { emoji: '🧼', bg: '#FBEAF0' },
  { emoji: '💊', bg: '#FCEBEB' },
];

function buildDefaultPhotos(t) {
  return PHOTO_EMOJIS.map((p, i) => ({
    id: `dp${i + 1}`,
    name: t.defaultPhotoNames[i] || p.emoji,
    src: svgThumb(p.emoji, p.bg),
  }));
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function daysDiff(dateStr) {
  if (!dateStr) return Infinity;
  return Math.floor((new Date(dateStr) - new Date(todayStr())) / 86400000);
}

function itemColor(item) {
  const units = item.units || [];
  if (units.length === 0) return 'red';
  if (units.some(u => u.expiry && daysDiff(u.expiry) <= 180)) return 'yellow';
  if (units.length === 1) return 'orange';
  return 'green';
}

function uid() { return Math.random().toString(36).slice(2, 10); }

function nextId(arr) { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1; }

/* ─── CSS ──────────────────────────────────────────────────────── */

const CSS = `
:host { display: block; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.card {
  padding: 12px 14px;
  font-family: var(--primary-font-family, 'Roboto', sans-serif);
  color: var(--primary-text-color);
  background: var(--card-background-color, #fff);
  border-radius: var(--ha-card-border-radius, 12px);
  max-width: 720px;
}

/* ── Header ── */
.header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
.header-title { flex: 1; font-size: 16px; font-weight: 600; min-width: 100px; }
.header-version { font-size: 10px; color: var(--secondary-text-color); align-self: flex-end; margin-bottom: 2px; }

.btn {
  padding: 5px 12px; border-radius: 20px;
  border: 1px solid var(--divider-color, #e0e0e0);
  background: var(--secondary-background-color, #f5f5f5);
  color: var(--primary-text-color);
  font-size: 12px; cursor: pointer; transition: all .15s; white-space: nowrap;
  font-family: inherit;
}
.btn:hover { background: var(--primary-color, #03a9f4); color: #fff; border-color: transparent; }
.btn-primary { background: var(--primary-color, #03a9f4); color: #fff; border-color: transparent; }
.btn-primary:hover { opacity: .85; }
.btn-danger  { color: #e57373; }
.btn-danger:hover  { background: #e57373; color: #fff; border-color: transparent; }

/* ── Search ── */
.search-wrap { position: relative; margin-bottom: 8px; }
.search-wrap input {
  width: 100%; padding: 7px 12px 7px 32px; font-size: 13px;
  border: 1px solid var(--divider-color, #e0e0e0);
  border-radius: 20px; background: var(--secondary-background-color, #f5f5f5);
  color: var(--primary-text-color); font-family: inherit; outline: none;
}
.search-wrap input:focus { border-color: var(--primary-color, #03a9f4); }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 14px; pointer-events: none; }

/* ── Category filter ── */
.category-bar { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
.category-pill {
  padding: 4px 11px; font-size: 12px; border-radius: 16px;
  border: 1px solid var(--divider-color, #e0e0e0);
  background: var(--secondary-background-color, #f5f5f5);
  color: var(--secondary-text-color); cursor: pointer; transition: all .15s; font-family: inherit;
}
.category-pill.active { background: var(--primary-color, #03a9f4); color: #fff; border-color: transparent; }

/* ── Item list ── */
.item-list { display: flex; flex-direction: column; gap: 5px; }

.item-card {
  border: 1px solid var(--divider-color, #e0e0e0);
  border-radius: 10px; overflow: hidden; cursor: pointer;
  background: var(--card-background-color, #fff); transition: box-shadow .15s;
}
.item-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,.1); }
.item-card.red    { border-color: #e57373; background: #fff5f5; }
.item-card.yellow { border-color: #ffb300; background: #fffde7; }
.item-card.green  { border-color: #81c784; background: #f1f8e9; }
.item-card.orange { border-color: #ff8a65; background: #fff3e0; }

.item-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; }

.item-thumb {
  width: 38px; height: 38px; border-radius: 8px; object-fit: cover; flex-shrink: 0;
  border: 1px solid var(--divider-color, #e0e0e0); cursor: zoom-in;
}
.item-thumb-empty {
  width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
  background: var(--secondary-background-color, #f5f5f5);
  border: 1px dashed var(--divider-color, #e0e0e0);
  display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.item-info  { flex: 1; min-width: 0; }
.item-name  { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-meta  { font-size: 11px; color: var(--secondary-text-color); margin-top: 1px; }
.item-count { font-size: 14px; font-weight: 600; color: var(--primary-color, #03a9f4); white-space: nowrap; }
.item-arrow { color: var(--secondary-text-color); font-size: 12px; margin-left: 4px; }

/* ── Detail panel ── */
.item-detail {
  border-top: 1px solid var(--divider-color, #e0e0e0);
  padding: 10px 12px;
  background: var(--secondary-background-color, #f9f9f9);
}
.photo-select-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.photo-select-row label { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; }
.photo-select-row select {
  flex: 1; padding: 5px 8px; border-radius: 8px;
  border: 1px solid var(--divider-color, #e0e0e0);
  background: var(--secondary-background-color, #f5f5f5);
  font-size: 12px; color: var(--primary-text-color); font-family: inherit;
}

.unit-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
.unit-row {
  display: flex; align-items: center; gap: 8px; padding: 5px 8px;
  border-radius: 8px; background: var(--card-background-color, #fff);
  border: 1px solid var(--divider-color, #e0e0e0);
}
.unit-row.expiring { border-color: #ffb300; background: #fffde7; }
.unit-row.expired  { border-color: #e57373; background: #fff5f5; }
.unit-num  { font-size: 13px; font-weight: 600; min-width: 22px; text-align: center; color: var(--secondary-text-color); }
.unit-date input {
  border: none; background: transparent; font-size: 12px;
  color: var(--secondary-text-color); font-family: inherit; cursor: pointer; outline: none;
}
.unit-date input:focus { background: var(--divider-color, #e0e0e0); border-radius: 4px; padding: 1px 4px; }
.unit-label { flex: 1; font-size: 11px; color: var(--secondary-text-color); }
.unit-delete { font-size: 16px; cursor: pointer; color: var(--secondary-text-color); line-height: 1; }
.unit-delete:hover { color: #e57373; }

.item-actions { display: flex; gap: 6px; flex-wrap: wrap; }

/* ── Empty state ── */
.empty { text-align: center; padding: 24px 12px; color: var(--secondary-text-color); font-size: 13px; }

/* ── Status bar ── */
.status-bar { font-size: 11px; color: var(--secondary-text-color); text-align: right; margin-top: 6px; min-height: 15px; }
.status-bar.error { color: #e57373; }

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 9000;
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.modal-box {
  background: var(--card-background-color, #fff); border-radius: 14px;
  padding: 20px; width: 100%; max-width: 440px;
  box-shadow: 0 8px 32px rgba(0,0,0,.25);
  display: flex; flex-direction: column; gap: 12px;
  max-height: 90vh; overflow-y: auto;
}
.modal-title { font-size: 16px; font-weight: 600; }
.modal-box label { font-size: 12px; color: var(--secondary-text-color); display: block; margin-bottom: 3px; }
.modal-box input[type=text],
.modal-box input[type=url],
.modal-box select {
  width: 100%; padding: 8px 10px;
  border: 1px solid var(--divider-color, #e0e0e0);
  border-radius: 8px; font-size: 14px;
  background: var(--secondary-background-color, #f5f5f5);
  color: var(--primary-text-color); font-family: inherit; outline: none;
}
.modal-box input:focus, .modal-box select:focus { border-color: var(--primary-color, #03a9f4); }
.modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }

/* ── Photo library ── */
.photo-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px; max-height: 260px; overflow-y: auto; padding: 2px 0;
}
.photo-cell {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 6px; border-radius: 8px;
  border: 1px solid transparent; cursor: pointer; transition: all .15s;
}
.photo-cell:hover { background: var(--secondary-background-color, #f5f5f5); border-color: var(--divider-color, #e0e0e0); }
.photo-thumb  { width: 54px; height: 54px; border-radius: 8px; object-fit: cover; }
.photo-label  { font-size: 10px; text-align: center; color: var(--secondary-text-color); word-break: break-word; }
.photo-remove { font-size: 10px; color: #e57373; cursor: pointer; }
.photo-remove:hover { text-decoration: underline; }
.photo-add-row { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.photo-add-row input { font-size: 12px; }

/* ── Category manager ── */
.category-list { display: flex; flex-direction: column; gap: 4px; max-height: 250px; overflow-y: auto; }
.category-row {
  display: flex; align-items: center; gap: 8px; padding: 6px 10px;
  border-radius: 8px; border: 1px solid var(--divider-color, #e0e0e0);
  background: var(--card-background-color, #fff);
}
.category-input {
  flex: 1; border: none; background: transparent; font-size: 14px;
  color: var(--primary-text-color); font-family: inherit; outline: none;
}
.category-input:focus { background: var(--secondary-background-color, #f5f5f5); border-radius: 4px; padding: 1px 6px; }
.category-count  { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; }
.category-delete { font-size: 16px; cursor: pointer; color: var(--secondary-text-color); }
.category-delete:hover { color: #e57373; }
.category-add-row { display: flex; gap: 6px; }
.category-add-row input { flex: 1; }

/* ── Lightbox ── */
.lightbox-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.82); z-index: 9999;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.lightbox-image { max-width: 90vw; max-height: 90vh; border-radius: 12px; }
`;

/* ══════════════════════════════════════════════════════════════════
   CUSTOM ELEMENT
   ══════════════════════════════════════════════════════════════════ */

class InventoryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._hass       = null;
    this._data       = null;   // { items, categories, photos }
    this._t          = TRANSLATIONS.en;  // active translations
    this._loading    = true;
    this._status     = '';
    this._statusError = false;
    this._saveTimer  = null;
    this._pollTimer  = null;

    // UI state
    this._expandedItems = new Set();
    this._activeCategory = null;   // null = "All"
    this._searchQuery    = '';
    this._activeModal    = null;   // null | 'add-item' | 'photos' | 'categories'
  }

  /* ── HA lifecycle ────────────────────────────── */
  set hass(hass) {
    const firstCall = !this._hass;
    this._hass = hass;

    // Update translations when HA language changes
    const lang = hass?.locale?.language;
    this._t = resolveLocale(lang);
    // Keep "All" filter label in sync with language
    if (this._activeCategory === null) { /* no-op, handled in render */ }

    if (firstCall) {
      this._load().then(() => this._render());
      this._pollTimer = setInterval(() => this._load().then(() => this._render()), POLL_MS);
    }
  }

  disconnectedCallback() {
    clearInterval(this._pollTimer);
    clearTimeout(this._saveTimer);
  }

  setConfig(config) { this._config = config || {}; }
  static getConfigElement() { return null; }
  static getStubConfig()    { return {}; }

  /* ── API ─────────────────────────────────────── */
  _token() { return this._hass?.auth?.data?.access_token || ''; }

  async _load() {
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: 'Bearer ' + this._token() },
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();

      // Migration: fill missing fields
      if (!data.photos || !data.photos.length) data.photos = buildDefaultPhotos(this._t);
      if (!data.categories || !data.categories.length) data.categories = [...this._t.defaultCategories];
      if (!data.items) data.items = [];

      this._data    = data;
      this._loading = false;
      this._setStatus(this._t.loaded);
    } catch (err) {
      console.error('[resources-card] load:', err);
      if (!this._data) {
        this._data = {
          items: [],
          categories: [...this._t.defaultCategories],
          photos: buildDefaultPhotos(this._t),
        };
        this._loading = false;
      }
      this._setStatus(this._t.loadError, true);
    }
  }

  _save(immediate = false) {
    clearTimeout(this._saveTimer);
    const doSave = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + this._token(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this._data),
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        this._setStatus(this._t.saved);
      } catch (err) {
        console.error('[resources-card] save:', err);
        this._setStatus(this._t.saveError, true);
      }
    };
    if (immediate) doSave();
    else this._saveTimer = setTimeout(doSave, 600);
  }

  _setStatus(msg, error = false) {
    this._status      = msg;
    this._statusError = error;
    const el = this.shadowRoot?.querySelector('.status-bar');
    if (el) { el.textContent = msg; el.className = 'status-bar' + (error ? ' error' : ''); }
    if (!error) setTimeout(() => {
      if (this._status === msg) { this._status = ''; if (el) el.textContent = ''; }
    }, 3000);
  }

  /* ── Data helpers ────────────────────────────── */
  _photos()        { return this._data.photos || []; }
  _photoById(id)   { return this._photos().find(p => p.id === id); }

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  _render() {
    const root = this.shadowRoot;
    const t    = this._t;

    if (!root.querySelector('style')) {
      const s = document.createElement('style'); s.textContent = CSS; root.appendChild(s);
    }

    let card = root.querySelector('.card');
    if (!card) { card = el('div', 'card'); root.appendChild(card); }

    if (this._loading) { card.innerHTML = `<div class="empty">${t.loading}</div>`; return; }

    const { items = [], categories = [] } = this._data;

    // Build filtered list
    const searchLow = this._searchQuery.toLowerCase();
    const visibleItems = items.filter(item => {
      if (this._activeCategory !== null && item.category !== this._activeCategory) return false;
      if (searchLow && !item.name.toLowerCase().includes(searchLow) && !(item.category || '').toLowerCase().includes(searchLow)) return false;
      return true;
    });

    card.innerHTML = '';

    /* Header */
    const header = el('div', 'header');
    header.appendChild(elText('div', t.title, 'header-title'));
    header.appendChild(elText('span', 'v' + VERSION, 'header-version'));
    const btnCats  = btn(t.btnCategories); btnCats.onclick  = () => this._openModal('categories');
    const btnPics  = btn(t.btnPhotos);     btnPics.onclick  = () => this._openModal('photos');
    const btnAdd   = btn(t.btnAddItem);    btnAdd.onclick   = () => this._openModal('add-item');
    btnAdd.classList.add('btn-primary');
    header.appendChild(btnCats); header.appendChild(btnPics); header.appendChild(btnAdd);
    card.appendChild(header);

    /* Search */
    const searchWrap = el('div', 'search-wrap');
    searchWrap.appendChild(elText('span', '🔍', 'search-icon'));
    const searchInput = document.createElement('input');
    searchInput.type = 'text'; searchInput.placeholder = t.searchPlaceholder; searchInput.value = this._searchQuery;
    searchInput.oninput = e => { this._searchQuery = e.target.value; this._render(); };
    searchWrap.appendChild(searchInput);
    card.appendChild(searchWrap);

    /* Category filter bar */
    const categoryBar = el('div', 'category-bar');
    const allPill = elText('button', t.allCategories, 'category-pill' + (this._activeCategory === null ? ' active' : ''));
    allPill.onclick = () => { this._activeCategory = null; this._render(); };
    categoryBar.appendChild(allPill);
    categories.forEach(cat => {
      const pill = elText('button', cat, 'category-pill' + (this._activeCategory === cat ? ' active' : ''));
      pill.onclick = () => { this._activeCategory = cat; this._render(); };
      categoryBar.appendChild(pill);
    });
    card.appendChild(categoryBar);

    /* Item list */
    const itemList = el('div', 'item-list');
    if (!visibleItems.length) {
      itemList.appendChild(elText('div', items.length ? t.noResults : t.noItems, 'empty'));
    } else {
      visibleItems.forEach(item => this._renderItem(itemList, item));
    }
    card.appendChild(itemList);

    /* Status */
    card.appendChild(elText('div', this._status, 'status-bar' + (this._statusError ? ' error' : '')));

    /* Modal */
    if (this._activeModal) this._renderModal(card);
  }

  _renderItem(listEl, item) {
    const t     = this._t;
    const color = itemColor(item);
    const card  = el('div', 'item-card ' + color);

    /* Summary row */
    const row = el('div', 'item-row');
    row.onclick = () => {
      if (this._expandedItems.has(item.id)) this._expandedItems.delete(item.id);
      else this._expandedItems.add(item.id);
      this._render();
    };

    const photo = this._photoById(item.photoId);
    if (photo) {
      const img = document.createElement('img');
      img.className = 'item-thumb'; img.src = photo.src; img.alt = photo.name;
      img.onclick = e => { e.stopPropagation(); this._showLightbox(photo.src); };
      row.appendChild(img);
    } else {
      row.appendChild(elText('div', '📦', 'item-thumb-empty'));
    }

    const info = el('div', 'item-info');
    info.appendChild(elText('div', item.name, 'item-name'));
    info.appendChild(elText('div', item.category || '—', 'item-meta'));
    row.appendChild(info);
    row.appendChild(elText('div', (item.units || []).length + ' ' + t.units, 'item-count'));
    row.appendChild(elText('div', this._expandedItems.has(item.id) ? '▲' : '▼', 'item-arrow'));
    card.appendChild(row);

    /* Expanded detail */
    if (this._expandedItems.has(item.id)) {
      card.appendChild(this._buildDetail(item));
    }

    listEl.appendChild(card);
  }

  _buildDetail(item) {
    const t      = this._t;
    const detail = el('div', 'item-detail');

    /* Photo selector */
    const photoRow = el('div', 'photo-select-row');
    photoRow.appendChild(elText('label', t.photo, ''));
    const photoSelect = document.createElement('select');
    const noneOpt = document.createElement('option'); noneOpt.value = ''; noneOpt.textContent = t.noPhoto;
    photoSelect.appendChild(noneOpt);
    this._photos().forEach(p => {
      const opt = document.createElement('option'); opt.value = p.id; opt.textContent = p.name;
      if (p.id === item.photoId) opt.selected = true;
      photoSelect.appendChild(opt);
    });
    photoSelect.onchange = e => { item.photoId = e.target.value || null; this._save(); this._render(); };
    photoRow.appendChild(photoSelect);
    detail.appendChild(photoRow);

    /* Unit list */
    const unitList = el('div', 'unit-list');
    (item.units || []).forEach((unit, idx) => {
      const diff = daysDiff(unit.expiry);
      const rowClass = 'unit-row' + (unit.expiry && diff < 0 ? ' expired' : unit.expiry && diff <= 180 ? ' expiring' : '');
      const unitRow = el('div', rowClass);

      unitRow.appendChild(elText('span', '#' + (idx + 1), 'unit-num'));

      const dateWrap = el('div', 'unit-date');
      const dateInput = document.createElement('input');
      dateInput.type = 'date'; dateInput.value = unit.expiry || '';
      dateInput.onchange = e => { unit.expiry = e.target.value || null; this._save(); this._render(); };
      dateWrap.appendChild(dateInput);
      unitRow.appendChild(dateWrap);

      let label = t.dateNotSet;
      if (unit.expiry) {
        label = diff < 0 ? t.expiredDays(diff) : diff === 0 ? t.expiresToday : t.expiresInDays(diff);
      }
      unitRow.appendChild(elText('span', label, 'unit-label'));

      const delBtn = elText('span', '✕', 'unit-delete');
      delBtn.onclick = () => { item.units = item.units.filter(u => u.id !== unit.id); this._save(); this._render(); };
      unitRow.appendChild(delBtn);
      unitList.appendChild(unitRow);
    });
    detail.appendChild(unitList);

    /* Actions */
    const actions = el('div', 'item-actions');

    const addUnit = btn(t.addUnit);
    addUnit.onclick = () => {
      if (!item.units) item.units = [];
      item.units.push({ id: nextId(item.units), expiry: null });
      this._save(); this._render();
    };

    const renameBtn = btn(t.rename);
    renameBtn.onclick = () => {
      const name = prompt(t.renamePrompt, item.name); if (!name) return;
      item.name = name; this._save(); this._render();
    };

    const deleteBtn = btn(t.delete);
    deleteBtn.classList.add('btn-danger');
    deleteBtn.onclick = () => {
      if (!confirm(t.deleteConfirm(item.name))) return;
      this._data.items = this._data.items.filter(x => x.id !== item.id);
      this._expandedItems.delete(item.id);
      this._save(); this._render();
    };

    actions.appendChild(addUnit); actions.appendChild(renameBtn); actions.appendChild(deleteBtn);
    detail.appendChild(actions);
    return detail;
  }

  /* ══════════════════════════════════════════════
     MODALS
  ══════════════════════════════════════════════ */
  _openModal(type) { this._activeModal = type; this._render(); }
  _closeModal()    { this._activeModal = null; this._render(); }

  _renderModal(card) {
    const overlay = el('div', 'modal-overlay');
    overlay.onclick = e => { if (e.target === overlay) this._closeModal(); };
    card.appendChild(overlay);
    if (this._activeModal === 'add-item')    this._modalAddItem(overlay);
    if (this._activeModal === 'photos')      this._modalPhotos(overlay);
    if (this._activeModal === 'categories')  this._modalCategories(overlay);
  }

  _modalAddItem(overlay) {
    const t = this._t;
    const box = el('div', 'modal-box');
    box.appendChild(elText('div', t.modalAddTitle, 'modal-title'));
    box.appendChild(elText('label', t.labelName, ''));
    const nameInput = input('text', t.namePlaceholder); box.appendChild(nameInput);
    box.appendChild(elText('label', t.labelCategory, ''));
    const catSelect = document.createElement('select');
    (this._data.categories || []).forEach(c => {
      const o = document.createElement('option'); o.value = c; o.textContent = c; catSelect.appendChild(o);
    });
    box.appendChild(catSelect);
    const actions = el('div', 'modal-actions');
    const cancelBtn = btn(t.btnCancel); cancelBtn.onclick = () => this._closeModal();
    const addBtn = btn(t.btnAdd); addBtn.classList.add('btn-primary');
    addBtn.onclick = () => {
      const name = nameInput.value.trim(); if (!name) { nameInput.focus(); return; }
      this._data.items.push({ id: nextId(this._data.items), name, category: catSelect.value || '', photoId: null, units: [] });
      this._save(); this._closeModal();
    };
    actions.appendChild(cancelBtn); actions.appendChild(addBtn);
    box.appendChild(actions);
    overlay.appendChild(box);
    setTimeout(() => nameInput.focus(), 40);
  }

  _modalPhotos(overlay) {
    const t   = this._t;
    const box = el('div', 'modal-box');
    box.appendChild(elText('div', t.modalPhotosTitle, 'modal-title'));

    const grid = el('div', 'photo-grid');
    this._buildPhotoGrid(grid);
    box.appendChild(grid);

    box.appendChild(elText('label', t.labelAddPhoto, ''));
    const nameInput = input('text', t.photoNamePh); box.appendChild(nameInput);

    const addRow = el('div', 'photo-add-row');
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.fontSize = '12px';
    fileInput.onchange = e => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const name = nameInput.value.trim() || file.name.replace(/\.[^.]+$/, '');
        this._data.photos.push({ id: 'p_' + uid(), name, src: ev.target.result });
        this._save(); this._buildPhotoGrid(grid); nameInput.value = ''; fileInput.value = '';
      };
      reader.readAsDataURL(file);
    };
    addRow.appendChild(fileInput);

    const urlInput = input('url', t.photoUrlPh);
    const urlBtn = btn(t.btnAddUrl);
    urlBtn.onclick = () => {
      const url = urlInput.value.trim(); if (!url) return;
      const name = nameInput.value.trim() || 'Photo';
      this._data.photos.push({ id: 'p_' + uid(), name, src: url });
      this._save(); this._buildPhotoGrid(grid); nameInput.value = ''; urlInput.value = '';
    };
    addRow.appendChild(urlInput); addRow.appendChild(urlBtn);
    box.appendChild(addRow);

    const actions = el('div', 'modal-actions');
    const closeBtn = btn(t.btnClose); closeBtn.onclick = () => this._closeModal();
    actions.appendChild(closeBtn);
    box.appendChild(actions);
    overlay.appendChild(box);
  }

  _buildPhotoGrid(grid) {
    const t = this._t;
    grid.innerHTML = '';
    this._photos().forEach(photo => {
      const cell = el('div', 'photo-cell');
      const img  = document.createElement('img'); img.className = 'photo-thumb'; img.src = photo.src; img.alt = photo.name;
      const name = elText('div', photo.name, 'photo-label');
      const del  = elText('div', t.deletePhotoBtn, 'photo-remove');
      del.onclick = e => {
        e.stopPropagation();
        if (!confirm(t.deletePhotoConfirm(photo.name))) return;
        this._data.photos = this._data.photos.filter(x => x.id !== photo.id);
        this._data.items.forEach(i => { if (i.photoId === photo.id) i.photoId = null; });
        this._save(); this._buildPhotoGrid(grid);
      };
      cell.appendChild(img); cell.appendChild(name); cell.appendChild(del);
      grid.appendChild(cell);
    });
  }

  _modalCategories(overlay) {
    const t   = this._t;
    const box = el('div', 'modal-box');
    box.appendChild(elText('div', t.modalCatsTitle, 'modal-title'));

    const list = el('div', 'category-list');
    this._buildCategoryRows(list);
    box.appendChild(list);

    const addRow = el('div', 'category-add-row');
    const newInput = input('text', t.newCategoryPh);
    const addBtn = btn(t.btnAddCat);
    addBtn.onclick = () => {
      const name = newInput.value.trim();
      if (!name || this._data.categories.includes(name)) return;
      this._data.categories.push(name); this._save(); this._buildCategoryRows(list); newInput.value = '';
    };
    addRow.appendChild(newInput); addRow.appendChild(addBtn);
    box.appendChild(addRow);

    const actions = el('div', 'modal-actions');
    const closeBtn = btn(t.btnClose); closeBtn.onclick = () => this._closeModal();
    actions.appendChild(closeBtn);
    box.appendChild(actions);
    overlay.appendChild(box);
  }

  _buildCategoryRows(list) {
    const t = this._t;
    list.innerHTML = '';
    (this._data.categories || []).forEach(cat => {
      const row = el('div', 'category-row');
      const inp = document.createElement('input');
      inp.className = 'category-input'; inp.value = cat;
      inp.onchange = e => {
        const newVal = e.target.value.trim(); if (!newVal) return;
        const idx = this._data.categories.indexOf(cat); if (idx >= 0) this._data.categories[idx] = newVal;
        this._data.items.forEach(i => { if (i.category === cat) i.category = newVal; });
        this._save();
      };
      const count = (this._data.items || []).filter(i => i.category === cat).length;
      row.appendChild(inp);
      row.appendChild(elText('span', count + '×', 'category-count'));
      const delBtn = elText('span', '🗑', 'category-delete');
      delBtn.onclick = () => {
        if (count > 0 && !confirm(t.deleteCatConfirm(cat, count))) return;
        this._data.categories = this._data.categories.filter(c => c !== cat);
        this._data.items.forEach(i => { if (i.category === cat) i.category = ''; });
        this._save(); this._buildCategoryRows(list);
      };
      row.appendChild(delBtn);
      list.appendChild(row);
    });
  }

  /* ── Lightbox ─────────────────────────────────── */
  _showLightbox(src) {
    const overlay = el('div', 'lightbox-overlay');
    const img = document.createElement('img'); img.className = 'lightbox-image'; img.src = src;
    overlay.appendChild(img); overlay.onclick = () => overlay.remove();
    this.shadowRoot.appendChild(overlay);
  }
}

/* ─── DOM micro-helpers ─────────────────────────────────────────── */
function el(tag, cls = '')      { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
function elText(tag, text, cls) { const e = el(tag, cls); e.textContent = text; return e; }
function btn(label)             { const b = el('button', 'btn'); b.textContent = label; return b; }
function input(type, placeholder) {
  const i = document.createElement('input'); i.type = type; i.placeholder = placeholder; return i;
}

customElements.define('resources-card', InventoryCard);
