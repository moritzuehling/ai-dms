import { AsyncLocalStorage } from "async_hooks";
import { ConcurrentPromiseQueue } from "concurrent-promise-queue";
import into from "draftlog";
import { createTask, update } from "./console-task";
into(console);

export function taskQueue<T, X>(
  prefix: (obj: T) => string,
  objs: T[],
  fn: (obj: T) => Promise<X>
): Promise<unknown> {
  const queue = new ConcurrentPromiseQueue<X>({
    maxNumberOfConcurrentPromises: 14,
  });

  return Promise.allSettled(
    objs.map((obj) => {
      const ensureTask = createTask(prefix(obj));

      return queue.addPromise(() => {
        ensureTask();
        update("🛫", "Started");

        const res = fn(obj);

        res
          .then(() => {
            ensureTask();
            update("🟢", "Finished", true);
          })
          .catch((e) => {
            ensureTask();
            update("🔴", e.toString().split("\n")[0]);
          });

        return res;
      });
    })
  );
}
