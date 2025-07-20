import { llm } from "./ai/request.js";
import {
  getAllDocs,
  getToOCR,
  getToSummarize,
  setContent,
  setSummary,
} from "./paperless/document.js";

import { OCRPrompt } from "./prompt/ocr.js";
import { taskQueue } from "./util/queue.js";
import { SummarizeDoc } from "./prompt/summary.js";
import { ClassifyDoc } from "./prompt/classify.js";
import { createTask, update } from "./util/console-task.js";

const res = await llm(<ClassifyDoc docId={7} />);
console.log(res.message.content);

process.exit();

await doOCR();
await doSummarize();

async function doOCR() {
  createTask("Gathering OCR docs");
  const todo = await getToOCR();
  update("🟢", `${todo.data?.results.length} docs to OCR`, true);

  const docIds = todo.data!.results.map((a) => a.id);
  await taskQueue(
    (id) => `Document ${id.toString().padStart(3)}`,
    docIds,
    async (id) => {
      update("✨", "Analyzing");
      const res = await llm(<OCRPrompt docId={id} />);

      update("🚀", "Uploading");
      await setContent(id, res.message.content!);
    }
  );
}

async function doSummarize() {
  createTask("Gathering summarization docs");
  const todo = await getToSummarize();
  update("🟢", `${todo.data?.results.length} docs to summarize`, true);

  const docIds = todo.data!.results.map((a) => a.id);
  await taskQueue(
    (id) => `Summarizing ${id.toString().padStart(3)}`,
    docIds,
    async (id) => {
      update("✨", "Analyzing");
      const res = await llm(<SummarizeDoc docId={id} />);

      update("🚀", "Uploading");
      // await setSummary(id, res.message.content!);
    }
  );
}
