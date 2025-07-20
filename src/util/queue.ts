import { AsyncLocalStorage } from "async_hooks";
import { ConcurrentPromiseQueue } from "concurrent-promise-queue";

const draftCtx = new AsyncLocalStorage<(message: string) => void>();

export function taskQueue<T, X>(
  prefix: (obj: T) => string,
  objs: T[],
  fn: (obj: T) => Promise<X>
): Promise<(X | null)[]> {
  const queue = new ConcurrentPromiseQueue<X>({
    maxNumberOfConcurrentPromises: 5,
  });

  return Promise.all(
    objs.map((obj) => {
      const message = prefix(obj);
      const draft = console
        .draft(message + ":", "⌛")
        .bind(console, message + ":");

      return queue.addPromise(() => {
        draftCtx.enterWith(draft);

        draft("🏃");

        const now = performance.now();
        const res = fn(obj);

        res.then(() => {
          const el = performance.now() - now;
          draft(`✔ (${(el / 1000).toFixed(2)}s)`);
        });

        return res;
      });
    })
  );
}

export function setState(text: string) {
  draftCtx.getStore()?.(text);
}
