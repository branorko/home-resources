"""Home Resources — household stock management for Home Assistant."""
from __future__ import annotations

import logging
import os

from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType
from homeassistant.helpers.storage import Store
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import HomeAssistantView

_LOGGER = logging.getLogger(__name__)

DOMAIN = "home_resources"
STORAGE_KEY = "home_resources.data"
STORAGE_VERSION = 1
STATIC_URL = "/home_resources_static/resources-card.js"
LOVELACE_RESOURCE_VERSION = 1

DEFAULT_DATA = {
    "items": [],
    "categories": ["Food", "Hygiene", "Medicine"],
    "photos": [],
}


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration on HA start."""

    # Persistent storage via HA Store (.storage/home_resources.data)
    store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    data = await store.async_load()

    if data is None:
        data = DEFAULT_DATA.copy()
        await store.async_save(data)
        _LOGGER.info("[home_resources] Created new data store")
    else:
        _LOGGER.info(
            "[home_resources] Loaded data (%d items, %d categories, %d photos)",
            len(data.get("items", [])),
            len(data.get("categories", [])),
            len(data.get("photos", [])),
        )

    hass.data[DOMAIN] = {"store": store, "data": data}

    # Register REST API endpoint
    hass.http.register_view(InventoryDataView(hass))

    # Register static JS file
    js_path = os.path.join(os.path.dirname(__file__), "www", "resources-card.js")
    if os.path.isfile(js_path):
        try:
            from homeassistant.components.http import StaticPathConfig
            await hass.http.async_register_static_paths([
                StaticPathConfig(STATIC_URL, js_path, cache_headers=False)
            ])
        except (ImportError, AttributeError):
            hass.http.register_static_path(STATIC_URL, js_path, cache_headers=False)
        add_extra_js_url(hass, STATIC_URL)
        _LOGGER.info("[home_resources] Frontend card registered: %s", STATIC_URL)
    else:
        _LOGGER.warning("[home_resources] resources-card.js not found at %s", js_path)

    # Auto-register Lovelace resource — wait for HA to fully start first
    async def _register_when_ready(event=None):
        await _async_register_lovelace_resource(hass)

    hass.bus.async_listen_once(
        "homeassistant_started", _register_when_ready
    )

    return True


async def _async_register_lovelace_resource(hass: HomeAssistant) -> None:
    """Automatically add the JS card to Lovelace resources."""
    try:
        lovelace = hass.data.get("lovelace")
        if lovelace is None:
            _LOGGER.debug("[home_resources] Lovelace not available, skipping resource registration")
            return

        resource_url = f"{STATIC_URL}?v={LOVELACE_RESOURCE_VERSION}"
        resources_store = Store(hass, 1, "lovelace_resources")
        resources_data = await resources_store.async_load() or {"items": []}
        items = resources_data.get("items", [])

        existing = None
        for item in items:
            if STATIC_URL in item.get("url", ""):
                existing = item
                break

        if existing is None:
            existing_ids = [int(item.get("id", 0)) for item in items]
            new_id = max(existing_ids, default=0) + 1
            items.append({"id": new_id, "type": "module", "url": resource_url})
            resources_data["items"] = items
            await resources_store.async_save(resources_data)
            _LOGGER.info("[home_resources] Lovelace resource added: %s", resource_url)
        elif existing.get("url") != resource_url:
            existing["url"] = resource_url
            await resources_store.async_save(resources_data)
            _LOGGER.info("[home_resources] Lovelace resource updated: %s", resource_url)
        else:
            _LOGGER.debug("[home_resources] Lovelace resource already current")

    except Exception as exc:
        _LOGGER.warning("[home_resources] Could not register Lovelace resource: %s", exc)


class InventoryDataView(HomeAssistantView):
    """REST API endpoint /api/home_resources/data — read and write inventory data."""

    url = "/api/home_resources/data"
    name = "api:home_resources:data"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request):
        """Return current inventory data."""
        from aiohttp.web import Response
        import json

        data = self._hass.data.get(DOMAIN, {}).get("data", DEFAULT_DATA)
        return Response(text=json.dumps(data), content_type="application/json")

    async def post(self, request):
        """Save new inventory data."""
        from aiohttp.web import Response
        import json

        try:
            body = await request.json()
        except Exception:
            return Response(
                text=json.dumps({"error": "Invalid JSON"}),
                status=400,
                content_type="application/json",
            )

        domain_data = self._hass.data.get(DOMAIN, {})
        store: Store = domain_data.get("store")
        if store is None:
            return Response(
                text=json.dumps({"error": "Store not available"}),
                status=500,
                content_type="application/json",
            )

        domain_data["data"] = body
        await store.async_save(body)
        _LOGGER.debug("[home_resources] Data saved (%d items)", len(body.get("items", [])))

        return Response(text=json.dumps({"ok": True}), content_type="application/json")


async def async_setup_entry(hass: HomeAssistant, entry) -> bool:
    """Set up from a config entry (called by config_flow)."""
    return await async_setup(hass, {})


async def async_unload_entry(hass: HomeAssistant, entry) -> bool:
    """Unload the integration."""
    hass.data.pop(DOMAIN, None)
    return True
