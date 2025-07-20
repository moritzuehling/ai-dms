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
import { update } from "./util/console-task.js";
llm(<ClassifyDoc docId={10} />);

// await doOCR();
await doSummarize();

async function doOCR() {
  const todo = await getToOCR();
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
  const todo = await getAllDocs(); // getToSummarize();
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
