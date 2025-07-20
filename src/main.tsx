import { ConcurrentPromiseQueue } from "concurrent-promise-queue";
import { llm } from "./ai/request.js";
import {
  getToOCR,
  getToSummarize,
  setContent,
  setSummary,
} from "./paperless/document.js";

import { OCRPrompt } from "./prompt/ocr.js";
import into from "draftlog";
import { setState, taskQueue } from "./util/queue.js";
import { SummarizeDoc } from "./prompt/summary.js";
into(console);

await doSummarize();

async function doOCR() {
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
}

async function doSummarize() {
  const todo = await getToSummarize();
  const docIds = todo.data!.results.map((a) => a.id);
  await taskQueue(
    (id) => `Summarizing ${id.toString().padStart(3)}`,
    docIds,
    async (id) => {
      setState("✨ Analyzing");
      const res = await llm(<SummarizeDoc docId={id} />);

      setState("uploading");
      await setSummary(id, res.message.content!);
    }
  );
}
