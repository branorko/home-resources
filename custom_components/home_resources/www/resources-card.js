/**
 * resources-card.js
 * Home Resources — Lovelace custom card for Home Assistant
 * v1.0.5
 *
 * Config (YAML):
 *   type: custom:resources-card
 *   title: "Môj sklad"   ← optional, overrides default from translations
 *
 * Version is fetched automatically from /api/home_resources/version.
 * Data stored via /api/home_resources/data.
 */

const API_URL     = '/api/home_resources/data';
const API_VERSION = '/api/home_resources/version';
const POLL_MS     = 20000;

/* ══════════════════════════════════════════════════════════════════
   TRANSLATIONS
   ══════════════════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  sk: {
    title:              'Sklad',
    btnAddItem:         '+ Položka',
    searchPlaceholder:  'Hľadať...',
    allCategories:      'Všetky',
    allLocations:       'Všade',
    units:              'ks',
    filters:            'Filtre',
    filterCategories:   'Kategórie',
    filterLocations:    'Lokality',
    noItems:            'Zatiaľ žiadne položky. Kliknite na + Položka.',
    noResults:          'Žiadne položky zodpovedajú filtru.',
    loading:            '⏳ Načítavam...',
    saved:              'Uložené ✓',
    loaded:             'Načítané ✓',
    saveError:          'Chyba ukladania!',
    loadError:          'Chyba načítania',
    noPhoto:            '— bez fotky —',
    noLocation:         '—',
    expiresOk:          'OK',
    expiresSoon:        'Čoskoro',
    expiresOver:        'Expirované',
    expiresNone:        'bez dátumu',
    addUnit:            '+ Kus',
    rename:             '✏️ Premenovať',
    delete:             '🗑 Odstrániť',
    renamePrompt:       'Nový názov:',
    deleteConfirm:      (n) => `Odstrániť "${n}"?`,
    modalAddTitle:      'Nová položka',
    labelName:          'Názov',
    namePlaceholder:    'napr. Mlieko',
    labelCategory:      'Kategória',
    btnCancel:          'Zrušiť',
    btnAdd:             'Pridať',
    btnClose:           'Zavrieť',
    btnConfirm:         'Potvrdiť',
    settingsTitle:      'Nastavenia',
    tabCategories:      'Kategórie',
    tabLocations:       'Lokality',
    tabPhotos:          'Fotky',
    newCategoryPh:      'Nová kategória...',
    newLocationPh:      'Nová lokalita...',
    btnAddCat:          '+ Pridať',
    btnAddLoc:          '+ Pridať',
    deleteCatConfirm:   (n, c) => `Kategória "${n}" sa používa v ${c} položkách. Naozaj zmazať?`,
    deleteLocConfirm:   (n, c) => `Lokalita "${n}" sa používa v ${c} kusoch. Naozaj zmazať?`,
    libTab:             'Číselník',
    uploadTab:          'Pridať fotku',
    searchPhotos:       'Hľadať fotku...',
    dropzoneText:       'Klikni pre výber súboru',
    dropzoneHint:       'PNG, JPG, WebP',
    orUrl:              '— alebo URL —',
    photoUrlPh:         'https://...',
    btnAddUrl:          'Pridať',
    photoNamePh:        'Názov fotky (voliteľné)',
    noPhotos:           'Číselník je prázdny',
    removePhoto:        'Odstrániť foto',
    deletePhotoConfirm: (n) => `Zmazať fotku "${n}"?`,
    locationLabel:      'Lokalita:',
    legendEmpty:        '0 ks',
    legendOne:          '1 ks',
    legendSoon:         'exp. <6M',
    legendOk:           '2+ ks OK',
    defaultCategories:  ['Potraviny', 'Hygiena', 'Lekárnička'],
    defaultLocations:   ['Pivnica', 'Kuchyňa', 'Kúpeľňa'],
    defaultPhotoNames:  ['Cestoviny', 'Olej', 'Ryža', 'Šampón', 'Mydlo', 'Liek'],
  },
  en: {
    title:              'Inventory',
    btnAddItem:         '+ Item',
    searchPlaceholder:  'Search...',
    allCategories:      'All',
    allLocations:       'Everywhere',
    units:              'pcs',
    filters:            'Filters',
    filterCategories:   'Categories',
    filterLocations:    'Locations',
    noItems:            'No items yet. Click + Item to add one.',
    noResults:          'No items match the current filter.',
    loading:            '⏳ Loading...',
    saved:              'Saved ✓',
    loaded:             'Loaded ✓',
    saveError:          'Save error!',
    loadError:          'Load error',
    noPhoto:            '— no photo —',
    noLocation:         '—',
    expiresOk:          'OK',
    expiresSoon:        'Soon',
    expiresOver:        'Expired',
    expiresNone:        'no date',
    addUnit:            '+ Unit',
    rename:             '✏️ Rename',
    delete:             '🗑 Delete',
    renamePrompt:       'New name:',
    deleteConfirm:      (n) => `Delete "${n}"?`,
    modalAddTitle:      'New Item',
    labelName:          'Name',
    namePlaceholder:    'e.g. Milk',
    labelCategory:      'Category',
    btnCancel:          'Cancel',
    btnAdd:             'Add',
    btnClose:           'Close',
    btnConfirm:         'Confirm',
    settingsTitle:      'Settings',
    tabCategories:      'Categories',
    tabLocations:       'Locations',
    tabPhotos:          'Photos',
    newCategoryPh:      'New category...',
    newLocationPh:      'New location...',
    btnAddCat:          '+ Add',
    btnAddLoc:          '+ Add',
    deleteCatConfirm:   (n, c) => `Category "${n}" is used in ${c} items. Delete anyway?`,
    deleteLocConfirm:   (n, c) => `Location "${n}" is used in ${c} units. Delete anyway?`,
    libTab:             'Library',
    uploadTab:          'Add Photo',
    searchPhotos:       'Search photo...',
    dropzoneText:       'Click to select file',
    dropzoneHint:       'PNG, JPG, WebP',
    orUrl:              '— or URL —',
    photoUrlPh:         'https://...',
    btnAddUrl:          'Add',
    photoNamePh:        'Photo name (optional)',
    noPhotos:           'Library is empty',
    removePhoto:        'Remove photo',
    deletePhotoConfirm: (n) => `Delete photo "${n}"?`,
    locationLabel:      'Location:',
    legendEmpty:        '0 pcs',
    legendOne:          '1 pc',
    legendSoon:         'exp. <6M',
    legendOk:           '2+ pcs OK',
    defaultCategories:  ['Food', 'Hygiene', 'Medicine'],
    defaultLocations:   ['Basement', 'Kitchen', 'Bathroom'],
    defaultPhotoNames:  ['Pasta', 'Oil', 'Rice', 'Shampoo', 'Soap', 'Medicine'],
  },
  cs: {
    title:              'Sklad',
    btnAddItem:         '+ Položka',
    searchPlaceholder:  'Hledat...',
    allCategories:      'Vše',
    allLocations:       'Všude',
    units:              'ks',
    filters:            'Filtry',
    filterCategories:   'Kategorie',
    filterLocations:    'Lokality',
    noItems:            'Zatím žádné položky. Klikněte na + Položka.',
    noResults:          'Žádné položky neodpovídají filtru.',
    loading:            '⏳ Načítám...',
    saved:              'Uloženo ✓',
    loaded:             'Načteno ✓',
    saveError:          'Chyba ukládání!',
    loadError:          'Chyba načtení',
    noPhoto:            '— bez fotky —',
    noLocation:         '—',
    expiresOk:          'OK',
    expiresSoon:        'Brzy',
    expiresOver:        'Prošlé',
    expiresNone:        'bez data',
    addUnit:            '+ Kus',
    rename:             '✏️ Přejmenovat',
    delete:             '🗑 Odstranit',
    renamePrompt:       'Nový název:',
    deleteConfirm:      (n) => `Odstranit "${n}"?`,
    modalAddTitle:      'Nová položka',
    labelName:          'Název',
    namePlaceholder:    'např. Mléko',
    labelCategory:      'Kategorie',
    btnCancel:          'Zrušit',
    btnAdd:             'Přidat',
    btnClose:           'Zavřít',
    btnConfirm:         'Potvrdit',
    settingsTitle:      'Nastavení',
    tabCategories:      'Kategorie',
    tabLocations:       'Lokality',
    tabPhotos:          'Fotky',
    newCategoryPh:      'Nová kategorie...',
    newLocationPh:      'Nová lokalita...',
    btnAddCat:          '+ Přidat',
    btnAddLoc:          '+ Přidat',
    deleteCatConfirm:   (n, c) => `Kategorie "${n}" se používá v ${c} položkách. Opravdu smazat?`,
    deleteLocConfirm:   (n, c) => `Lokalita "${n}" se používá v ${c} kusech. Opravdu smazat?`,
    libTab:             'Číselník',
    uploadTab:          'Přidat fotku',
    searchPhotos:       'Hledat fotku...',
    dropzoneText:       'Klikni pro výběr souboru',
    dropzoneHint:       'PNG, JPG, WebP',
    orUrl:              '— nebo URL —',
    photoUrlPh:         'https://...',
    btnAddUrl:          'Přidat',
    photoNamePh:        'Název fotky (volitelně)',
    noPhotos:           'Číselník je prázdný',
    removePhoto:        'Odebrat foto',
    deletePhotoConfirm: (n) => `Smazat fotku "${n}"?`,
    locationLabel:      'Lokalita:',
    legendEmpty:        '0 ks',
    legendOne:          '1 ks',
    legendSoon:         'exp. <6M',
    legendOk:           '2+ ks OK',
    defaultCategories:  ['Potraviny', 'Hygiena', 'Lékárna'],
    defaultLocations:   ['Sklep', 'Kuchyně', 'Koupelna'],
    defaultPhotoNames:  ['Těstoviny', 'Olej', 'Rýže', 'Šampon', 'Mýdlo', 'Léky'],
  },
  de: {
    title:              'Lager',
    btnAddItem:         '+ Artikel',
    searchPlaceholder:  'Suchen...',
    allCategories:      'Alle',
    allLocations:       'Überall',
    units:              'St.',
    filters:            'Filter',
    filterCategories:   'Kategorien',
    filterLocations:    'Orte',
    noItems:            'Noch keine Artikel.',
    noResults:          'Keine Artikel entsprechen dem Filter.',
    loading:            '⏳ Laden...',
    saved:              'Gespeichert ✓',
    loaded:             'Geladen ✓',
    saveError:          'Speicherfehler!',
    loadError:          'Ladefehler',
    noPhoto:            '— kein Foto —',
    noLocation:         '—',
    expiresOk:          'OK',
    expiresSoon:        'Bald',
    expiresOver:        'Abgelaufen',
    expiresNone:        'kein Datum',
    addUnit:            '+ Einheit',
    rename:             '✏️ Umbenennen',
    delete:             '🗑 Löschen',
    renamePrompt:       'Neuer Name:',
    deleteConfirm:      (n) => `"${n}" löschen?`,
    modalAddTitle:      'Neuer Artikel',
    labelName:          'Name',
    namePlaceholder:    'z.B. Milch',
    labelCategory:      'Kategorie',
    btnCancel:          'Abbrechen',
    btnAdd:             'Hinzufügen',
    btnClose:           'Schließen',
    btnConfirm:         'Bestätigen',
    settingsTitle:      'Einstellungen',
    tabCategories:      'Kategorien',
    tabLocations:       'Orte',
    tabPhotos:          'Fotos',
    newCategoryPh:      'Neue Kategorie...',
    newLocationPh:      'Neuer Ort...',
    btnAddCat:          '+ Hinzufügen',
    btnAddLoc:          '+ Hinzufügen',
    deleteCatConfirm:   (n, c) => `Kategorie "${n}" wird in ${c} Artikeln verwendet. Trotzdem löschen?`,
    deleteLocConfirm:   (n, c) => `Ort "${n}" wird in ${c} Einheiten verwendet. Trotzdem löschen?`,
    libTab:             'Bibliothek',
    uploadTab:          'Foto hinzufügen',
    searchPhotos:       'Foto suchen...',
    dropzoneText:       'Klicken zum Auswählen',
    dropzoneHint:       'PNG, JPG, WebP',
    orUrl:              '— oder URL —',
    photoUrlPh:         'https://...',
    btnAddUrl:          'Hinzufügen',
    photoNamePh:        'Fotoname (optional)',
    noPhotos:           'Bibliothek ist leer',
    removePhoto:        'Foto entfernen',
    deletePhotoConfirm: (n) => `Foto "${n}" löschen?`,
    locationLabel:      'Ort:',
    legendEmpty:        '0 St.',
    legendOne:          '1 St.',
    legendSoon:         'exp. <6M',
    legendOk:           '2+ St. OK',
    defaultCategories:  ['Lebensmittel', 'Hygiene', 'Medizin'],
    defaultLocations:   ['Keller', 'Küche', 'Bad'],
    defaultPhotoNames:  ['Nudeln', 'Öl', 'Reis', 'Shampoo', 'Seife', 'Medizin'],
  },
};

function resolveLocale(hassLang) {
  if (!hassLang) return TRANSLATIONS.en;
  const base = hassLang.split('-')[0].toLowerCase();
  return TRANSLATIONS[base] || TRANSLATIONS.en;
}

/* ─── Helpers ─────────────────────────────────────────────────── */

