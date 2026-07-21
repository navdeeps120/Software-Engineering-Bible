type Listener<T> = (event: T) => void;

interface Entry<T> {
  listener: Listener<T>;
  once: boolean;
}

export class EventEmitter<Events extends Record<PropertyKey, unknown>> {
  private listeners = new Map<keyof Events, Array<Entry<Events[keyof Events]>>>();

  on<K extends keyof Events>(name: K, listener: Listener<Events[K]>): () => void {
    return this.add(name, listener, false);
  }

  once<K extends keyof Events>(name: K, listener: Listener<Events[K]>): () => void {
    return this.add(name, listener, true);
  }

  private add<K extends keyof Events>(
    name: K,
    listener: Listener<Events[K]>,
    once: boolean,
  ): () => void {
    const entries = this.listeners.get(name) ?? [];
    entries.push({ listener: listener as Listener<Events[keyof Events]>, once });
    this.listeners.set(name, entries);
    return () => this.off(name, listener);
  }

  off<K extends keyof Events>(name: K, listener: Listener<Events[K]>): void {
    const entries = this.listeners.get(name);
    if (!entries) return;
    const filtered = entries.filter((entry) => entry.listener !== listener);
    if (filtered.length === 0) this.listeners.delete(name);
    else this.listeners.set(name, filtered);
  }

  emit<K extends keyof Events>(name: K, event: Events[K]): unknown[] {
    const snapshot = [...(this.listeners.get(name) ?? [])];
    const errors: unknown[] = [];
    for (const entry of snapshot) {
      if (entry.once) this.off(name, entry.listener as Listener<Events[K]>);
      try {
        entry.listener(event);
      } catch (error) {
        errors.push(error);
      }
    }
    return errors;
  }

  listenerCount<K extends keyof Events>(name: K): number {
    return this.listeners.get(name)?.length ?? 0;
  }

  clear<K extends keyof Events>(name?: K): void {
    if (name === undefined) this.listeners.clear();
    else this.listeners.delete(name);
  }
}
