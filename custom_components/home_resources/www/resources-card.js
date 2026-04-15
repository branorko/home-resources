/**
 * resources-card.js
 * Home Resources — Lovelace custom card for Home Assistant
 *
 * Version is fetched automatically from /api/home_resources/version (manifest.json).
 * Data stored via /api/home_resources/data (Python backend → HA Store).
 * Supports multiple languages — auto-detected from hass.locale.language.
 */

const API_URL     = '/api/home_resources/data';
const API_VERSION = '/api/home_resources/version';
const POLL_MS     = 20000;

/* ══════════════════════════════════════════════════════════════════
   TRANSLATIONS
   ══════════════════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  sk: {
    title:             '🏠 Sklad',
    btnCategories:     '🏷 Kategórie',
    btnPhotos:         '📷 Fotky',
    btnAddItem:        '+ Položka',
    searchPlaceholder: 'Hľadať...',
    allCategories:     'Všetky',
    units:             'ks',
    noItems:           'Zatiaľ žiadne položky. Kliknite na + Položka.',
    noResults:         'Žiadne položky zodpovedajú filtru.',
    loading:           '⏳ Načítavam...',
    saved:             'Uložené ✓',
    loaded:            'Načítané ✓',
    saveError:         'Chyba ukladania!',
    loadError:         'Chyba načítania',
    noPhoto:           '— bez fotky —',
    dateNotSet:        'bez dátumu',
    expiredLabel:      (d) => `exp. ${Math.abs(d)}d`,
    expiresToday:      'vyprší dnes!',
    expiresInDays:     (d) => `za ${d} dní`,
    expiresSoon:       'Čoskoro',
    expiresOk:         'OK',
    expiresNone:       'bez dátumu',
    expiresOver:       'Expirované',
    addUnit:           '+ Kus',
    rename:            '✏️ Premenovať',
    delete:            '🗑 Odstrániť',
    renamePrompt:      'Nový názov:',
    deleteConfirm:     (name) => `Odstrániť "${name}"?`,
    modalAddTitle:     'Nová položka',
    labelName:         'Názov',
    namePlaceholder:   'napr. Mlieko',
    labelCategory:     'Kategória',
    btnCancel:         'Zrušiť',
    btnAdd:            'Pridať',
    modalPhotosTitle:  'Knižnica fotiek',
    libTab:            'Číselník',
    uploadTab:         'Pridať fotku',
    searchPhotos:      'Hľadať fotku...',
    dropzoneText:      'Klikni pre výber súboru',
    dropzoneHint:      'PNG, JPG, WebP',
    orUrl:             '— alebo URL —',
    photoUrlPh:        'https://...',
    btnAddUrl:         'Pridať',
    photoNamePh:       'Názov fotky (voliteľné)',
    noPhotos:          'Číselník je prázdny',
    removePhoto:       'Odstrániť foto',
    btnClose:          'Zavrieť',
    btnConfirm:        'Potvrdiť',
    deletePhotoConfirm:(name) => `Zmazať fotku "${name}"?`,
    modalCatsTitle:    'Kategórie',
    newCategoryPh:     'Nová kategória...',
    btnAddCat:         '+ Pridať',
    deleteCatConfirm:  (name, n) => `Kategória "${name}" sa používa v ${n} položkách. Naozaj zmazať?`,
    defaultCategories: ['Potraviny', 'Hygiena', 'Lekárnička'],
    defaultPhotoNames: ['Cestoviny', 'Olej', 'Ryža', 'Šampón', 'Mydlo', 'Liek'],
    legendEmpty:       '0 ks',
    legendOne:         '1 ks',
    legendSoon:        'exp. <6M',
    legendOk:          '2+ ks OK',
    noCategory:        '—',
  },
  en: {
    title:             '🏠 Inventory',
    btnCategories:     '🏷 Categories',
    btnPhotos:         '📷 Photos',
    btnAddItem:        '+ Item',
    searchPlaceholder: 'Search...',
    allCategories:     'All',
    units:             'pcs',
    noItems:           'No items yet. Click + Item to add one.',
    noResults:         'No items match the current filter.',
    loading:           '⏳ Loading...',
    saved:             'Saved ✓',
    loaded:            'Loaded ✓',
    saveError:         'Save error!',
    loadError:         'Load error',
    noPhoto:           '— no photo —',
    dateNotSet:        'no date',
    expiredLabel:      (d) => `exp. ${Math.abs(d)}d`,
    expiresToday:      'expires today!',
    expiresInDays:     (d) => `in ${d} days`,
    expiresSoon:       'Soon',
    expiresOk:         'OK',
    expiresNone:       'no date',
    expiresOver:       'Expired',
    addUnit:           '+ Unit',
    rename:            '✏️ Rename',
    delete:            '🗑 Delete',
    renamePrompt:      'New name:',
    deleteConfirm:     (name) => `Delete "${name}"?`,
    modalAddTitle:     'New Item',
    labelName:         'Name',
    namePlaceholder:   'e.g. Milk',
    labelCategory:     'Category',
    btnCancel:         'Cancel',
    btnAdd:            'Add',
    modalPhotosTitle:  'Photo Library',
    libTab:            'Library',
    uploadTab:         'Add Photo',
    searchPhotos:      'Search photo...',
    dropzoneText:      'Click to select file',
    dropzoneHint:      'PNG, JPG, WebP',
    orUrl:             '— or URL —',
    photoUrlPh:        'https://...',
    btnAddUrl:         'Add',
    photoNamePh:       'Photo name (optional)',
    noPhotos:          'Library is empty',
    removePhoto:       'Remove photo',
    btnClose:          'Close',
    btnConfirm:        'Confirm',
    deletePhotoConfirm:(name) => `Delete photo "${name}"?`,
    modalCatsTitle:    'Categories',
    newCategoryPh:     'New category...',
    btnAddCat:         '+ Add',
    deleteCatConfirm:  (name, n) => `Category "${name}" is used in ${n} items. Delete anyway?`,
    defaultCategories: ['Food', 'Hygiene', 'Medicine'],
    defaultPhotoNames: ['Pasta', 'Oil', 'Rice', 'Shampoo', 'Soap', 'Medicine'],
    legendEmpty:       '0 pcs',
    legendOne:         '1 pc',
    legendSoon:        'exp. <6M',
    legendOk:          '2+ pcs OK',
    noCategory:        '—',
  },
  cs: {
    title:             '🏠 Sklad',
    btnCategories:     '🏷 Kategorie',
    btnPhotos:         '📷 Fotky',
    btnAddItem:        '+ Položka',
    searchPlaceholder: 'Hledat...',
    allCategories:     'Vše',
    units:             'ks',
    noItems:           'Zatím žádné položky. Klikněte na + Položka.',
    noResults:         'Žádné položky neodpovídají filtru.',
    loading:           '⏳ Načítám...',
    saved:             'Uloženo ✓',
    loaded:            'Načteno ✓',
    saveError:         'Chyba ukládání!',
    loadError:         'Chyba načtení',
    noPhoto:           '— bez fotky —',
    dateNotSet:        'bez data',
    expiredLabel:      (d) => `exp. ${Math.abs(d)}d`,
    expiresToday:      'vyprší dnes!',
    expiresInDays:     (d) => `za ${d} dní`,
    expiresSoon:       'Brzy',
    expiresOk:         'OK',
    expiresNone:       'bez data',
    expiresOver:       'Prošlé',
    addUnit:           '+ Kus',
    rename:            '✏️ Přejmenovat',
    delete:            '🗑 Odstranit',
    renamePrompt:      'Nový název:',
    deleteConfirm:     (name) => `Odstranit "${name}"?`,
    modalAddTitle:     'Nová položka',
    labelName:         'Název',
    namePlaceholder:   'např. Mléko',
    labelCategory:     'Kategorie',
    btnCancel:         'Zrušit',
    btnAdd:            'Přidat',
    modalPhotosTitle:  'Knihovna fotek',
    libTab:            'Číselník',
    uploadTab:         'Přidat fotku',
    searchPhotos:      'Hledat fotku...',
    dropzoneText:      'Klikni pro výběr souboru',
    dropzoneHint:      'PNG, JPG, WebP',
    orUrl:             '— nebo URL —',
    photoUrlPh:        'https://...',
    btnAddUrl:         'Přidat',
    photoNamePh:       'Název fotky (volitelně)',
    noPhotos:          'Číselník je prázdný',
    removePhoto:       'Odebrat foto',
    btnClose:          'Zavřít',
    btnConfirm:        'Potvrdit',
    deletePhotoConfirm:(name) => `Smazat fotku "${name}"?`,
    modalCatsTitle:    'Kategorie',
    newCategoryPh:     'Nová kategorie...',
    btnAddCat:         '+ Přidat',
    deleteCatConfirm:  (name, n) => `Kategorie "${name}" se používá v ${n} položkách. Opravdu smazat?`,
    defaultCategories: ['Potraviny', 'Hygiena', 'Lékárna'],
    defaultPhotoNames: ['Těstoviny', 'Olej', 'Rýže', 'Šampon', 'Mýdlo', 'Léky'],
    legendEmpty:       '0 ks',
    legendOne:         '1 ks',
    legendSoon:        'exp. <6M',
    legendOk:          '2+ ks OK',
    noCategory:        '—',
  },
  de: {
    title:             '🏠 Lager',
    btnCategories:     '🏷 Kategorien',
    btnPhotos:         '📷 Fotos',
    btnAddItem:        '+ Artikel',
    searchPlaceholder: 'Suchen...',
    allCategories:     'Alle',
    units:             'St.',
    noItems:           'Noch keine Artikel. Klicken Sie auf + Artikel.',
    noResults:         'Keine Artikel entsprechen dem Filter.',
    loading:           '⏳ Laden...',
    saved:             'Gespeichert ✓',
    loaded:            'Geladen ✓',
    saveError:         'Speicherfehler!',
    loadError:         'Ladefehler',
    noPhoto:           '— kein Foto —',
    dateNotSet:        'kein Datum',
    expiredLabel:      (d) => `exp. ${Math.abs(d)}T`,
    expiresToday:      'läuft heute ab!',
    expiresInDays:     (d) => `in ${d} Tagen`,
    expiresSoon:       'Bald',
    expiresOk:         'OK',
    expiresNone:       'kein Datum',
    expiresOver:       'Abgelaufen',
    addUnit:           '+ Einheit',
    rename:            '✏️ Umbenennen',
    delete:            '🗑 Löschen',
    renamePrompt:      'Neuer Name:',
    deleteConfirm:     (name) => `"${name}" löschen?`,
    modalAddTitle:     'Neuer Artikel',
    labelName:         'Name',
    namePlaceholder:   'z.B. Milch',
    labelCategory:     'Kategorie',
    btnCancel:         'Abbrechen',
    btnAdd:            'Hinzufügen',
    modalPhotosTitle:  'Fotobibliothek',
    libTab:            'Bibliothek',
    uploadTab:         'Foto hinzufügen',
    searchPhotos:      'Foto suchen...',
    dropzoneText:      'Klicken zum Auswählen',
    dropzoneHint:      'PNG, JPG, WebP',
    orUrl:             '— oder URL —',
    photoUrlPh:        'https://...',
    btnAddUrl:         'Hinzufügen',
    photoNamePh:       'Fotoname (optional)',
    noPhotos:          'Bibliothek ist leer',
    removePhoto:       'Foto entfernen',
    btnClose:          'Schließen',
    btnConfirm:        'Bestätigen',
    deletePhotoConfirm:(name) => `Foto "${name}" löschen?`,
    modalCatsTitle:    'Kategorien',
    newCategoryPh:     'Neue Kategorie...',
    btnAddCat:         '+ Hinzufügen',
    deleteCatConfirm:  (name, n) => `Kategorie "${name}" wird in ${n} Artikeln verwendet. Trotzdem löschen?`,
    defaultCategories: ['Lebensmittel', 'Hygiene', 'Medizin'],
    defaultPhotoNames: ['Nudeln', 'Öl', 'Reis', 'Shampoo', 'Seife', 'Medizin'],
    legendEmpty:       '0 St.',
    legendOne:         '1 St.',
    legendSoon:        'exp. <6M',
    legendOk:          '2+ St. OK',
    noCategory:        '—',
  },
};

function resolveLocale(hassLang) {
  if (!hassLang) return TRANSLATIONS.en;
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

function uid() { return Math.random().toString(36).slice(2, 10); }
function nextId(arr) { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1; }

const TODAY_STR = new Date().toISOString().slice(0, 10);
const TODAY     = new Date(TODAY_STR);

function addMonths(date, m) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + m);
  return d;
}

function daysDiff(dateStr) {
  if (!dateStr) return Infinity;
  return Math.floor((new Date(dateStr) - TODAY) / 86400000);
}

/** Overall traffic-light colour for an item based on its units. */
function itemColor(item) {
  const units = item.units || [];
  if (units.length === 0) return 'red';
  const valid = units.filter(u => u.expiry && new Date(u.expiry) >= TODAY);
  if (!valid.length) return 'red';
  if (valid.some(u => new Date(u.expiry) <= addMonths(TODAY, 6))) return 'yellow';
  if (units.length === 1) return 'orange';
  return 'green';
}

