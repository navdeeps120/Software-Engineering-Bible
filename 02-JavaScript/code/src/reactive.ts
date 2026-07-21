type Effect = () => void;
type DependencyMap = Map<PropertyKey, Set<Effect>>;

let activeEffect: Effect | null = null;
const dependencies = new WeakMap<object, DependencyMap>();

function track(target: object, key: PropertyKey): void {
  if (!activeEffect) return;
  let byKey = dependencies.get(target);
  if (!byKey) {
    byKey = new Map();
    dependencies.set(target, byKey);
  }
  let effects = byKey.get(key);
  if (!effects) {
    effects = new Set();
    byKey.set(key, effects);
  }
  effects.add(activeEffect);
}

function trigger(target: object, key: PropertyKey): void {
  const effects = dependencies.get(target)?.get(key);
  if (!effects) return;
  for (const effect of [...effects]) queueMicrotask(effect);
}

export function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(object, key, receiver) {
      track(object, key);
      return Reflect.get(object, key, receiver);
    },
    set(object, key, value, receiver) {
      const previous = Reflect.get(object, key, receiver);
      const changed = !Object.is(previous, value);
      const success = Reflect.set(object, key, value, receiver);
      if (success && changed) trigger(object, key);
      return success;
    },
  });
}

export function effect(run: Effect): void {
  const tracked = () => {
    const previous = activeEffect;
    activeEffect = tracked;
    try {
      run();
    } finally {
      activeEffect = previous;
    }
  };
  tracked();
}
