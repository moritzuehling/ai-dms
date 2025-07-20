import { llm } from "./ai/request.js";
import {
  getAllCorrespondents,
  getAllDocs,
  getToClassify,
  getToOCR,
  getToSummarize,
  setContent,
  setSummary,
} from "./paperless/document.js";

import { OCRPrompt } from "./prompt/ocr.js";
import { taskQueue } from "./util/queue.js";
import { SummarizeDoc } from "./prompt/summary.js";
import { ClassifyDoc, classifySchema } from "./prompt/classify.js";
import { createTask, update } from "./util/console-task.js";
import { api, fill } from "./paperless/api.js";

await Promise.all([doOCR(), doSummarize(), doClassify()]);

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
      await setSummary(id, res.message.content!);
    }
  );
}

async function doClassify() {
  createTask("Classification docs");
  const todo = await getToClassify();
  update("🟢", `${todo.data?.results.length} to do`, true);

  const docIds = todo.data!.results.map((a) => a.id);
  await taskQueue(
    (id) => `Classifying ${id.toString().padStart(3)}`,
    docIds,
    classifyDocument
  );
}

async function classifyDocument(id: number) {
  update("✨", "Analyzing");
  const res = await llm(<ClassifyDoc docId={id} />, {
    type: "json_object",
  });

  const dataJ = JSON.parse(res.message.content!);
  const classification = classifySchema.parse(dataJ);

  let correspondent = classification.correspondent;
  if (typeof correspondent == "string") {
    const res = await api.POST("/api/correspondents/", {
      body: {
        name: correspondent,
        is_insensitive: true,
      },
    });
    correspondent = res.data?.id!;
  }

  update("🚀", "Uploading");
  await api.PATCH("/api/documents/{id}/", {
    ...fill(id),
    body: {
      remove_inbox_tags: false,
      document_type: classification.docType,
      correspondent,
      created: classification.documentDate,
      title: classification.title,
    },
  });
}
