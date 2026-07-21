type State = "pending" | "fulfilled" | "rejected";
type Resolve<T> = (value: T | PromiseLike<T>) => void;
type Reject = (reason: unknown) => void;

export class SebPromise<T> implements PromiseLike<T> {
  private state: State = "pending";
  private value: unknown;
  private reactions: Array<() => void> = [];

  constructor(executor: (resolve: Resolve<T>, reject: Reject) => void) {
    let called = false;
    const resolve: Resolve<T> = (value) => {
      if (called) return;
      called = true;
      this.resolveValue(value);
    };
    const reject: Reject = (reason) => {
      if (called) return;
      called = true;
      this.settle("rejected", reason);
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  private resolveValue(value: T | PromiseLike<T>): void {
    if (value === this) {
      this.settle("rejected", new TypeError("promise cannot resolve to itself"));
      return;
    }
    if (
      (typeof value === "object" && value !== null) ||
      typeof value === "function"
    ) {
      let then: unknown;
      try {
        then = (value as PromiseLike<T>).then;
      } catch (error) {
        this.settle("rejected", error);
        return;
      }
      if (typeof then === "function") {
        let called = false;
        try {
          then.call(
            value,
            (next: T | PromiseLike<T>) => {
              if (!called) {
                called = true;
                this.resolveValue(next);
              }
            },
            (reason: unknown) => {
              if (!called) {
                called = true;
                this.settle("rejected", reason);
              }
            },
          );
        } catch (error) {
          if (!called) this.settle("rejected", error);
        }
        return;
      }
    }
    this.settle("fulfilled", value);
  }

  private settle(state: Exclude<State, "pending">, value: unknown): void {
    if (this.state !== "pending") return;
    this.state = state;
    this.value = value;
    const reactions = this.reactions.splice(0);
    for (const reaction of reactions) queueMicrotask(reaction);
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): SebPromise<TResult1 | TResult2> {
    return new SebPromise<TResult1 | TResult2>((resolve, reject) => {
      const reaction = () => {
        try {
          if (this.state === "fulfilled") {
            resolve(onFulfilled ? onFulfilled(this.value as T) : (this.value as TResult1));
          } else {
            if (onRejected) resolve(onRejected(this.value));
            else reject(this.value);
          }
        } catch (error) {
          reject(error);
        }
      };
      if (this.state === "pending") this.reactions.push(reaction);
      else queueMicrotask(reaction);
    });
  }

  catch<TResult = never>(
    onRejected: (reason: unknown) => TResult | PromiseLike<TResult>,
  ): SebPromise<T | TResult> {
    return this.then(null, onRejected);
  }

  static resolve<T>(value: T | PromiseLike<T>): SebPromise<T> {
    return new SebPromise((resolve) => resolve(value));
  }

  static reject<T = never>(reason: unknown): SebPromise<T> {
    return new SebPromise((_, reject) => reject(reason));
  }
}
