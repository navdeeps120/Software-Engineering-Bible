from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class ModuleRecord:
    name: str
    dependencies: list[str] = field(default_factory=list)


class ImportGraph:
    def __init__(self) -> None:
        self.modules: dict[str, ModuleRecord] = {}

    def add(self, module: ModuleRecord) -> None:
        if module.name in self.modules:
            raise ValueError(f"duplicate module {module.name}")
        self.modules[module.name] = ModuleRecord(module.name, list(module.dependencies))

    def load_order(self, entry: str) -> list[str]:
        if entry not in self.modules:
            raise KeyError(entry)
        order: list[str] = []
        visiting: set[str] = set()
        visited: set[str] = set()

        def visit(name: str) -> None:
            if name in visited:
                return
            if name in visiting:
                raise ImportError(f"circular import involving {name}")
            module = self.modules.get(name)
            if module is None:
                raise ImportError(f"missing module {name}")
            visiting.add(name)
            for dep in module.dependencies:
                visit(dep)
            visiting.remove(name)
            visited.add(name)
            order.append(name)

        visit(entry)
        return order