/** Badge info for a single unit's expiry date. */
function expiryBadge(expiry, t) {
  if (!expiry) return { cls: 'eb-none', txt: t.expiresNone };
  const d = daysDiff(expiry);
  if (d < 0)   return { cls: 'eb-over', txt: t.expiresOver };
  if (d <= 180) return { cls: 'eb-warn', txt: t.expiresSoon };
  return { cls: 'eb-ok', txt: t.expiresOk };
}

/* ─── CSS ──────────────────────────────────────────────────────── */

const CSS = `
:host {
  --c-red-bg: #FCEBEB; --c-red-bd: #F09595; --c-red-tx: #A32D2D; --c-red-dot: #E24B4A;
  --c-orange-bg: #FAECE7; --c-orange-bd: #F5C4B3; --c-orange-tx: #993C1D; --c-orange-dot: #D85A30;
  --c-yellow-bg: #FAEEDA; --c-yellow-bd: #FAC775; --c-yellow-tx: #854F0B; --c-yellow-dot: #EF9F27;
  --c-green-bg: #EAF3DE; --c-green-bd: #C0DD97; --c-green-tx: #3B6D11; --c-green-dot: #639922;
  --r-sm: 6px; --r-md: 8px; --r-lg: 12px;
  display: block;
  font-family: var(--primary-font-family, 'Roboto', sans-serif);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.card {
  background: var(--card-background-color, #fff);
  border-radius: var(--ha-card-border-radius, 12px);
  padding: 16px;
  color: var(--primary-text-color, #212121);
  max-width: 720px;
}

/* ── Header ── */
.header { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.header-title { flex: 1; font-size: 16px; font-weight: 600; min-width: 100px; }
.header-version { font-size: 10px; color: var(--secondary-text-color); align-self: flex-end; margin-bottom: 2px; }

.btn {
  padding: 5px 12px; font-size: 12px; border-radius: var(--r-md);
  border: 1px solid var(--divider-color, #e0e0e0);
  background: var(--secondary-background-color, #f5f5f5);
  color: var(--primary-text-color); cursor: pointer; transition: all .15s;
  white-space: nowrap; font-family: inherit;
}
.btn:hover { filter: brightness(0.95); }
.btn-primary { background: var(--primary-color, #03a9f4); color: #fff; border-color: var(--primary-color, #03a9f4); }
.btn-primary:hover { opacity: .88; filter: none; }
.btn-danger { color: #A32D2D; border-color: #F09595; background: transparent; }
.btn-danger:hover { background: #FCEBEB; }

/* ── Search ── */
.search-wrap { position: relative; margin-bottom: 10px; }
.search-wrap input {
  width: 100%; padding: 8px 12px 8px 34px; font-size: 14px;
  border: 1px solid var(--divider-color, #e0e0e0);
  border-radius: var(--r-md); background: var(--secondary-background-color, #f5f5f5);
  color: var(--primary-text-color); font-family: inherit; outline: none;
}
.search-wrap input:focus { border-color: var(--primary-color, #03a9f4); }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 14px; color: var(--secondary-text-color); pointer-events: none; }

/* ── Category filter ── */
.cats { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.cat-pill {
  padding: 3px 10px; font-size: 12px; border-radius: 20px;
  border: 1px solid var(--divider-color, #e0e0e0);
  background: var(--secondary-background-color, #f5f5f5);
  color: var(--secondary-text-color); cursor: pointer; font-family: inherit;
}
.cat-pill.active { background: var(--primary-color, #03a9f4); color: #fff; border-color: var(--primary-color, #03a9f4); }

/* ── Legend ── */
.legend { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; padding: 6px 10px; background: var(--secondary-background-color, #f5f5f5); border-radius: var(--r-md); }
.leg { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--secondary-text-color); }
.leg-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

/* ── Item list ── */
.item-list { display: flex; flex-direction: column; gap: 6px; }

.item-card {
  border-radius: var(--r-lg); overflow: hidden;
  border: 1px solid var(--divider-color, #e0e0e0);
  background: var(--card-background-color, #fff);
}
.item-card.red    { border-color: var(--c-red-bd);    background: var(--c-red-bg); }
.item-card.orange { border-color: var(--c-orange-bd); background: var(--c-orange-bg); }
.item-card.yellow { border-color: var(--c-yellow-bd); background: var(--c-yellow-bg); }
.item-card.green  { border-color: var(--c-green-bd);  background: var(--c-green-bg); }

.item-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; cursor: pointer; user-select: none; }

.thumb-wrap { width: 36px; height: 36px; flex-shrink: 0; }
.thumb-img {
  width: 36px; height: 36px; border-radius: var(--r-md); object-fit: cover;
  border: 1px solid var(--divider-color, #e0e0e0); display: block; cursor: zoom-in;
}
.thumb-empty {
  width: 36px; height: 36px; border-radius: var(--r-md);
  border: 1px dashed var(--divider-color, #e0e0e0);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; cursor: pointer;
  background: var(--secondary-background-color, #f5f5f5);
  color: var(--secondary-text-color);
}

.color-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.red    .color-dot { background: var(--c-red-dot); }
.orange .color-dot { background: var(--c-orange-dot); }
.yellow .color-dot { background: var(--c-yellow-dot); }
.green  .color-dot { background: var(--c-green-dot); }

.item-info { flex: 1; min-width: 0; }
.item-name { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.red    .item-name { color: var(--c-red-tx); }
.orange .item-name { color: var(--c-orange-tx); }
.yellow .item-name { color: var(--c-yellow-tx); }
.green  .item-name { color: var(--c-green-tx); }
.item-cat { font-size: 11px; color: var(--secondary-text-color); margin-top: 1px; }

.cat-tag { font-size: 11px; padding: 2px 7px; border-radius: 10px; background: var(--secondary-background-color, #f5f5f5); color: var(--secondary-text-color); border: 1px solid var(--divider-color, #e0e0e0); white-space: nowrap; }
.item-qty { font-size: 13px; font-weight: 500; min-width: 34px; text-align: right; color: var(--secondary-text-color); white-space: nowrap; }
.item-arrow { font-size: 10px; color: var(--secondary-text-color); transition: transform .2s; display: inline-block; margin-left: 2px; }
.item-arrow.open { transform: rotate(90deg); }

/* ── Detail ── */
.item-detail {
  display: none; border-top: 1px solid var(--divider-color, #e0e0e0);
  padding: 10px 12px; background: var(--secondary-background-color, #f9f9f9);
}
.item-detail.open { display: block; }

/* Photo section in detail */
.photo-sec { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid var(--divider-color, #e0e0e0); }
.photo-lg { width: 72px; height: 72px; border-radius: var(--r-md); object-fit: cover; border: 1px solid var(--divider-color, #e0e0e0); cursor: zoom-in; flex-shrink: 0; display: block; }
.photo-lg-empty { width: 72px; height: 72px; border-radius: var(--r-md); border: 1px dashed var(--divider-color, #e0e0e0); display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; background: var(--card-background-color, #fff); }
.photo-btns { display: flex; flex-direction: column; gap: 6px; }

/* Unit list */
.unit-list { display: flex; flex-direction: column; gap: 5px; margin-bottom: 8px; }
.unit-row {
  display: flex; align-items: center; gap: 8px; padding: 5px 8px;
  border-radius: var(--r-md); background: var(--card-background-color, #fff);
  border: 1px solid var(--divider-color, #e0e0e0);
}
.unit-num { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); min-width: 20px; }
.unit-date input {
  border: none; background: transparent; color: var(--primary-text-color);
  font-size: 13px; width: 120px; cursor: pointer; font-family: inherit; outline: none;
}
.unit-date input:focus { background: var(--secondary-background-color, #f5f5f5); border-radius: 4px; padding: 1px 4px; }

/* Expiry badges */
.eb { font-size: 11px; padding: 2px 6px; border-radius: 10px; font-weight: 500; white-space: nowrap; }
.eb-ok   { background: #EAF3DE; color: #3B6D11; }
.eb-warn { background: #FAEEDA; color: #854F0B; }
.eb-over { background: #FCEBEB; color: #A32D2D; }
.eb-none { background: #F1EFE8; color: #5F5E5A; }

.unit-spacer { flex: 1; }
.btn-unit-del { padding: 3px 8px; font-size: 11px; border-radius: var(--r-md); border: 1px solid #F09595; background: transparent; color: #A32D2D; cursor: pointer; font-family: inherit; }

.btn-add-unit { margin-top: 4px; width: 100%; padding: 5px; font-size: 12px; border-radius: var(--r-md); border: 1px dashed var(--divider-color, #e0e0e0); background: transparent; color: var(--secondary-text-color); cursor: pointer; font-family: inherit; }

/* Item actions */
.item-actions { display: flex; gap: 8px; margin-top: 8px; justify-content: flex-end; flex-wrap: wrap; }

/* ── Empty state ── */
.empty { text-align: center; padding: 24px 12px; color: var(--secondary-text-color); font-size: 14px; }

/* ── Status bar ── */
.status-bar { font-size: 11px; color: var(--secondary-text-color); text-align: right; margin-top: 8px; min-height: 15px; }
.status-bar.error { color: #e57373; }

/* ── Lightbox ── */
.lightbox {
  position: fixed; inset: 0; background: rgba(0,0,0,.78); display: none;
  align-items: center; justify-content: center; z-index: 9999;
}
.lightbox.open { display: flex; }
.lightbox img { max-width: 88vw; max-height: 88vh; border-radius: var(--r-lg); object-fit: contain; display: block; }
.lb-close {
  position: absolute; top: 14px; right: 18px; font-size: 20px; color: #fff; cursor: pointer;
  background: rgba(0,0,0,.4); border-radius: 50%; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
}

/* ── Modal ── */
.modal-bg {
  position: fixed; inset: 0; background: rgba(0,0,0,.52); display: none;
  align-items: center; justify-content: center; z-index: 10000; padding: 16px;
}
.modal-bg.open { display: flex; }
.modal-box {
  background: var(--card-background-color, #fff); border-radius: var(--r-lg);
  width: min(480px, 100%); max-height: 84vh; display: flex; flex-direction: column;
  overflow: hidden; border: 1px solid var(--divider-color, #e0e0e0);
  box-shadow: 0 8px 32px rgba(0,0,0,.22);
}
.modal-head { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--divider-color, #e0e0e0); gap: 10px; flex-shrink: 0; }
.modal-head-title { flex: 1; font-size: 15px; font-weight: 600; }
.modal-x { font-size: 18px; background: none; border: none; cursor: pointer; color: var(--secondary-text-color); line-height: 1; padding: 0; font-family: inherit; }

/* Tabs */
.modal-tabs { display: flex; padding: 0 16px; border-bottom: 1px solid var(--divider-color, #e0e0e0); flex-shrink: 0; }
.modal-tab {
  padding: 7px 14px; font-size: 12px; border: 1px solid transparent; border-bottom: none;
  cursor: pointer; color: var(--secondary-text-color); background: transparent;
  border-radius: var(--r-md) var(--r-md) 0 0; margin-bottom: -1px; font-family: inherit;
}
.modal-tab.active {
  color: var(--primary-color, #03a9f4);
  border-color: var(--primary-color, #03a9f4);
  border-bottom-color: var(--card-background-color, #fff);
  background: var(--card-background-color, #fff);
}

/* Photo picker grid panel */
.picker-lib { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
.picker-search { padding: 10px 16px; border-bottom: 1px solid var(--divider-color, #e0e0e0); flex-shrink: 0; }
.picker-search input {
  width: 100%; padding: 6px 10px; font-size: 13px;
  border: 1px solid var(--divider-color, #e0e0e0); border-radius: var(--r-md);
  background: var(--secondary-background-color, #f5f5f5); color: var(--primary-text-color); font-family: inherit;
}
.photo-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
  gap: 8px; padding: 12px 16px; overflow-y: auto; flex: 1; min-height: 120px;
}
.photo-cell {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  cursor: pointer; padding: 6px; border-radius: var(--r-md);
  border: 1px solid transparent; position: relative;
}
.photo-cell:hover { background: var(--secondary-background-color, #f5f5f5); border-color: var(--divider-color, #e0e0e0); }
.photo-cell.selected { border-color: var(--primary-color, #03a9f4); background: rgba(3,169,244,.08); }
.photo-cell img { width: 64px; height: 64px; object-fit: cover; border-radius: var(--r-md); border: 1px solid var(--divider-color, #e0e0e0); display: block; }
.photo-cell-name { font-size: 11px; color: var(--secondary-text-color); text-align: center; word-break: break-word; max-width: 80px; }
.photo-del-btn {
  position: absolute; top: 2px; right: 2px; width: 18px; height: 18px;
  border-radius: 3px; background: #FCEBEB; border: 1px solid #F09595;
  color: #A32D2D; font-size: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; line-height: 1; font-family: inherit;
}

/* Upload panel */
.upload-panel { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
.upload-area { padding: 16px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; flex: 1; }
.dropzone {
  border: 2px dashed var(--divider-color, #e0e0e0); border-radius: var(--r-lg);
  padding: 20px; text-align: center; color: var(--secondary-text-color);
  font-size: 13px; cursor: pointer;
}
.dropzone-icon { font-size: 22px; margin-bottom: 4px; }
.dropzone-hint { font-size: 11px; margin-top: 3px; opacity: .6; }
.or-url { font-size: 12px; text-align: center; opacity: .6; }
.url-row { display: flex; gap: 6px; }
.url-row input, .name-input {
  flex: 1; padding: 6px 10px; font-size: 13px;
  border: 1px solid var(--divider-color, #e0e0e0); border-radius: var(--r-md);
  background: var(--secondary-background-color, #f5f5f5);
  color: var(--primary-text-color); font-family: inherit;
}
.name-input { width: 100%; }

/* Modal footer */
.modal-foot { padding: 10px 16px; border-top: 1px solid var(--divider-color, #e0e0e0); display: flex; gap: 8px; justify-content: flex-end; flex-shrink: 0; }

/* Add item modal body */
.modal-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; flex: 1; }
.field-label { font-size: 12px; color: var(--secondary-text-color); margin-bottom: 4px; }
.modal-body input[type=text], .modal-body select {
  width: 100%; padding: 8px 10px; font-size: 14px;
  border: 1px solid var(--divider-color, #e0e0e0); border-radius: var(--r-md);
  background: var(--secondary-background-color, #f5f5f5);
  color: var(--primary-text-color); font-family: inherit; outline: none;
}
.modal-body input:focus, .modal-body select:focus { border-color: var(--primary-color, #03a9f4); }

/* Category manager */
.kat-list { display: flex; flex-direction: column; gap: 4px; padding: 12px 16px; overflow-y: auto; flex: 1; min-height: 80px; }
.kat-row { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: var(--r-md); border: 1px solid var(--divider-color, #e0e0e0); background: var(--card-background-color, #fff); }
.kat-row input { flex: 1; border: none; background: transparent; font-size: 14px; color: var(--primary-text-color); font-family: inherit; outline: none; }
.kat-row input:focus { background: var(--secondary-background-color, #f5f5f5); border-radius: 4px; padding: 2px 4px; }
.kat-count { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; }
.kat-add-row { display: flex; gap: 8px; padding: 10px 16px; border-top: 1px solid var(--divider-color, #e0e0e0); flex-shrink: 0; }
.kat-add-row input {
  flex: 1; padding: 6px 10px; font-size: 13px;
  border: 1px solid var(--divider-color, #e0e0e0); border-radius: var(--r-md);
  background: var(--secondary-background-color, #f5f5f5);
  color: var(--primary-text-color); font-family: inherit;
}
`;

