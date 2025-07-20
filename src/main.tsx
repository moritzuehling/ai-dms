import { ConcurrentPromiseQueue } from "concurrent-promise-queue";
import { llm } from "./ai/request.js";
import { getToOCR, setContent } from "./paperless/document.js";

import { OCRPrompt } from "./prompt/ocr.js";
import into from "draftlog";
import { setState, taskQueue } from "./util/queue.js";
into(console);

const todo = await getToOCR();
const docIds = todo.data!.results.map((a) => a.id);

await taskQueue(
  (id) => `Document ${id.toString().padStart(3)}`,
  docIds,
  async (id) => {
    setState("✨ Analyzing");
    const res = await llm(<OCRPrompt docId={id} />);

    setState("uploading");
    await setContent(id, res.message.content!);
  }
);

/*
await Promise.all(
  docIds.map((doc) => {
    const prefix = [`Document ${doc}:`];
    const draft = console.draft(...prefix, "waiting").bind(console, ...prefix);

    return queue.addPromise(async () => {
      draft("processing");
      const now = performance.now();

      const res = await llm(<OCRPrompt docId={doc} />);
      draft("uploading");

      await setContent(doc, res.message.content!);

      const el = performance.now() - now;
      draft(`done after ${(el / 1000).toFixed(2)}s`);
    });
  })
);
*/
