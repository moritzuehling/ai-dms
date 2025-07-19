import dotenv from "dotenv";
import { getFileDownload } from "../ai/file";
dotenv.config({ quiet: true });
const baseUrl = process.env["PAPERLESS_API"];
const token = process.env["PAPERLESS_API_TOKEN"];

function fetch(url: string, req?: RequestInit) {
  return globalThis.fetch(`${baseUrl}${url}`, {
    ...req,
    headers: {
      "content-type": "application/json",
      authorization: `Token ${token}`,
      ...(req?.headers ?? {}),
    },
  });
}

export async function getDocumentDownload(documentId: number) {
  const id = `document${documentId}`;
  return getFileDownload(id, async () => {
    const data = await fetch(`/documents/${documentId}/download/`);
    return await data.blob();
  });
}

export async function getToOCR() {
  const res = await fetch(
    '/documents/?custom_field_query=["full-ocr", "exists", false]'
  );
  return await res.json();
}

export async function setContent(documentId: number, content: string) {
  await fetch(`/documents/${documentId}/`, {
    method: "PATCH",
    body: JSON.stringify({
      content,
      custom_fields: [
        {
          field: 10,
          value: "done",
        },
      ],
    }),
  });
}

export async function setSummary(documentId: number, contents: string) {
  /*
  const res = await fetch(`/documents/${documentId}/notes/`, {
    method: "POST",
    body: JSON.stringify({
      note: contents,
    }),
  });

  const notes = await res.json();
  const noteId = notes[notes.length - 1].id;

  await fetch(`/documents/${documentId}/`, {
    method: "PATCH",
    body: JSON.stringify({
      custom_fields: [
        {
          field: 10,
          value: noteId + "",
        },
      ],
    }),
  });
  */
}