/* ══════════════════════════════════════════════════════════════════
   CUSTOM ELEMENT
   ══════════════════════════════════════════════════════════════════ */

class InventoryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this._hass         = null;
    this._data         = null;
    this._t            = TRANSLATIONS.en;
    this._loading      = true;
    this._status       = '';
    this._statusError  = false;
    this._saveTimer    = null;
    this._pollTimer    = null;
    this._version      = '…';

    // UI state
    this._expandedItems  = new Set();
    this._activeCategory = null;
    this._searchQuery    = '';
    this._activeModal    = null; // null | 'add-item' | 'photos' | 'categories' | 'picker'
    this._pickerTarget   = null; // item being edited
    this._pickerSelected = null; // photoId being selected
  }

  /* ── HA lifecycle ────────────────────────────── */
  set hass(hass) {
    const firstCall = !this._hass;
    this._hass = hass;
    const lang = hass?.locale?.language;
    this._t = resolveLocale(lang);
    if (firstCall) {
      this._fetchVersion();
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

  /* ── Version (automatic from manifest via backend) ── */
  async _fetchVersion() {
    try {
      const res = await fetch(API_VERSION, {
        headers: { Authorization: 'Bearer ' + this._token() },
      });
      if (res.ok) {
        const j = await res.json();
        this._version = j.version || '?';
        this._render();
      }
    } catch (_) { /* keep '…' */ }
  }

  /* ── API ─────────────────────────────────────── */
  _token() { return this._hass?.auth?.data?.access_token || ''; }

  async _load() {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: 'Bearer ' + this._token() },
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!data.photos    || !data.photos.length)    data.photos    = buildDefaultPhotos(this._t);
      if (!data.categories|| !data.categories.length) data.categories = [...this._t.defaultCategories];
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
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + this._token(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this._data),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
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
  _photos()       { return this._data.photos || []; }
  _photoById(id)  { return this._photos().find(p => p.id === id); }

  _addPhoto(src, name) {
    const id = 'p_' + uid();
    this._data.photos.push({ id, name: name || 'Photo', src });
    return id;
  }

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  _render() {
    const root = this.shadowRoot;
    const t    = this._t;

    if (!root.querySelector('style')) {
      const s = document.createElement('style'); s.textContent = CSS; root.appendChild(s);
    }

    // Lightbox (persistent)
    if (!root.querySelector('.lightbox')) {
      const lb = document.createElement('div'); lb.className = 'lightbox';
      const lbImg = document.createElement('img'); lbImg.alt = '';
      const lbClose = document.createElement('div'); lbClose.className = 'lb-close'; lbClose.textContent = '✕';
      lbClose.onclick = () => lb.classList.remove('open');
      lb.onclick = e => { if (e.target === lb) lb.classList.remove('open'); };
      lb.appendChild(lbClose); lb.appendChild(lbImg);
      root.appendChild(lb);
    }

    let card = root.querySelector('.card');
    if (!card) { card = document.createElement('div'); card.className = 'card'; root.appendChild(card); }

    if (this._loading) { card.innerHTML = `<div class="empty">${t.loading}</div>`; return; }

    const { items = [], categories = [] } = this._data;
    const searchLow  = this._searchQuery.toLowerCase();
    const visibleItems = items.filter(item => {
      if (this._activeCategory !== null && item.category !== this._activeCategory) return false;
      if (searchLow && !item.name.toLowerCase().includes(searchLow) && !(item.category || '').toLowerCase().includes(searchLow)) return false;
      return true;
    });

    card.innerHTML = '';

    /* ─ Header ─ */
    const header = document.createElement('div'); header.className = 'header';
    const titleEl = document.createElement('div'); titleEl.className = 'header-title'; titleEl.textContent = t.title;
    const versionEl = document.createElement('span'); versionEl.className = 'header-version'; versionEl.textContent = 'v' + this._version;
    const btnCats = this._btn(t.btnCategories, () => this._openModal('categories'));
    const btnPics = this._btn(t.btnPhotos,     () => this._openModal('photos'));
    const btnAdd  = this._btn(t.btnAddItem,    () => this._openModal('add-item'));
    btnAdd.classList.add('btn-primary');
    header.appendChild(titleEl); header.appendChild(versionEl);
    header.appendChild(btnCats); header.appendChild(btnPics); header.appendChild(btnAdd);
    card.appendChild(header);

    /* ─ Search ─ */
    const searchWrap = document.createElement('div'); searchWrap.className = 'search-wrap';
    const searchIcon = document.createElement('span'); searchIcon.className = 'search-icon'; searchIcon.textContent = '🔍';
    const searchInput = document.createElement('input');
    searchInput.type = 'text'; searchInput.placeholder = t.searchPlaceholder; searchInput.value = this._searchQuery;
    searchInput.oninput = e => { this._searchQuery = e.target.value; this._render(); };
    searchWrap.appendChild(searchIcon); searchWrap.appendChild(searchInput);
    card.appendChild(searchWrap);

    /* ─ Category pills ─ */
    const catsEl = document.createElement('div'); catsEl.className = 'cats';
    const allPill = document.createElement('button');
    allPill.className = 'cat-pill' + (this._activeCategory === null ? ' active' : '');
    allPill.textContent = t.allCategories;
    allPill.onclick = () => { this._activeCategory = null; this._render(); };
    catsEl.appendChild(allPill);
    categories.forEach(cat => {
      const p = document.createElement('button');
      p.className = 'cat-pill' + (this._activeCategory === cat ? ' active' : '');
      p.textContent = cat;
      p.onclick = () => { this._activeCategory = cat; this._render(); };
      catsEl.appendChild(p);
    });
    card.appendChild(catsEl);

    /* ─ Legend ─ */
    const legend = document.createElement('div'); legend.className = 'legend';
    [
      { color: '#E24B4A', label: t.legendEmpty },
      { color: '#D85A30', label: t.legendOne },
      { color: '#EF9F27', label: t.legendSoon },
      { color: '#639922', label: t.legendOk },
    ].forEach(({ color, label }) => {
      const leg = document.createElement('div'); leg.className = 'leg';
      const dot = document.createElement('div'); dot.className = 'leg-dot'; dot.style.background = color;
      const txt = document.createElement('span'); txt.textContent = label;
      leg.appendChild(dot); leg.appendChild(txt);
      legend.appendChild(leg);
    });
    card.appendChild(legend);

    /* ─ Item list ─ */
    const listEl = document.createElement('div'); listEl.className = 'item-list';
    if (!visibleItems.length) {
      const empty = document.createElement('div'); empty.className = 'empty';
      empty.textContent = items.length ? t.noResults : t.noItems;
      listEl.appendChild(empty);
    } else {
      visibleItems.forEach(item => this._renderItem(listEl, item));
    }
    card.appendChild(listEl);

    /* ─ Status bar ─ */
    const statusEl = document.createElement('div');
    statusEl.className = 'status-bar' + (this._statusError ? ' error' : '');
    statusEl.textContent = this._status;
    card.appendChild(statusEl);

    /* ─ Modals ─ */
    this._renderModals(card);
  }

  /* ── Item card ────────────────────────────────── */
  _renderItem(listEl, item) {
    const t     = this._t;
    const color = itemColor(item);
    const photo = this._photoById(item.photoId);
    const isOpen = this._expandedItems.has(item.id);

    const card = document.createElement('div'); card.className = `item-card ${color}`;

    /* Summary row */
    const row = document.createElement('div'); row.className = 'item-row';
    row.onclick = () => {
      if (this._expandedItems.has(item.id)) this._expandedItems.delete(item.id);
      else this._expandedItems.add(item.id);
      this._render();
    };

    /* Thumbnail */
    const thumbWrap = document.createElement('div'); thumbWrap.className = 'thumb-wrap';
    if (photo) {
      const img = document.createElement('img'); img.className = 'thumb-img';
      img.src = photo.src; img.alt = photo.name;
      img.onclick = e => { e.stopPropagation(); this._openLightbox(photo.src); };
      thumbWrap.appendChild(img);
    } else {
      const ph = document.createElement('div'); ph.className = 'thumb-empty'; ph.textContent = '+';
      ph.onclick = e => { e.stopPropagation(); this._openPicker(item); };
      thumbWrap.appendChild(ph);
    }
    row.appendChild(thumbWrap);

    const dot = document.createElement('div'); dot.className = 'color-dot';
    row.appendChild(dot);

    const info = document.createElement('div'); info.className = 'item-info';
    const nameEl = document.createElement('div'); nameEl.className = 'item-name'; nameEl.textContent = item.name;
    info.appendChild(nameEl);
    row.appendChild(info);

    const tag = document.createElement('span'); tag.className = 'cat-tag'; tag.textContent = item.category || t.noCategory;
    row.appendChild(tag);

    const qty = document.createElement('span'); qty.className = 'item-qty';
    qty.textContent = (item.units || []).length + ' ' + t.units;
    row.appendChild(qty);

    const arrow = document.createElement('span'); arrow.className = 'item-arrow' + (isOpen ? ' open' : '');
    arrow.textContent = '▶';
    row.appendChild(arrow);
    card.appendChild(row);

    /* Detail panel */
    const detail = document.createElement('div'); detail.className = 'item-detail' + (isOpen ? ' open' : '');

    /* Photo section */
    const photoSec = document.createElement('div'); photoSec.className = 'photo-sec';
    if (photo) {
      const lg = document.createElement('img'); lg.className = 'photo-lg';
      lg.src = photo.src; lg.alt = photo.name;
      lg.onclick = () => this._openLightbox(photo.src);
      photoSec.appendChild(lg);
    } else {
      const pe = document.createElement('div'); pe.className = 'photo-lg-empty'; pe.textContent = '📷';
      photoSec.appendChild(pe);
    }
    const pbtns = document.createElement('div'); pbtns.className = 'photo-btns';
    const pickBtn = this._btn(photo ? '🖼 Zmeniť fotku' : '🖼 Vybrať fotku', e => { e.stopPropagation(); this._openPicker(item); });
    pbtns.appendChild(pickBtn);
    if (photo) {
      const viewBtn = this._btn('🔍 Zobraziť', e => { e.stopPropagation(); this._openLightbox(photo.src); });
      pbtns.appendChild(viewBtn);
    }
    photoSec.appendChild(pbtns);
    detail.appendChild(photoSec);

    /* Unit list */
    const unitListEl = document.createElement('div'); unitListEl.className = 'unit-list';
    if (!(item.units || []).length) {
      const empty = document.createElement('div'); empty.style.cssText = 'font-size:13px;opacity:.6;padding:4px 0';
      empty.textContent = '—';
      unitListEl.appendChild(empty);
    }
    (item.units || []).forEach((unit, idx) => {
      const ur = document.createElement('div'); ur.className = 'unit-row';
      const num = document.createElement('span'); num.className = 'unit-num'; num.textContent = '#' + (idx + 1);
      ur.appendChild(num);

      const dw = document.createElement('span'); dw.className = 'unit-date';
      const di = document.createElement('input'); di.type = 'date'; di.value = unit.expiry || '';
      di.onchange = e => { unit.expiry = e.target.value || null; this._save(); this._render(); };
      dw.appendChild(di); ur.appendChild(dw);

      const { cls, txt } = expiryBadge(unit.expiry, t);
      const badge = document.createElement('span'); badge.className = 'eb ' + cls; badge.textContent = txt;
      ur.appendChild(badge);

      const spacer = document.createElement('span'); spacer.className = 'unit-spacer';
      ur.appendChild(spacer);

      const del = document.createElement('button'); del.className = 'btn-unit-del'; del.textContent = '✕';
      del.onclick = e => { e.stopPropagation(); item.units = item.units.filter(u => u.id !== unit.id); this._save(); this._render(); };
      ur.appendChild(del);
      unitListEl.appendChild(ur);
    });
    detail.appendChild(unitListEl);

    const addUnitBtn = document.createElement('button'); addUnitBtn.className = 'btn-add-unit';
    addUnitBtn.textContent = t.addUnit;
    addUnitBtn.onclick = e => {
      e.stopPropagation();
      if (!item.units) item.units = [];
      item.units.push({ id: nextId(item.units), expiry: null });
      this._expandedItems.add(item.id);
      this._save(); this._render();
    };
    detail.appendChild(addUnitBtn);

    /* Actions */
    const actions = document.createElement('div'); actions.className = 'item-actions';
    const renameBtn = this._btn(t.rename, () => {
      const name = prompt(t.renamePrompt, item.name); if (!name) return;
      item.name = name; this._save(); this._render();
    });
    const delBtn = this._btn(t.delete, () => {
      if (!confirm(t.deleteConfirm(item.name))) return;
      this._data.items = this._data.items.filter(x => x.id !== item.id);
      this._expandedItems.delete(item.id);
      this._save(); this._render();
    });
    delBtn.classList.add('btn-danger');
    actions.appendChild(renameBtn); actions.appendChild(delBtn);
    detail.appendChild(actions);

    card.appendChild(detail);
    listEl.appendChild(card);
  }

  /* ── Lightbox ─────────────────────────────────── */
  _openLightbox(src) {
    const lb  = this.shadowRoot.querySelector('.lightbox');
    const img = lb.querySelector('img');
    img.src = src;
    lb.classList.add('open');
  }

  /* ══════════════════════════════════════════════
     MODALS
  ══════════════════════════════════════════════ */
  _renderModals(card) {
    // All modals are appended to the card element (inside shadow DOM)
    if (this._activeModal === 'add-item')   this._modalAddItem(card);
    if (this._activeModal === 'photos')     this._modalPhotos(card);
    if (this._activeModal === 'categories') this._modalCategories(card);
    if (this._activeModal === 'picker')     this._modalPicker(card);
  }

  _openModal(type) { this._activeModal = type; this._render(); }
  _closeModal()    { this._activeModal = null; this._pickerTarget = null; this._pickerSelected = null; this._render(); }

  _overlay() {
    const bg = document.createElement('div'); bg.className = 'modal-bg open';
    bg.onclick = e => { if (e.target === bg) this._closeModal(); };
    return bg;
  }

  _modalBox(title) {
    const bg  = this._overlay();
    const box = document.createElement('div'); box.className = 'modal-box';
    const head = document.createElement('div'); head.className = 'modal-head';
    const titleEl = document.createElement('span'); titleEl.className = 'modal-head-title'; titleEl.textContent = title;
    const xBtn = document.createElement('button'); xBtn.className = 'modal-x'; xBtn.textContent = '✕';
    xBtn.onclick = () => this._closeModal();
    head.appendChild(titleEl); head.appendChild(xBtn);
    box.appendChild(head);
    bg.appendChild(box);
    return { bg, box };
  }

  /* ── Add item modal ─── */
  _modalAddItem(card) {
    const t = this._t;
    const { bg, box } = this._modalBox(t.modalAddTitle);

    const body = document.createElement('div'); body.className = 'modal-body';

    const lName = document.createElement('div'); lName.className = 'field-label'; lName.textContent = t.labelName;
    const iName = document.createElement('input'); iName.type = 'text'; iName.placeholder = t.namePlaceholder;
    body.appendChild(lName); body.appendChild(iName);

    const lCat = document.createElement('div'); lCat.className = 'field-label'; lCat.textContent = t.labelCategory;
    const sel = document.createElement('select');
    (this._data.categories || []).forEach(c => {
      const o = document.createElement('option'); o.value = c; o.textContent = c; sel.appendChild(o);
    });
    body.appendChild(lCat); body.appendChild(sel);
    box.appendChild(body);

    const foot = document.createElement('div'); foot.className = 'modal-foot';
    const cancelBtn = this._btn(t.btnCancel, () => this._closeModal());
    const addBtn    = this._btn(t.btnAdd, () => {
      const name = iName.value.trim(); if (!name) { iName.focus(); return; }
      this._data.items.push({ id: nextId(this._data.items), name, category: sel.value || '', photoId: null, units: [] });
      this._save(); this._closeModal();
    });
    addBtn.classList.add('btn-primary');
    foot.appendChild(cancelBtn); foot.appendChild(addBtn);
    box.appendChild(foot);

    card.appendChild(bg);
    setTimeout(() => iName.focus(), 40);
  }

  /* ── Photo library modal ─── */
  _modalPhotos(card) {
    const t = this._t;
    const { bg, box } = this._modalBox(t.modalPhotosTitle);

    // Tabs
    let activeTab = 'lib';
    const tabs = document.createElement('div'); tabs.className = 'modal-tabs';
    const tabLib    = document.createElement('button'); tabLib.className    = 'modal-tab active'; tabLib.textContent    = t.libTab;
    const tabUpload = document.createElement('button'); tabUpload.className = 'modal-tab';        tabUpload.textContent = t.uploadTab;
    tabs.appendChild(tabLib); tabs.appendChild(tabUpload);
    box.appendChild(tabs);

    // Library panel
    const libPanel = document.createElement('div'); libPanel.className = 'picker-lib';
    const grid = document.createElement('div'); grid.className = 'photo-grid';
    const buildGrid = () => {
      grid.innerHTML = '';
      if (!this._photos().length) {
        const m = document.createElement('div'); m.style.cssText = 'padding:8px;font-size:13px;opacity:.6';
        m.textContent = t.noPhotos; grid.appendChild(m); return;
      }
      this._photos().forEach(p => {
        const cell = document.createElement('div'); cell.className = 'photo-cell';
        const img = document.createElement('img'); img.src = p.src; img.alt = p.name;
        const nm  = document.createElement('span'); nm.className = 'photo-cell-name'; nm.textContent = p.name;
        const del = document.createElement('button'); del.className = 'photo-del-btn'; del.textContent = '✕';
        del.title = t.delete;
        del.onclick = e => {
          e.stopPropagation();
          if (!confirm(t.deletePhotoConfirm(p.name))) return;
          this._data.photos = this._data.photos.filter(x => x.id !== p.id);
          this._data.items.forEach(i => { if (i.photoId === p.id) i.photoId = null; });
          this._save(); buildGrid(); this._render();
        };
        cell.appendChild(img); cell.appendChild(nm); cell.appendChild(del);
        grid.appendChild(cell);
      });
    };
    buildGrid();
    libPanel.appendChild(grid);
    box.appendChild(libPanel);

    // Upload panel
    const uploadPanel = document.createElement('div'); uploadPanel.className = 'upload-panel';
    uploadPanel.style.display = 'none';
    const uploadArea = document.createElement('div'); uploadArea.className = 'upload-area';

    const dz = document.createElement('div'); dz.className = 'dropzone';
    dz.innerHTML = `<div class="dropzone-icon">📁</div><div>${t.dropzoneText}</div><div class="dropzone-hint">${t.dropzoneHint}</div>`;
    const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none';
    dz.onclick = () => fileInput.click();

    const nameInput = document.createElement('input'); nameInput.className = 'name-input'; nameInput.placeholder = t.photoNamePh;
    const orUrl = document.createElement('div'); orUrl.className = 'or-url'; orUrl.textContent = t.orUrl;
    const urlRow = document.createElement('div'); urlRow.className = 'url-row';
    const urlInput = document.createElement('input'); urlInput.placeholder = t.photoUrlPh;
    const urlAddBtn = this._btn(t.btnAddUrl, () => {
      const url = urlInput.value.trim(); if (!url) return;
      this._addPhoto(url, nameInput.value.trim() || 'Photo');
      urlInput.value = ''; nameInput.value = '';
      this._save(); buildGrid();
      showTab('lib');
    });
    urlRow.appendChild(urlInput); urlRow.appendChild(urlAddBtn);

    fileInput.onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const reader = new FileReader();
      reader.onload = ev => {
        this._addPhoto(ev.target.result, nameInput.value.trim() || f.name.replace(/\.[^.]+$/, ''));
        nameInput.value = ''; fileInput.value = '';
        this._save(); buildGrid(); this._render();
        showTab('lib');
      };
      reader.readAsDataURL(f);
    };

    uploadArea.appendChild(dz); uploadArea.appendChild(fileInput);
    uploadArea.appendChild(nameInput); uploadArea.appendChild(orUrl); uploadArea.appendChild(urlRow);
    uploadPanel.appendChild(uploadArea);
    box.appendChild(uploadPanel);

    const showTab = (tab) => {
      activeTab = tab;
      tabLib.className    = 'modal-tab' + (tab === 'lib'    ? ' active' : '');
      tabUpload.className = 'modal-tab' + (tab === 'upload' ? ' active' : '');
      libPanel.style.display    = tab === 'lib'    ? 'flex' : 'none';
      uploadPanel.style.display = tab === 'upload' ? 'flex' : 'none';
    };
    tabLib.onclick    = () => showTab('lib');
    tabUpload.onclick = () => showTab('upload');

    const foot = document.createElement('div'); foot.className = 'modal-foot';
    foot.appendChild(this._btn(t.btnClose, () => this._closeModal()));
    box.appendChild(foot);
    card.appendChild(bg);
  }

  /* ── Photo picker modal (per-item) ─── */
  _openPicker(item) {
    this._pickerTarget   = item;
    this._pickerSelected = item.photoId;
    this._activeModal    = 'picker';
    this._render();
  }

  _modalPicker(card) {
    const t    = this._t;
    const item = this._pickerTarget;
    const { bg, box } = this._modalBox(t.modalPhotosTitle + (item ? ' — ' + item.name : ''));

    // Tabs
    let activeTab = 'lib';
    const tabs = document.createElement('div'); tabs.className = 'modal-tabs';
    const tabLib    = document.createElement('button'); tabLib.className    = 'modal-tab active'; tabLib.textContent    = t.libTab;
    const tabUpload = document.createElement('button'); tabUpload.className = 'modal-tab';        tabUpload.textContent = t.uploadTab;
    tabs.appendChild(tabLib); tabs.appendChild(tabUpload);
    box.appendChild(tabs);

    // Search + grid
    const libPanel = document.createElement('div'); libPanel.className = 'picker-lib';
    const searchWrap = document.createElement('div'); searchWrap.className = 'picker-search';
    const qInput = document.createElement('input'); qInput.placeholder = t.searchPhotos;
    searchWrap.appendChild(qInput); libPanel.appendChild(searchWrap);

    const grid = document.createElement('div'); grid.className = 'photo-grid';
    const buildGrid = () => {
      const q = qInput.value.toLowerCase();
      grid.innerHTML = '';
      const filtered = this._photos().filter(p => !q || p.name.toLowerCase().includes(q));
      if (!filtered.length) {
        const m = document.createElement('div'); m.style.cssText = 'padding:8px;font-size:13px;opacity:.6';
        m.textContent = t.noPhotos; grid.appendChild(m); return;
      }
      filtered.forEach(p => {
        const cell = document.createElement('div');
        cell.className = 'photo-cell' + (this._pickerSelected === p.id ? ' selected' : '');
        const img = document.createElement('img'); img.src = p.src; img.alt = p.name;
        const nm  = document.createElement('span'); nm.className = 'photo-cell-name'; nm.textContent = p.name;
        cell.appendChild(img); cell.appendChild(nm);
        cell.onclick = () => { this._pickerSelected = p.id; buildGrid(); };
        grid.appendChild(cell);
      });
    };
    buildGrid();
    qInput.oninput = buildGrid;
    libPanel.appendChild(grid);
    box.appendChild(libPanel);

    // Upload panel
    const uploadPanel = document.createElement('div'); uploadPanel.className = 'upload-panel';
    uploadPanel.style.display = 'none';
    const uploadArea = document.createElement('div'); uploadArea.className = 'upload-area';
    const dz = document.createElement('div'); dz.className = 'dropzone';
    dz.innerHTML = `<div class="dropzone-icon">📁</div><div>${t.dropzoneText}</div><div class="dropzone-hint">${t.dropzoneHint}</div>`;
    const fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none';
    dz.onclick = () => fileInput.click();
    const nameInput = document.createElement('input'); nameInput.className = 'name-input'; nameInput.placeholder = t.photoNamePh;
    const orUrl = document.createElement('div'); orUrl.className = 'or-url'; orUrl.textContent = t.orUrl;
    const urlRow = document.createElement('div'); urlRow.className = 'url-row';
    const urlInput = document.createElement('input'); urlInput.placeholder = t.photoUrlPh;
    const urlAddBtn = this._btn(t.btnAddUrl, () => {
      const url = urlInput.value.trim(); if (!url) return;
      const id = this._addPhoto(url, nameInput.value.trim() || 'Photo');
      this._pickerSelected = id;
      urlInput.value = ''; nameInput.value = '';
      this._save(); buildGrid(); showTab('lib');
    });
    urlRow.appendChild(urlInput); urlRow.appendChild(urlAddBtn);
    fileInput.onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const id = this._addPhoto(ev.target.result, nameInput.value.trim() || f.name.replace(/\.[^.]+$/, ''));
        this._pickerSelected = id;
        nameInput.value = ''; fileInput.value = '';
        this._save(); buildGrid(); showTab('lib');
      };
      reader.readAsDataURL(f);
    };
    uploadArea.appendChild(dz); uploadArea.appendChild(fileInput);
    uploadArea.appendChild(nameInput); uploadArea.appendChild(orUrl); uploadArea.appendChild(urlRow);
    uploadPanel.appendChild(uploadArea);
    box.appendChild(uploadPanel);

    const showTab = (tab) => {
      activeTab = tab;
      tabLib.className    = 'modal-tab' + (tab === 'lib'    ? ' active' : '');
      tabUpload.className = 'modal-tab' + (tab === 'upload' ? ' active' : '');
      libPanel.style.display    = tab === 'lib'    ? 'flex' : 'none';
      uploadPanel.style.display = tab === 'upload' ? 'flex' : 'none';
    };
    tabLib.onclick    = () => showTab('lib');
    tabUpload.onclick = () => showTab('upload');

    const foot = document.createElement('div'); foot.className = 'modal-foot';
    const clearBtn   = this._btn(t.removePhoto, () => {
      this._pickerSelected = null;
      if (item) { item.photoId = null; this._save(); }
      this._closeModal();
    });
    const cancelBtn  = this._btn(t.btnCancel,  () => this._closeModal());
    const confirmBtn = this._btn(t.btnConfirm, () => {
      if (item) { item.photoId = this._pickerSelected; this._save(); }
      this._closeModal();
    });
    confirmBtn.classList.add('btn-primary');
    foot.appendChild(clearBtn); foot.appendChild(cancelBtn); foot.appendChild(confirmBtn);
    box.appendChild(foot);
    card.appendChild(bg);
  }

  /* ── Categories modal ─── */
  _modalCategories(card) {
    const t = this._t;
    const { bg, box } = this._modalBox(t.modalCatsTitle);

    const listEl = document.createElement('div'); listEl.className = 'kat-list';
    const buildList = () => {
      listEl.innerHTML = '';
      if (!(this._data.categories || []).length) {
        const m = document.createElement('div'); m.style.cssText = 'font-size:13px;opacity:.6;padding:8px';
        m.textContent = '—'; listEl.appendChild(m); return;
      }
      this._data.categories.forEach((cat, idx) => {
        const row = document.createElement('div'); row.className = 'kat-row';
        const count = (this._data.items || []).filter(i => i.category === cat).length;
        const inp = document.createElement('input'); inp.type = 'text'; inp.value = cat;
        inp.onchange = () => {
          const nv = inp.value.trim(); if (!nv || nv === cat) { inp.value = cat; return; }
          if (this._data.categories.includes(nv)) { alert(nv + ' already exists'); inp.value = cat; return; }
          this._data.categories[idx] = nv;
          this._data.items.forEach(i => { if (i.category === cat) i.category = nv; });
          this._save(); buildList();
        };
        row.appendChild(inp);
        const cnt = document.createElement('span'); cnt.className = 'kat-count'; cnt.textContent = count + '×';
        row.appendChild(cnt);
        const del = this._btn('🗑', () => {
          if (count > 0 && !confirm(t.deleteCatConfirm(cat, count))) return;
          this._data.categories = this._data.categories.filter(c => c !== cat);
          this._data.items.forEach(i => { if (i.category === cat) i.category = ''; });
          this._save(); buildList();
        });
        del.classList.add('btn-danger');
        row.appendChild(del);
        listEl.appendChild(row);
      });
    };
    buildList();
    box.appendChild(listEl);

    const addRow = document.createElement('div'); addRow.className = 'kat-add-row';
    const newInput = document.createElement('input'); newInput.placeholder = t.newCategoryPh;
    const addBtn = this._btn(t.btnAddCat, () => {
      const name = newInput.value.trim(); if (!name) return;
      if (!this._data.categories) this._data.categories = [];
      if (this._data.categories.includes(name)) return;
      this._data.categories.push(name); newInput.value = '';
      this._save(); buildList();
    });
    addBtn.classList.add('btn-primary');
    newInput.onkeydown = e => { if (e.key === 'Enter') addBtn.click(); };
    addRow.appendChild(newInput); addRow.appendChild(addBtn);
    box.appendChild(addRow);

    const foot = document.createElement('div'); foot.className = 'modal-foot';
    foot.appendChild(this._btn(t.btnClose, () => { this._closeModal(); this._render(); }));
    box.appendChild(foot);
    card.appendChild(bg);
  }

  /* ── Tiny helper ─────────────────────────────── */
  _btn(label, onclick) {
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = label;
    if (onclick) b.onclick = onclick;
    return b;
  }
}

customElements.define('resources-card', InventoryCard);
