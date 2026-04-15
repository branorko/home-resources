"""Config flow for Home Resources integration."""
from __future__ import annotations

from homeassistant import config_entries
import voluptuous as vol

DOMAIN = "home_resources"


class HomeResourcesConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Simple config flow — no user input required."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Single step — immediately creates the config entry."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is not None:
            return self.async_create_entry(title="Home Resources", data={})

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({}),
        )
