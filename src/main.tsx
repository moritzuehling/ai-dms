import { ConcurrentPromiseQueue } from "concurrent-promise-queue";
import { llm } from "./ai/request.js";
import { getToOCR, setContent } from "./paperless/document.js";
import { MainPrompt } from "./prompt/ocr.js";
import into from "draftlog";
into(console).addLineListener(process.stdin);

const todo = await getToOCR();
const docIds: number[] = todo.results.map((a) => a.id);
docIds.sort();

const queue = new ConcurrentPromiseQueue({ maxNumberOfConcurrentPromises: 8 });

await Promise.all(
  docIds.map((doc) => {
    const prefix = [`Document ${doc}:`];
    const draft = console.draft(...prefix, "waiting").bind(console, ...prefix);

    return queue.addPromise(async () => {
      draft("processing");
      const now = performance.now();

      const res = await ocr(doc);
      draft("uploading");

      await setContent(doc, res.message.content!);

      const el = performance.now() - now;
      draft(`done after ${(el / 1000).toFixed(2)}s`);
    });
  })
);

function ocr(docId: number) {
  return llm(<MainPrompt docId={docId} />);
}