function svgThumb(emoji, bg) {
  return `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='8' fill='${encodeURIComponent(bg)}'/><text x='32' y='45' font-size='32' text-anchor='middle'>${emoji}</text></svg>`;
}
const PHOTO_EMOJIS = [
  { emoji: '🍝', bg: '#FAEEDA' }, { emoji: '🫒', bg: '#EAF3DE' },
  { emoji: '🍚', bg: '#F1EFE8' }, { emoji: '🧴', bg: '#E6F1FB' },
  { emoji: '🧼', bg: '#FBEAF0' }, { emoji: '💊', bg: '#FCEBEB' },
];
function buildDefaultPhotos(t) {
  return PHOTO_EMOJIS.map((p, i) => ({
    id: `dp${i + 1}`, name: t.defaultPhotoNames[i] || p.emoji, src: svgThumb(p.emoji, p.bg),
  }));
}
function uid()       { return Math.random().toString(36).slice(2, 10); }
function nextId(arr) { return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1; }

const TODAY = (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })();
function addMonths(d, m) { const r = new Date(d); r.setMonth(r.getMonth() + m); return r; }
function daysDiff(s)     { if (!s) return Infinity; return Math.floor((new Date(s) - TODAY) / 86400000); }

function itemColor(item) {
  const units = item.units || [];
  if (!units.length) return 'red';
  const valid = units.filter(u => u.expiry && new Date(u.expiry) >= TODAY);
  if (!valid.length) return 'red';
  if (valid.some(u => new Date(u.expiry) <= addMonths(TODAY, 6))) return 'yellow';
  if (units.length === 1) return 'orange';
  return 'green';
}
function expiryBadge(expiry, t) {
  if (!expiry) return { cls: 'eb-none', txt: t.expiresNone };
  const d = daysDiff(expiry);
  if (d < 0)    return { cls: 'eb-over', txt: t.expiresOver };
  if (d <= 180) return { cls: 'eb-warn', txt: t.expiresSoon };
  return { cls: 'eb-ok', txt: t.expiresOk };
}

/* Location tag colours — deterministic pastel palette */
const LOC_PALETTES = [
  { bg: '#E8F4FD', bd: '#90CAF9', tx: '#1565C0' },
  { bg: '#F3E5F5', bd: '#CE93D8', tx: '#6A1B9A' },
  { bg: '#E8F5E9', bd: '#A5D6A7', tx: '#1B5E20' },
  { bg: '#FFF3E0', bd: '#FFCC80', tx: '#E65100' },
  { bg: '#FCE4EC', bd: '#F48FB1', tx: '#880E4F' },
  { bg: '#E0F2F1', bd: '#80CBC4', tx: '#004D40' },
  { bg: '#F9FBE7', bd: '#DCE775', tx: '#558B2F' },
  { bg: '#EDE7F6', bd: '#B39DDB', tx: '#311B92' },
];
function locPalette(name) {
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return LOC_PALETTES[h % LOC_PALETTES.length];
}

