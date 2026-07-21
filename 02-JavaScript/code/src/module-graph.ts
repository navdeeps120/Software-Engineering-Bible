export interface ModuleRecord {
  id: string;
  dependencies: string[];
}

export class ModuleGraph {
  private modules = new Map<string, ModuleRecord>();

  add(module: ModuleRecord): void {
    if (this.modules.has(module.id)) throw new Error(`duplicate module ${module.id}`);
    this.modules.set(module.id, { ...module, dependencies: [...module.dependencies] });
  }

  loadOrder(entry: string): string[] {
    if (!this.modules.has(entry)) throw new Error(`unknown entry ${entry}`);
    const order: string[] = [];
    const visiting = new Set<string>();
    const visited = new Set<string>();

    const visit = (id: string): void => {
      if (visited.has(id)) return;
      if (visiting.has(id)) throw new Error(`cycle detected at ${id}`);
      const module = this.modules.get(id);
      if (!module) throw new Error(`missing dependency ${id}`);
      visiting.add(id);
      for (const dependency of module.dependencies) visit(dependency);
      visiting.delete(id);
      visited.add(id);
      order.push(id);
    };

    visit(entry);
    return order;
  }

  dependentsOf(target: string): string[] {
    return [...this.modules.values()]
      .filter((module) => module.dependencies.includes(target))
      .map((module) => module.id);
  }
}
