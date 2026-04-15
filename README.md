# 🏠 Home Resources — Home Assistant Integration

Household stock management directly in Home Assistant. Installable via HACS — no manual file copying, automatic card registration.

## Features

- 📦 Item list with search and category filter
- 🎨 Color coding: 🔴 0 units · 🟡 expiring within 6 months · 🟠 1 unit · 🟢 2+ units
- 📅 Expiry date tracking per unit with countdown
- 📷 Photo library for items (file upload or URL)
- 🏷 Editable categories
- 💾 Data stored in HA `.storage` — shared across devices, survives restarts
- 🌍 Multi-language: auto-detected from HA language setting (SK, EN, CS, DE)

## Installation via HACS

1. Open **HACS → Integrations**
2. Click **⋮ → Custom repositories**
3. Enter the GitLab repository URL, category: **Integration**
4. Search for **Home Resources** and install
5. Restart Home Assistant
6. Go to **Settings → Devices & Services → + Add Integration → Home Resources**
7. Add the card to your dashboard:

```yaml
type: custom:resources-card
```

> The card registers automatically — no need to add a resource manually.

## Adding a language

Open `www/resources-card.js` and add a new entry to the `TRANSLATIONS` object:

```js
fr: {
  title:         '🏠 Inventaire',
  btnCategories: '🏷 Catégories',
  // ... (copy any existing block and translate)
}
```

The key must be a BCP-47 language tag matching what HA reports (e.g. `fr`, `hu`, `pl`).

## Data storage

Data is stored in `/.storage/home_resources.data` via the HA `Store` API:
- ✅ Available on **all devices** simultaneously  
- ✅ Survives HA **restarts**  
- ✅ Included in standard **HA backups**

## Project structure

```
home-resources/
├── hacs.json
├── README.md
└── custom_components/
    └── home_resources/
        ├── __init__.py          ← Python backend (Store, REST API, auto JS registration)
        ├── config_flow.py       ← zero-config UI installation
        ├── manifest.json
        ├── strings.json
        └── www/
            └── resources-card.js  ← Lovelace custom card with i18n
```