/* ─── CSS ──────────────────────────────────────────────────────── */
const CSS = `
:host {
  --c-red-bg:#FCEBEB; --c-red-bd:#F09595; --c-red-tx:#A32D2D; --c-red-dot:#E24B4A;
  --c-orange-bg:#FAECE7; --c-orange-bd:#F5C4B3; --c-orange-tx:#993C1D; --c-orange-dot:#D85A30;
  --c-yellow-bg:#FAEEDA; --c-yellow-bd:#FAC775; --c-yellow-tx:#854F0B; --c-yellow-dot:#EF9F27;
  --c-green-bg:#EAF3DE; --c-green-bd:#C0DD97; --c-green-tx:#3B6D11; --c-green-dot:#639922;
  --r-sm:6px; --r-md:8px; --r-lg:12px; --r-xl:16px;
  display:block;
  font-family:var(--primary-font-family,'Roboto',sans-serif);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

.card{
  background:var(--card-background-color,#fff);
  border-radius:var(--ha-card-border-radius,12px);
  padding:16px; color:var(--primary-text-color,#212121); width:100%;
}

/* ── Header ── */
.header{display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap;}
.header-title{flex:1;font-size:17px;font-weight:700;min-width:80px;letter-spacing:-.2px;}
.header-version{font-size:10px;color:var(--secondary-text-color);align-self:flex-end;margin-bottom:2px;}

/* Buttons */
.btn{
  padding:5px 13px;font-size:12px;border-radius:var(--r-md);
  border:1px solid var(--divider-color,#e0e0e0);
  background:var(--secondary-background-color,#f5f5f5);
  color:var(--primary-text-color);cursor:pointer;transition:all .15s;
  white-space:nowrap;font-family:inherit;line-height:1.4;
}
.btn:hover{filter:brightness(.94);}
.btn-primary{background:var(--primary-color,#03a9f4);color:#fff;border-color:var(--primary-color,#03a9f4);}
.btn-primary:hover{opacity:.88;filter:none;}
.btn-danger{color:#A32D2D;border-color:#F09595;background:transparent;}
.btn-danger:hover{background:#FCEBEB;}
.btn-icon{
  width:32px;height:32px;padding:0;border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-size:16px;
  border:1px solid var(--divider-color,#e0e0e0);
  background:var(--secondary-background-color,#f5f5f5);
  color:var(--secondary-text-color);cursor:pointer;transition:all .15s;
}
.btn-icon:hover{background:var(--primary-color,#03a9f4);color:#fff;border-color:transparent;}
.btn-add-item{
  padding:6px 14px;font-size:12px;font-weight:500;border-radius:var(--r-md);
  background:var(--primary-color,#03a9f4);color:#fff;border:none;
  cursor:pointer;font-family:inherit;transition:opacity .15s;
}
.btn-add-item:hover{opacity:.88;}

/* ── Search ── */
.search-wrap{position:relative;margin-bottom:10px;}
.search-wrap input{
  width:100%;padding:8px 12px 8px 34px;font-size:14px;
  border:1px solid var(--divider-color,#e0e0e0);border-radius:var(--r-md);
  background:var(--secondary-background-color,#f5f5f5);
  color:var(--primary-text-color);font-family:inherit;outline:none;
}
.search-wrap input:focus{border-color:var(--primary-color,#03a9f4);}
.search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--secondary-text-color);pointer-events:none;}

/* ── Filter collapse ── */
.filter-toggle{
  display:flex;align-items:center;gap:6px;
  padding:6px 10px;margin-bottom:8px;border-radius:var(--r-md);
  border:1px solid var(--divider-color,#e0e0e0);
  background:var(--secondary-background-color,#f5f5f5);
  cursor:pointer;user-select:none;font-size:12px;color:var(--secondary-text-color);
  transition:all .15s;
}
.filter-toggle:hover{border-color:var(--primary-color,#03a9f4);color:var(--primary-text-color);}
.filter-toggle.has-active{border-color:var(--primary-color,#03a9f4);background:rgba(3,169,244,.06);color:var(--primary-color,#03a9f4);font-weight:500;}
.filter-chevron{font-size:9px;transition:transform .2s;margin-left:auto;}
.filter-chevron.open{transform:rotate(90deg);}
.filter-active-hint{font-size:10px;opacity:.75;}

.filter-panel{
  display:none;border:1px solid var(--divider-color,#e0e0e0);border-radius:var(--r-md);
  padding:12px 14px;margin-bottom:10px;background:var(--secondary-background-color,#f5f5f5);
  gap:12px;flex-direction:column;
}
.filter-panel.open{display:flex;}
.filter-section-label{font-size:11px;font-weight:500;color:var(--secondary-text-color);margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px;}
.pills{display:flex;flex-wrap:wrap;gap:5px;}
.pill{
  padding:3px 10px;font-size:12px;border-radius:20px;
  border:1px solid var(--divider-color,#e0e0e0);
  background:var(--card-background-color,#fff);
  color:var(--secondary-text-color);cursor:pointer;font-family:inherit;transition:all .15s;
}
.pill:hover{border-color:var(--primary-color,#03a9f4);}
.pill.active{background:var(--primary-color,#03a9f4);color:#fff;border-color:transparent;}

/* ── Legend ── */
.legend{
  display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;
  padding:6px 10px;background:var(--secondary-background-color,#f5f5f5);border-radius:var(--r-md);
}
.leg{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--secondary-text-color);}
.leg-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}

/* ── Item list ── */
.item-list{display:flex;flex-direction:column;gap:6px;}

.item-card{
  border-radius:var(--r-lg);overflow:hidden;
  border:1px solid var(--divider-color,#e0e0e0);
  background:var(--card-background-color,#fff);
  transition:box-shadow .15s;
}
.item-card:hover{box-shadow:0 2px 10px rgba(0,0,0,.08);}
.item-card.red   {border-color:var(--c-red-bd);   background:var(--c-red-bg);}
.item-card.orange{border-color:var(--c-orange-bd);background:var(--c-orange-bg);}
.item-card.yellow{border-color:var(--c-yellow-bd);background:var(--c-yellow-bg);}
.item-card.green {border-color:var(--c-green-bd); background:var(--c-green-bg);}

.item-row{display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;user-select:none;}

.thumb-wrap{width:38px;height:38px;flex-shrink:0;}
.thumb-img{width:38px;height:38px;border-radius:var(--r-md);object-fit:cover;border:1px solid var(--divider-color,#e0e0e0);display:block;cursor:zoom-in;}
.thumb-empty{
  width:38px;height:38px;border-radius:var(--r-md);
  border:1px dashed var(--divider-color,#e0e0e0);
  display:flex;align-items:center;justify-content:center;
  font-size:16px;cursor:pointer;
  background:var(--secondary-background-color,#f5f5f5);color:var(--secondary-text-color);
}

.color-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.red    .color-dot{background:var(--c-red-dot);}
.orange .color-dot{background:var(--c-orange-dot);}
.yellow .color-dot{background:var(--c-yellow-dot);}
.green  .color-dot{background:var(--c-green-dot);}

.item-info{flex:1;min-width:0;}
.item-name{font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.red    .item-name{color:var(--c-red-tx);}
.orange .item-name{color:var(--c-orange-tx);}
.yellow .item-name{color:var(--c-yellow-tx);}
.green  .item-name{color:var(--c-green-tx);}

/* Tag row under name */
.item-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:3px;align-items:center;}
.tag{font-size:11px;padding:1px 7px;border-radius:10px;white-space:nowrap;border:1px solid;}
.tag-cat{background:var(--secondary-background-color,#f5f5f5);color:var(--secondary-text-color);border-color:var(--divider-color,#e0e0e0);}

.item-qty{font-size:13px;font-weight:500;min-width:34px;text-align:right;color:var(--secondary-text-color);white-space:nowrap;}
.item-arrow{font-size:10px;color:var(--secondary-text-color);transition:transform .2s;display:inline-block;margin-left:2px;}
.item-arrow.open{transform:rotate(90deg);}

/* ── Detail ── */
.item-detail{
  display:none;border-top:1px solid var(--divider-color,#e0e0e0);
  padding:12px 14px;background:var(--secondary-background-color,#f9f9f9);
}
.item-detail.open{display:block;}

.photo-sec{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--divider-color,#e0e0e0);}
.photo-lg{width:72px;height:72px;border-radius:var(--r-md);object-fit:cover;border:1px solid var(--divider-color,#e0e0e0);cursor:zoom-in;flex-shrink:0;display:block;}
.photo-lg-empty{width:72px;height:72px;border-radius:var(--r-md);border:1px dashed var(--divider-color,#e0e0e0);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;background:var(--card-background-color,#fff);}
.photo-btns{display:flex;flex-direction:column;gap:6px;}

/* Unit list */
.unit-list{display:flex;flex-direction:column;gap:5px;margin-bottom:8px;}
.unit-row{
  display:flex;align-items:center;gap:8px;padding:7px 10px;
  border-radius:var(--r-md);background:var(--card-background-color,#fff);
  border:1px solid var(--divider-color,#e0e0e0);flex-wrap:wrap;
}
.unit-num{font-size:12px;font-weight:600;color:var(--secondary-text-color);min-width:20px;}
.unit-date input{
  border:none;background:transparent;color:var(--primary-text-color);
  font-size:13px;width:118px;cursor:pointer;font-family:inherit;outline:none;
}
.unit-date input:focus{background:var(--divider-color,#e0e0e0);border-radius:4px;padding:1px 4px;}
.unit-loc select{
  border:none;background:transparent;color:var(--secondary-text-color);
  font-size:12px;cursor:pointer;font-family:inherit;outline:none;max-width:110px;
}
.unit-loc select:focus{background:var(--secondary-background-color,#f5f5f5);border-radius:4px;padding:1px 4px;}

/* Expiry badges */
.eb{font-size:11px;padding:2px 6px;border-radius:10px;font-weight:500;white-space:nowrap;}
.eb-ok  {background:#EAF3DE;color:#3B6D11;}
.eb-warn{background:#FAEEDA;color:#854F0B;}
.eb-over{background:#FCEBEB;color:#A32D2D;}
.eb-none{background:#F1EFE8;color:#5F5E5A;}

.unit-spacer{flex:1;}
.btn-unit-del{padding:3px 8px;font-size:11px;border-radius:var(--r-sm);border:1px solid #F09595;background:transparent;color:#A32D2D;cursor:pointer;font-family:inherit;}
.btn-add-unit{
  width:100%;padding:5px;font-size:12px;border-radius:var(--r-md);
  border:1px dashed var(--divider-color,#e0e0e0);background:transparent;
  color:var(--secondary-text-color);cursor:pointer;font-family:inherit;margin-bottom:8px;
}
.item-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;}

/* ── Empty state ── */
.empty{text-align:center;padding:24px 12px;color:var(--secondary-text-color);font-size:14px;}

/* ── Status bar ── */
.status-bar{font-size:11px;color:var(--secondary-text-color);text-align:right;margin-top:8px;min-height:15px;}
.status-bar.error{color:#e57373;}

/* ── Lightbox ── */
.lightbox{position:fixed;inset:0;background:rgba(0,0,0,.78);display:none;align-items:center;justify-content:center;z-index:9999;}
.lightbox.open{display:flex;}
.lightbox img{max-width:88vw;max-height:88vh;border-radius:var(--r-lg);object-fit:contain;display:block;}
.lb-close{
  position:absolute;top:14px;right:18px;font-size:20px;color:#fff;cursor:pointer;
  background:rgba(0,0,0,.4);border-radius:50%;width:32px;height:32px;
  display:flex;align-items:center;justify-content:center;
}

/* ── Modal ── */
.modal-bg{
  position:fixed;inset:0;background:rgba(0,0,0,.52);display:none;
  align-items:center;justify-content:center;z-index:10000;padding:16px;
}
.modal-bg.open{display:flex;}
.modal-box{
  background:var(--card-background-color,#fff);border-radius:var(--r-xl);
  width:min(500px,100%);max-height:86vh;display:flex;flex-direction:column;
  overflow:hidden;border:1px solid var(--divider-color,#e0e0e0);
  box-shadow:0 12px 40px rgba(0,0,0,.22);
}
.modal-head{display:flex;align-items:center;padding:14px 18px;border-bottom:1px solid var(--divider-color,#e0e0e0);gap:10px;flex-shrink:0;}
.modal-head-title{flex:1;font-size:15px;font-weight:600;}
.modal-x{font-size:18px;background:none;border:none;cursor:pointer;color:var(--secondary-text-color);line-height:1;padding:0;font-family:inherit;}

/* Tabs */
.modal-tabs{display:flex;padding:0 18px;border-bottom:1px solid var(--divider-color,#e0e0e0);flex-shrink:0;gap:2px;}
.modal-tab{
  padding:8px 14px;font-size:12px;border:1px solid transparent;border-bottom:none;
  cursor:pointer;color:var(--secondary-text-color);background:transparent;
  border-radius:var(--r-md) var(--r-md) 0 0;margin-bottom:-1px;font-family:inherit;transition:all .15s;
}
.modal-tab.active{color:var(--primary-color,#03a9f4);border-color:var(--primary-color,#03a9f4);border-bottom-color:var(--card-background-color,#fff);background:var(--card-background-color,#fff);}

/* Settings tabs panel */
.settings-panel{display:flex;flex-direction:column;flex:1;overflow:hidden;}
.settings-list{display:flex;flex-direction:column;gap:4px;padding:12px 18px;overflow-y:auto;flex:1;min-height:80px;}
.settings-row{
  display:flex;align-items:center;gap:8px;padding:7px 10px;
  border-radius:var(--r-md);border:1px solid var(--divider-color,#e0e0e0);
  background:var(--card-background-color,#fff);
}
.settings-row input{flex:1;border:none;background:transparent;font-size:14px;color:var(--primary-text-color);font-family:inherit;outline:none;}
.settings-row input:focus{background:var(--secondary-background-color,#f5f5f5);border-radius:4px;padding:2px 4px;}
.settings-count{font-size:11px;color:var(--secondary-text-color);white-space:nowrap;}
.settings-add-row{display:flex;gap:8px;padding:10px 18px;border-top:1px solid var(--divider-color,#e0e0e0);flex-shrink:0;}
.settings-add-row input{flex:1;padding:6px 10px;font-size:13px;border:1px solid var(--divider-color,#e0e0e0);border-radius:var(--r-md);background:var(--secondary-background-color,#f5f5f5);color:var(--primary-text-color);font-family:inherit;outline:none;}

/* Photo library in settings */
.picker-lib{display:flex;flex-direction:column;flex:1;overflow:hidden;}
.picker-search{padding:10px 18px;border-bottom:1px solid var(--divider-color,#e0e0e0);flex-shrink:0;}
.picker-search input{width:100%;padding:6px 10px;font-size:13px;border:1px solid var(--divider-color,#e0e0e0);border-radius:var(--r-md);background:var(--secondary-background-color,#f5f5f5);color:var(--primary-text-color);font-family:inherit;outline:none;}
.photo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px;padding:12px 18px;overflow-y:auto;flex:1;min-height:120px;}
.photo-cell{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;padding:6px;border-radius:var(--r-md);border:1px solid transparent;position:relative;}
.photo-cell:hover{background:var(--secondary-background-color,#f5f5f5);border-color:var(--divider-color,#e0e0e0);}
.photo-cell.selected{border-color:var(--primary-color,#03a9f4);background:rgba(3,169,244,.08);}
.photo-cell img{width:64px;height:64px;object-fit:cover;border-radius:var(--r-md);border:1px solid var(--divider-color,#e0e0e0);display:block;}
.photo-cell-name{font-size:11px;color:var(--secondary-text-color);text-align:center;word-break:break-word;max-width:80px;}
.photo-del-btn{position:absolute;top:2px;right:2px;width:18px;height:18px;border-radius:3px;background:#FCEBEB;border:1px solid #F09595;color:#A32D2D;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;font-family:inherit;}

/* Upload panel */
.upload-panel{display:flex;flex-direction:column;flex:1;overflow:hidden;}
.upload-area{padding:16px 18px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;flex:1;}
.dropzone{border:2px dashed var(--divider-color,#e0e0e0);border-radius:var(--r-lg);padding:20px;text-align:center;color:var(--secondary-text-color);font-size:13px;cursor:pointer;transition:border-color .15s;}
.dropzone:hover{border-color:var(--primary-color,#03a9f4);}
.dropzone-icon{font-size:22px;margin-bottom:4px;}
.dropzone-hint{font-size:11px;margin-top:3px;opacity:.6;}
.or-url{font-size:12px;text-align:center;opacity:.6;}
.url-row{display:flex;gap:6px;}
.url-row input,.name-input{flex:1;padding:6px 10px;font-size:13px;border:1px solid var(--divider-color,#e0e0e0);border-radius:var(--r-md);background:var(--secondary-background-color,#f5f5f5);color:var(--primary-text-color);font-family:inherit;outline:none;}
.name-input{width:100%;}

/* Modal footer */
.modal-foot{padding:10px 18px;border-top:1px solid var(--divider-color,#e0e0e0);display:flex;gap:8px;justify-content:flex-end;flex-shrink:0;}

/* Add item modal */
.modal-body{padding:16px 18px;display:flex;flex-direction:column;gap:12px;overflow-y:auto;flex:1;}
.field-label{font-size:12px;color:var(--secondary-text-color);margin-bottom:4px;}
.modal-body input[type=text],.modal-body select{
  width:100%;padding:8px 10px;font-size:14px;
  border:1px solid var(--divider-color,#e0e0e0);border-radius:var(--r-md);
  background:var(--secondary-background-color,#f5f5f5);
  color:var(--primary-text-color);font-family:inherit;outline:none;
}
.modal-body input:focus,.modal-body select:focus{border-color:var(--primary-color,#03a9f4);}
`;

