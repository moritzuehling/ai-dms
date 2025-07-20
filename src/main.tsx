import { ConcurrentPromiseQueue } from "concurrent-promise-queue";
import { llm } from "./ai/request.js";
import { getToOCR, setContent } from "./paperless/document.js";

import { MainPrompt } from "./prompt/ocr.js";
import into from "draftlog";
into(console);

const todo = await getToOCR();
const docIds = todo.data!.results.map((a) => a.id);

const queue = new ConcurrentPromiseQueue<void>({
  maxNumberOfConcurrentPromises: 1,
});

await Promise.all(
  docIds.map((doc) => {
    const prefix = [`Document ${doc}:`];
    const draft = console.draft(...prefix, "waiting").bind(console, ...prefix);

    return queue.addPromise(async () => {
      draft("processing");
      const now = performance.now();

      const res = await llm(<MainPrompt docId={doc} />);
      draft("uploading");

      await setContent(doc, res.message.content!);

      const el = performance.now() - now;
      draft(`done after ${(el / 1000).toFixed(2)}s`);
    });
  })
);
