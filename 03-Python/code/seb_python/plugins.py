from __future__ import annotations

from typing import Protocol, runtime_checkable


@runtime_checkable
class Plugin(Protocol):
    name: str

    def run(self) -> str: ...


class PluginRegistry:
    def __init__(self) -> None:
        self._plugins: dict[str, Plugin] = {}

    def register(self, plugin: Plugin) -> None:
        if not isinstance(plugin, Plugin):
            raise TypeError("plugin must satisfy Plugin protocol")
        if plugin.name in self._plugins:
            raise ValueError(f"duplicate plugin {plugin.name}")
        self._plugins[plugin.name] = plugin

    def get(self, name: str) -> Plugin:
        return self._plugins[name]

    def names(self) -> list[str]:
        return sorted(self._plugins)