/* ══════════════════════════════════════════════════════════════════
   CUSTOM ELEMENT
   ══════════════════════════════════════════════════════════════════ */
class InventoryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass          = null;
    this._data          = null;
    this._t             = TRANSLATIONS.en;
    this._loading       = true;
    this._status        = '';
    this._statusError   = false;
    this._saveTimer     = null;
    this._pollTimer     = null;
    this._version       = '…';
    this._configTitle   = null;

    // UI state
    this._expandedItems  = new Set();
    this._activeCat      = null;   // null = all
    this._activeLoc      = null;   // null = all
    this._searchQuery    = '';
    this._filterOpen     = false;
    this._activeModal    = null;
    this._settingsTab    = 'categories';
    this._pickerTarget   = null;
    this._pickerSelected = null;
    this._pickerTab      = 'lib';
    this._initialized    = false;
  }

  set hass(hass) {
    this._hass = hass;
    this._t    = resolveLocale(hass?.locale?.language);
    if (!this._initialized) {
      this._initialized = true;
      this._fetchVersion();
      this._load().then(() => this._render());
      this._pollTimer = setInterval(() => this._load().then(() => this._render()), POLL_MS);
    }
  }

  disconnectedCallback() { clearInterval(this._pollTimer); clearTimeout(this._saveTimer); }

  setConfig(cfg) {
    this._config      = cfg || {};
    this._configTitle = cfg?.title || null;
  }
  static getConfigElement() { return null; }
  static getStubConfig()    { return {}; }

  /* ── Version ── */
  async _fetchVersion() {
    try {
      const r = await fetch(API_VERSION, { headers: { Authorization: 'Bearer ' + this._token() } });
      if (r.ok) { const j = await r.json(); this._version = j.version || '?'; this._render(); }
    } catch (_) {}
  }

  /* ── API ── */
  _token() { return this._hass?.auth?.data?.access_token || ''; }

  async _load() {
    try {
      const r = await fetch(API_URL, { headers: { Authorization: 'Bearer ' + this._token() } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const data = await r.json();
      if (!data.photos    || !data.photos.length)    data.photos    = buildDefaultPhotos(this._t);
      if (!data.categories|| !data.categories.length) data.categories = [...this._t.defaultCategories];
      if (!data.locations || !data.locations.length)  data.locations  = [...this._t.defaultLocations];
      if (!data.items) data.items = [];
      // migrate old units: add location field if missing
      data.items.forEach(item => (item.units || []).forEach(u => { if (!('location' in u)) u.location = null; }));
      this._data = data; this._loading = false; this._setStatus(this._t.loaded);
    } catch (err) {
      console.error('[resources-card] load:', err);
      if (!this._data) {
        this._data = { items: [], categories: [...this._t.defaultCategories], locations: [...this._t.defaultLocations], photos: buildDefaultPhotos(this._t) };
        this._loading = false;
      }
      this._setStatus(this._t.loadError, true);
    }
  }

  _save() {
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(async () => {
      try {
        const r = await fetch(API_URL, { method: 'POST', headers: { Authorization: 'Bearer ' + this._token(), 'Content-Type': 'application/json' }, body: JSON.stringify(this._data) });
        if (!r.ok) throw new Error('HTTP ' + r.status);
        this._setStatus(this._t.saved);
      } catch (e) { console.error('[resources-card] save:', e); this._setStatus(this._t.saveError, true); }
    }, 600);
  }

  _setStatus(msg, error = false) {
    this._status = msg; this._statusError = error;
    const el = this.shadowRoot?.querySelector('.status-bar');
    if (el) { el.textContent = msg; el.className = 'status-bar' + (error ? ' error' : ''); }
    if (!error) setTimeout(() => { if (this._status === msg) { this._status = ''; if (el) el.textContent = ''; } }, 3000);
  }

  _photos()      { return this._data.photos    || []; }
  _locations()   { return this._data.locations || []; }
  _photoById(id) { return this._photos().find(p => p.id === id); }
  _addPhoto(src, name) { const id = 'p_' + uid(); this._data.photos.push({ id, name: name || 'Photo', src }); return id; }

  /* ── Computed: unique locations on an item (from its units) ── */
  _itemLocations(item) {
    const locs = (item.units || []).map(u => u.location).filter(Boolean);
    return [...new Set(locs)];
  }

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  _render() {
    const root = this.shadowRoot;
    const t    = this._t;

    // Always (re)inject style — HA can wipe shadowRoot on view switch
    const existingStyle = root.querySelector('style');
    if (existingStyle) existingStyle.remove();
    const s = document.createElement('style'); s.textContent = CSS; root.prepend(s);

    // Lightbox: persistent node outside .card, recreate if lost
    if (!root.querySelector('.lightbox')) {
      const lb = document.createElement('div'); lb.className = 'lightbox';
      const img = document.createElement('img'); img.alt = '';
      const cls = document.createElement('div'); cls.className = 'lb-close'; cls.textContent = '✕';
      cls.onclick = () => lb.classList.remove('open');
      lb.onclick  = e => { if (e.target === lb) lb.classList.remove('open'); };
      lb.appendChild(cls); lb.appendChild(img); root.appendChild(lb);
    }

    // .card is always recreated from scratch to avoid stale state
    const existingCard = root.querySelector('.card');
    if (existingCard) existingCard.remove();
    const card = document.createElement('div'); card.className = 'card'; root.appendChild(card);

    if (this._loading) { card.innerHTML = `<div class="empty">${t.loading}</div>`; return; }

    const { items = [], categories = [], locations = [] } = this._data;

    // Filter
    const q = this._searchQuery.toLowerCase();
    const visible = items.filter(item => {
      if (this._activeCat && item.category !== this._activeCat) return false;
      if (this._activeLoc) {
        const locs = this._itemLocations(item);
        if (!locs.includes(this._activeLoc)) return false;
      }
      if (q && !item.name.toLowerCase().includes(q)
            && !(item.category || '').toLowerCase().includes(q)
            && !this._itemLocations(item).some(l => l.toLowerCase().includes(q))) return false;
      return true;
    });


    /* ── Header ── */
    const header = document.createElement('div'); header.className = 'header';
    const titleEl = document.createElement('div'); titleEl.className = 'header-title';
    titleEl.textContent = this._configTitle || t.title;
    const verEl = document.createElement('span'); verEl.className = 'header-version'; verEl.textContent = 'v' + this._version;

    // Settings gear button
    const gearBtn = document.createElement('button'); gearBtn.className = 'btn-icon'; gearBtn.title = t.settingsTitle;
    gearBtn.textContent = '⚙️'; gearBtn.onclick = () => { this._activeModal = 'settings'; this._render(); };

    // Add item button
    const addBtn = document.createElement('button'); addBtn.className = 'btn-add-item';
    addBtn.textContent = t.btnAddItem; addBtn.onclick = () => { this._activeModal = 'add-item'; this._render(); };

    header.appendChild(titleEl); header.appendChild(verEl);
    header.appendChild(gearBtn); header.appendChild(addBtn);
    card.appendChild(header);

    /* ── Search ── */
    const sw = document.createElement('div'); sw.className = 'search-wrap';
    const si = document.createElement('span'); si.className = 'search-icon'; si.textContent = '🔍';
    const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = t.searchPlaceholder; inp.value = this._searchQuery;
    inp.oninput = e => { this._searchQuery = e.target.value; this._render(); };
    sw.appendChild(si); sw.appendChild(inp); card.appendChild(sw);

    /* ── Filter collapse toggle ── */
    const hasActiveFilter = this._activeCat !== null || this._activeLoc !== null;
    const toggle = document.createElement('div');
    toggle.className = 'filter-toggle' + (hasActiveFilter ? ' has-active' : '');
    const toggleIcon = document.createElement('span'); toggleIcon.textContent = '⚗️';
    const toggleLabel = document.createElement('span'); toggleLabel.textContent = t.filters;
    const toggleHint = document.createElement('span'); toggleHint.className = 'filter-active-hint';
    if (hasActiveFilter) {
      const parts = [];
      if (this._activeCat) parts.push(this._activeCat);
      if (this._activeLoc) parts.push(this._activeLoc);
      toggleHint.textContent = '· ' + parts.join(' · ');
    }
    const chev = document.createElement('span'); chev.className = 'filter-chevron' + (this._filterOpen ? ' open' : ''); chev.textContent = '▶';
    toggle.appendChild(toggleIcon); toggle.appendChild(toggleLabel);
    if (hasActiveFilter) toggle.appendChild(toggleHint);
    toggle.appendChild(chev);
    toggle.onclick = () => { this._filterOpen = !this._filterOpen; this._render(); };
    card.appendChild(toggle);

    /* ── Filter panel ── */
    const fp = document.createElement('div'); fp.className = 'filter-panel' + (this._filterOpen ? ' open' : '');

    // Categories section
    const catSec = document.createElement('div');
    const catLabel = document.createElement('div'); catLabel.className = 'filter-section-label'; catLabel.textContent = t.filterCategories;
    const catPills = document.createElement('div'); catPills.className = 'pills';
    const catAll = document.createElement('button'); catAll.className = 'pill' + (this._activeCat === null ? ' active' : '');
    catAll.textContent = t.allCategories; catAll.onclick = () => { this._activeCat = null; this._render(); };
    catPills.appendChild(catAll);
    categories.forEach(c => {
      const p = document.createElement('button'); p.className = 'pill' + (this._activeCat === c ? ' active' : '');
      p.textContent = c; p.onclick = () => { this._activeCat = (this._activeCat === c ? null : c); this._render(); };
      catPills.appendChild(p);
    });
    catSec.appendChild(catLabel); catSec.appendChild(catPills);
    fp.appendChild(catSec);

    // Locations section
    const locSec = document.createElement('div');
    const locLabel = document.createElement('div'); locLabel.className = 'filter-section-label'; locLabel.textContent = t.filterLocations;
    const locPills = document.createElement('div'); locPills.className = 'pills';
    const locAll = document.createElement('button'); locAll.className = 'pill' + (this._activeLoc === null ? ' active' : '');
    locAll.textContent = t.allLocations; locAll.onclick = () => { this._activeLoc = null; this._render(); };
    locPills.appendChild(locAll);
    locations.forEach(l => {
      const pal = locPalette(l);
      const p = document.createElement('button');
      p.className = 'pill' + (this._activeLoc === l ? ' active' : '');
      if (this._activeLoc !== l) { p.style.background = pal.bg; p.style.borderColor = pal.bd; p.style.color = pal.tx; }
      p.textContent = l;
      p.onclick = () => { this._activeLoc = (this._activeLoc === l ? null : l); this._render(); };
      locPills.appendChild(p);
    });
    locSec.appendChild(locLabel); locSec.appendChild(locPills);
    fp.appendChild(locSec);
    card.appendChild(fp);

    /* ── Legend ── */
    const legend = document.createElement('div'); legend.className = 'legend';
    [['#E24B4A', t.legendEmpty], ['#D85A30', t.legendOne], ['#EF9F27', t.legendSoon], ['#639922', t.legendOk]].forEach(([color, label]) => {
      const leg = document.createElement('div'); leg.className = 'leg';
      const dot = document.createElement('div'); dot.className = 'leg-dot'; dot.style.background = color;
      const txt = document.createElement('span'); txt.textContent = label;
      leg.appendChild(dot); leg.appendChild(txt); legend.appendChild(leg);
    });
    card.appendChild(legend);

    /* ── Item list ── */
    const listEl = document.createElement('div'); listEl.className = 'item-list';
    if (!visible.length) {
      const e = document.createElement('div'); e.className = 'empty';
      e.textContent = items.length ? t.noResults : t.noItems; listEl.appendChild(e);
    } else {
      visible.forEach(item => this._renderItem(listEl, item));
    }
    card.appendChild(listEl);

    /* ── Status ── */
    const sb = document.createElement('div'); sb.className = 'status-bar' + (this._statusError ? ' error' : ''); sb.textContent = this._status;
    card.appendChild(sb);

    /* ── Modals ── */
    if (this._activeModal === 'settings')  this._modalSettings(card);
    if (this._activeModal === 'add-item')  this._modalAddItem(card);
    if (this._activeModal === 'picker')    this._modalPicker(card);
  }

  /* ══════════════════════════════════════════════
     ITEM CARD
  ══════════════════════════════════════════════ */
  _renderItem(listEl, item) {
    const t = this._t;
    const color  = itemColor(item);
    const photo  = this._photoById(item.photoId);
    const isOpen = this._expandedItems.has(item.id);
    const locs   = this._itemLocations(item);

    const card = document.createElement('div'); card.className = `item-card ${color}`;

    /* Row */
    const row = document.createElement('div'); row.className = 'item-row';
    row.onclick = () => { this._expandedItems.has(item.id) ? this._expandedItems.delete(item.id) : this._expandedItems.add(item.id); this._render(); };

    /* Thumb */
    const tw = document.createElement('div'); tw.className = 'thumb-wrap';
    if (photo) {
      const img = document.createElement('img'); img.className = 'thumb-img'; img.src = photo.src; img.alt = photo.name;
      img.onclick = e => { e.stopPropagation(); this._openLightbox(photo.src); };
      tw.appendChild(img);
    } else {
      const ph = document.createElement('div'); ph.className = 'thumb-empty'; ph.textContent = '+';
      ph.onclick = e => { e.stopPropagation(); this._openPicker(item); };
      tw.appendChild(ph);
    }
    row.appendChild(tw);

    const dot = document.createElement('div'); dot.className = 'color-dot'; row.appendChild(dot);

    /* Info: name + tags */
    const info = document.createElement('div'); info.className = 'item-info';
    const nameEl = document.createElement('div'); nameEl.className = 'item-name'; nameEl.textContent = item.name;
    info.appendChild(nameEl);

    /* Tags row: category + location tags */
    const tags = document.createElement('div'); tags.className = 'item-tags';
    if (item.category) {
      const ct = document.createElement('span'); ct.className = 'tag tag-cat'; ct.textContent = item.category;
      tags.appendChild(ct);
    }
    locs.forEach(loc => {
      const pal = locPalette(loc);
      const lt = document.createElement('span'); lt.className = 'tag';
      lt.textContent = loc;
      lt.style.background = pal.bg; lt.style.borderColor = pal.bd; lt.style.color = pal.tx;
      tags.appendChild(lt);
    });
    if (tags.children.length) info.appendChild(tags);
    row.appendChild(info);

    const qty = document.createElement('span'); qty.className = 'item-qty'; qty.textContent = (item.units || []).length + ' ' + t.units; row.appendChild(qty);
    const arrow = document.createElement('span'); arrow.className = 'item-arrow' + (isOpen ? ' open' : ''); arrow.textContent = '▶'; row.appendChild(arrow);
    card.appendChild(row);

    /* Detail */
    const detail = document.createElement('div'); detail.className = 'item-detail' + (isOpen ? ' open' : '');

    /* Photo section */
    const ps = document.createElement('div'); ps.className = 'photo-sec';
    if (photo) {
      const lg = document.createElement('img'); lg.className = 'photo-lg'; lg.src = photo.src; lg.alt = photo.name;
      lg.onclick = () => this._openLightbox(photo.src); ps.appendChild(lg);
    } else {
      const pe = document.createElement('div'); pe.className = 'photo-lg-empty'; pe.textContent = '📷'; ps.appendChild(pe);
    }
    const pb = document.createElement('div'); pb.className = 'photo-btns';
    const pickBtn = this._btn(photo ? '🖼 Zmeniť' : '🖼 Vybrať', e => { e.stopPropagation(); this._openPicker(item); });
    pb.appendChild(pickBtn);
    if (photo) { const vb = this._btn('🔍 Zobraziť', e => { e.stopPropagation(); this._openLightbox(photo.src); }); pb.appendChild(vb); }
    ps.appendChild(pb); detail.appendChild(ps);

    /* Unit list */
    const ul = document.createElement('div'); ul.className = 'unit-list';
    if (!(item.units || []).length) {
      const emp = document.createElement('div'); emp.style.cssText = 'font-size:13px;opacity:.6;padding:4px 0'; emp.textContent = '—'; ul.appendChild(emp);
    }
    (item.units || []).forEach((unit, idx) => {
      const ur = document.createElement('div'); ur.className = 'unit-row';

      const num = document.createElement('span'); num.className = 'unit-num'; num.textContent = '#' + (idx + 1); ur.appendChild(num);

      const dw = document.createElement('span'); dw.className = 'unit-date';
      const di = document.createElement('input'); di.type = 'date'; di.value = unit.expiry || '';
      di.onchange = e => { unit.expiry = e.target.value || null; this._save(); this._render(); };
      dw.appendChild(di); ur.appendChild(dw);

      const { cls, txt } = expiryBadge(unit.expiry, t);
      const badge = document.createElement('span'); badge.className = 'eb ' + cls; badge.textContent = txt; ur.appendChild(badge);

      /* Location select */
      const lw = document.createElement('span'); lw.className = 'unit-loc';
      const ls = document.createElement('select');
      const noneOpt = document.createElement('option'); noneOpt.value = ''; noneOpt.textContent = '📍 ' + t.noLocation; ls.appendChild(noneOpt);
      this._locations().forEach(loc => {
        const o = document.createElement('option'); o.value = loc; o.textContent = '📍 ' + loc;
        if (unit.location === loc) o.selected = true;
        ls.appendChild(o);
      });
      ls.onchange = e => { unit.location = e.target.value || null; this._save(); this._render(); };
      lw.appendChild(ls); ur.appendChild(lw);

      const sp = document.createElement('span'); sp.className = 'unit-spacer'; ur.appendChild(sp);

      const del = document.createElement('button'); del.className = 'btn-unit-del'; del.textContent = '✕';
      del.onclick = e => { e.stopPropagation(); item.units = item.units.filter(u => u.id !== unit.id); this._save(); this._render(); };
      ur.appendChild(del);
      ul.appendChild(ur);
    });
    detail.appendChild(ul);

    const addU = document.createElement('button'); addU.className = 'btn-add-unit'; addU.textContent = t.addUnit;
    addU.onclick = e => { e.stopPropagation(); if (!item.units) item.units = []; item.units.push({ id: nextId(item.units), expiry: null, location: null }); this._expandedItems.add(item.id); this._save(); this._render(); };
    detail.appendChild(addU);

    const acts = document.createElement('div'); acts.className = 'item-actions';
    const renBtn = this._btn(t.rename, () => { const n = prompt(t.renamePrompt, item.name); if (!n) return; item.name = n; this._save(); this._render(); });
    const delBtn = this._btn(t.delete, () => { if (!confirm(t.deleteConfirm(item.name))) return; this._data.items = this._data.items.filter(x => x.id !== item.id); this._expandedItems.delete(item.id); this._save(); this._render(); });
    delBtn.classList.add('btn-danger');
    acts.appendChild(renBtn); acts.appendChild(delBtn); detail.appendChild(acts);

    card.appendChild(detail); listEl.appendChild(card);
  }

  /* ── Lightbox ── */
  _openLightbox(src) {
    const lb = this.shadowRoot.querySelector('.lightbox');
    lb.querySelector('img').src = src; lb.classList.add('open');
  }

  /* ══════════════════════════════════════════════
     MODALS — helpers
  ══════════════════════════════════════════════ */
  _closeModal() { this._activeModal = null; this._pickerTarget = null; this._pickerSelected = null; this._render(); }

  _overlay() {
    const bg = document.createElement('div'); bg.className = 'modal-bg open';
    bg.onclick = e => { if (e.target === bg) this._closeModal(); };
    return bg;
  }

  _modalBox(title) {
    const bg = this._overlay();
    const box = document.createElement('div'); box.className = 'modal-box';
    const head = document.createElement('div'); head.className = 'modal-head';
    const te = document.createElement('span'); te.className = 'modal-head-title'; te.textContent = title;
    const xb = document.createElement('button'); xb.className = 'modal-x'; xb.textContent = '✕'; xb.onclick = () => this._closeModal();
    head.appendChild(te); head.appendChild(xb); box.appendChild(head); bg.appendChild(box);
    return { bg, box };
  }

  /* ══════════════════════════════════════════════
     SETTINGS MODAL  (Categories | Locations | Photos)
  ══════════════════════════════════════════════ */
  _modalSettings(card) {
    const t = this._t;
    const { bg, box } = this._modalBox(t.settingsTitle);

    const tabs = document.createElement('div'); tabs.className = 'modal-tabs';
    const mkTab = (key, label) => {
      const tb = document.createElement('button'); tb.className = 'modal-tab' + (this._settingsTab === key ? ' active' : '');
      tb.textContent = label; tb.onclick = () => { this._settingsTab = key; renderActivePanel(); };
      tabs.appendChild(tb); return tb;
    };
    const tCat = mkTab('categories', t.tabCategories);
    const tLoc = mkTab('locations',  t.tabLocations);
    const tPho = mkTab('photos',     t.tabPhotos);
    box.appendChild(tabs);

    const panelWrap = document.createElement('div'); panelWrap.style.cssText = 'display:flex;flex-direction:column;flex:1;overflow:hidden;';
    box.appendChild(panelWrap);

    const foot = document.createElement('div'); foot.className = 'modal-foot';
    foot.appendChild(this._btn(t.btnClose, () => this._closeModal()));
    box.appendChild(foot);

    const updateTabStyles = () => {
      [['categories', tCat], ['locations', tLoc], ['photos', tPho]].forEach(([k, tb]) => {
        tb.className = 'modal-tab' + (this._settingsTab === k ? ' active' : '');
      });
    };

    const renderActivePanel = () => {
      updateTabStyles();
      panelWrap.innerHTML = '';
      if (this._settingsTab === 'categories') this._panelSimpleList(panelWrap, 'categories', t.newCategoryPh, t.btnAddCat, t.deleteCatConfirm, (name) => (this._data.items || []).filter(i => i.category === name).length, (oldName, newName) => { this._data.items.forEach(i => { if (i.category === oldName) i.category = newName; }); }, (name) => { this._data.items.forEach(i => { if (i.category === name) i.category = ''; }); });
      if (this._settingsTab === 'locations')  this._panelSimpleList(panelWrap, 'locations', t.newLocationPh, t.btnAddLoc, t.deleteLocConfirm, (name) => (this._data.items || []).flatMap(i => i.units || []).filter(u => u.location === name).length, () => {}, (name) => { (this._data.items || []).forEach(i => (i.units || []).forEach(u => { if (u.location === name) u.location = null; })); });
      if (this._settingsTab === 'photos')     this._panelPhotos(panelWrap);
    };

    renderActivePanel();
    card.appendChild(bg);
  }

  /* Generic editable list panel (for categories & locations) */
  _panelSimpleList(wrap, dataKey, newPh, addLabel, deleteConfirmFn, countFn, onRename, onDelete) {
    const t    = this._t;
    const list = document.createElement('div'); list.className = 'settings-list';

    const build = () => {
      list.innerHTML = '';
      const items = this._data[dataKey] || [];
      if (!items.length) {
        const m = document.createElement('div'); m.style.cssText = 'font-size:13px;opacity:.6;padding:8px'; m.textContent = '—'; list.appendChild(m); return;
      }
      items.forEach((name, idx) => {
        const row = document.createElement('div'); row.className = 'settings-row';
        const count = countFn(name);
        const inp = document.createElement('input'); inp.type = 'text'; inp.value = name;
        inp.onchange = () => {
          const nv = inp.value.trim(); if (!nv || nv === name) { inp.value = name; return; }
          if (this._data[dataKey].includes(nv)) { inp.value = name; return; }
          this._data[dataKey][idx] = nv; onRename(name, nv); this._save(); build();
        };
        row.appendChild(inp);
        const cnt = document.createElement('span'); cnt.className = 'settings-count'; cnt.textContent = count + '×'; row.appendChild(cnt);
        const db = this._btn('🗑', () => {
          if (count > 0 && !confirm(deleteConfirmFn(name, count))) return;
          this._data[dataKey] = this._data[dataKey].filter(x => x !== name);
          onDelete(name); this._save(); build();
        }); db.classList.add('btn-danger');
        row.appendChild(db); list.appendChild(row);
      });
    };
    build();
    wrap.appendChild(list);

    const ar = document.createElement('div'); ar.className = 'settings-add-row';
    const ni = document.createElement('input'); ni.placeholder = newPh;
    const ab = this._btn(addLabel, () => {
      const name = ni.value.trim(); if (!name) return;
      if (!this._data[dataKey]) this._data[dataKey] = [];
      if (this._data[dataKey].includes(name)) return;
      this._data[dataKey].push(name); ni.value = ''; this._save(); build();
    }); ab.classList.add('btn-primary');
    ni.onkeydown = e => { if (e.key === 'Enter') ab.click(); };
    ar.appendChild(ni); ar.appendChild(ab); wrap.appendChild(ar);
  }

  /* Photos panel inside settings */
  _panelPhotos(wrap) {
    const t = this._t;
    let activeTab = 'lib';

    const tabs = document.createElement('div'); tabs.className = 'modal-tabs'; tabs.style.padding = '0 18px';
    const tLib = document.createElement('button'); tLib.className = 'modal-tab active'; tLib.textContent = t.libTab;
    const tUp  = document.createElement('button'); tUp.className  = 'modal-tab';        tUp.textContent  = t.uploadTab;
    tabs.appendChild(tLib); tabs.appendChild(tUp); wrap.appendChild(tabs);

    const libPanel = document.createElement('div'); libPanel.className = 'picker-lib';
    const grid = document.createElement('div'); grid.className = 'photo-grid';
    const buildGrid = () => {
      grid.innerHTML = '';
      if (!this._photos().length) { const m = document.createElement('div'); m.style.cssText = 'padding:8px;font-size:13px;opacity:.6'; m.textContent = t.noPhotos; grid.appendChild(m); return; }
      this._photos().forEach(p => {
        const cell = document.createElement('div'); cell.className = 'photo-cell';
        const img  = document.createElement('img'); img.src = p.src; img.alt = p.name;
        const nm   = document.createElement('span'); nm.className = 'photo-cell-name'; nm.textContent = p.name;
        const del  = document.createElement('button'); del.className = 'photo-del-btn'; del.textContent = '✕';
        del.onclick = e => { e.stopPropagation(); if (!confirm(t.deletePhotoConfirm(p.name))) return; this._data.photos = this._data.photos.filter(x => x.id !== p.id); this._data.items.forEach(i => { if (i.photoId === p.id) i.photoId = null; }); this._save(); buildGrid(); this._render(); };
        cell.appendChild(img); cell.appendChild(nm); cell.appendChild(del); grid.appendChild(cell);
      });
    };
    buildGrid(); libPanel.appendChild(grid); wrap.appendChild(libPanel);

    const upPanel = this._buildUploadPanel(t, (id) => { this._pickerSelected = id; buildGrid(); showTab('lib'); });
    upPanel.style.display = 'none'; wrap.appendChild(upPanel);

    const showTab = (tab) => {
      activeTab = tab;
      tLib.className = 'modal-tab' + (tab === 'lib'    ? ' active' : '');
      tUp.className  = 'modal-tab' + (tab === 'upload' ? ' active' : '');
      libPanel.style.display = tab === 'lib'    ? 'flex' : 'none';
      upPanel.style.display  = tab === 'upload' ? 'flex' : 'none';
    };
    tLib.onclick = () => showTab('lib');
    tUp.onclick  = () => showTab('upload');
  }

  /* ── Upload panel (reusable) ── */
  _buildUploadPanel(t, onAdded) {
    const panel = document.createElement('div'); panel.className = 'upload-panel';
    const area  = document.createElement('div'); area.className  = 'upload-area';

    const dz = document.createElement('div'); dz.className = 'dropzone';
    dz.innerHTML = `<div class="dropzone-icon">📁</div><div>${t.dropzoneText}</div><div class="dropzone-hint">${t.dropzoneHint}</div>`;
    const fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'image/*'; fi.style.display = 'none';
    dz.onclick = () => fi.click();

    const ni = document.createElement('input'); ni.className = 'name-input'; ni.placeholder = t.photoNamePh;
    const or = document.createElement('div'); or.className = 'or-url'; or.textContent = t.orUrl;
    const ur = document.createElement('div'); ur.className = 'url-row';
    const ui = document.createElement('input'); ui.placeholder = t.photoUrlPh;
    const ub = this._btn(t.btnAddUrl, () => {
      const url = ui.value.trim(); if (!url) return;
      const id = this._addPhoto(url, ni.value.trim() || 'Photo');
      ui.value = ''; ni.value = ''; this._save(); onAdded(id);
    });
    ur.appendChild(ui); ur.appendChild(ub);

    fi.onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const id = this._addPhoto(ev.target.result, ni.value.trim() || f.name.replace(/\.[^.]+$/, ''));
        ni.value = ''; fi.value = ''; this._save(); onAdded(id);
      };
      reader.readAsDataURL(f);
    };

    area.appendChild(dz); area.appendChild(fi); area.appendChild(ni); area.appendChild(or); area.appendChild(ur);
    panel.appendChild(area);
    return panel;
  }

  /* ══════════════════════════════════════════════
     PICKER MODAL (per-item photo selection)
  ══════════════════════════════════════════════ */
  _openPicker(item) { this._pickerTarget = item; this._pickerSelected = item.photoId; this._pickerTab = 'lib'; this._activeModal = 'picker'; this._render(); }

  _modalPicker(card) {
    const t    = this._t;
    const item = this._pickerTarget;
    const { bg, box } = this._modalBox(t.tabPhotos + (item ? ' — ' + item.name : ''));

    const tabs   = document.createElement('div'); tabs.className = 'modal-tabs';
    const tLib   = document.createElement('button'); tLib.className   = 'modal-tab' + (this._pickerTab === 'lib'    ? ' active' : ''); tLib.textContent   = t.libTab;
    const tUp    = document.createElement('button'); tUp.className    = 'modal-tab' + (this._pickerTab === 'upload' ? ' active' : ''); tUp.textContent    = t.uploadTab;
    tabs.appendChild(tLib); tabs.appendChild(tUp); box.appendChild(tabs);

    /* Lib panel */
    const libPanel = document.createElement('div'); libPanel.className = 'picker-lib';
    const sw  = document.createElement('div'); sw.className = 'picker-search';
    const qi  = document.createElement('input'); qi.placeholder = t.searchPhotos; sw.appendChild(qi); libPanel.appendChild(sw);
    const grid = document.createElement('div'); grid.className = 'photo-grid';

    const buildGrid = () => {
      const q = qi.value.toLowerCase(); grid.innerHTML = '';
      const filtered = this._photos().filter(p => !q || p.name.toLowerCase().includes(q));
      if (!filtered.length) { const m = document.createElement('div'); m.style.cssText = 'padding:8px;font-size:13px;opacity:.6'; m.textContent = t.noPhotos; grid.appendChild(m); return; }
      filtered.forEach(p => {
        const cell = document.createElement('div'); cell.className = 'photo-cell' + (this._pickerSelected === p.id ? ' selected' : '');
        const img  = document.createElement('img'); img.src = p.src; img.alt = p.name;
        const nm   = document.createElement('span'); nm.className = 'photo-cell-name'; nm.textContent = p.name;
        cell.appendChild(img); cell.appendChild(nm);
        cell.onclick = () => { this._pickerSelected = p.id; buildGrid(); };
        grid.appendChild(cell);
      });
    };
    buildGrid(); qi.oninput = buildGrid;
    libPanel.appendChild(grid); box.appendChild(libPanel);

    /* Upload panel */
    const upPanel = this._buildUploadPanel(t, (id) => { this._pickerSelected = id; buildGrid(); showTab('lib'); });
    upPanel.style.display = 'none'; box.appendChild(upPanel);

    const showTab = (tab) => {
      this._pickerTab = tab;
      tLib.className  = 'modal-tab' + (tab === 'lib'    ? ' active' : '');
      tUp.className   = 'modal-tab' + (tab === 'upload' ? ' active' : '');
      libPanel.style.display  = tab === 'lib'    ? 'flex' : 'none';
      upPanel.style.display   = tab === 'upload' ? 'flex' : 'none';
    };
    tLib.onclick = () => showTab('lib');
    tUp.onclick  = () => showTab('upload');

    const foot = document.createElement('div'); foot.className = 'modal-foot';
    const clrBtn = this._btn(t.removePhoto, () => { this._pickerSelected = null; if (item) { item.photoId = null; this._save(); } this._closeModal(); });
    const canBtn = this._btn(t.btnCancel,   () => this._closeModal());
    const cfmBtn = this._btn(t.btnConfirm,  () => { if (item) { item.photoId = this._pickerSelected; this._save(); } this._closeModal(); });
    cfmBtn.classList.add('btn-primary');
    foot.appendChild(clrBtn); foot.appendChild(canBtn); foot.appendChild(cfmBtn);
    box.appendChild(foot);
    card.appendChild(bg);
  }

  /* ══════════════════════════════════════════════
     ADD ITEM MODAL
  ══════════════════════════════════════════════ */
  _modalAddItem(card) {
    const t = this._t;
    const { bg, box } = this._modalBox(t.modalAddTitle);
    const body = document.createElement('div'); body.className = 'modal-body';

    const ln = document.createElement('div'); ln.className = 'field-label'; ln.textContent = t.labelName;
    const ni = document.createElement('input'); ni.type = 'text'; ni.placeholder = t.namePlaceholder;
    body.appendChild(ln); body.appendChild(ni);

    const lc = document.createElement('div'); lc.className = 'field-label'; lc.textContent = t.labelCategory;
    const sel = document.createElement('select');
    (this._data.categories || []).forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; sel.appendChild(o); });
    body.appendChild(lc); body.appendChild(sel);
    box.appendChild(body);

    const foot = document.createElement('div'); foot.className = 'modal-foot';
    const can = this._btn(t.btnCancel, () => this._closeModal());
    const add = this._btn(t.btnAdd, () => {
      const name = ni.value.trim(); if (!name) { ni.focus(); return; }
      this._data.items.push({ id: nextId(this._data.items), name, category: sel.value || '', photoId: null, units: [] });
      this._save(); this._closeModal();
    }); add.classList.add('btn-primary');
    ni.onkeydown = e => { if (e.key === 'Enter') add.click(); };
    foot.appendChild(can); foot.appendChild(add); box.appendChild(foot);
    card.appendChild(bg);
    setTimeout(() => ni.focus(), 40);
  }

  /* ── Tiny helper ── */
  _btn(label, onclick) {
    const b = document.createElement('button'); b.className = 'btn'; b.textContent = label;
    if (onclick) b.onclick = onclick; return b;
  }
}

customElements.define('resources-card', InventoryCard);
