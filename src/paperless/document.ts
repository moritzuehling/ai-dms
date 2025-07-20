import { getFileDownload } from "../ai/file";
import { api, apiFetch, fill } from "./api";

export async function getDocumentDownload(documentId: number) {
  const id = `document${documentId}`;
  return getFileDownload(id, async () => {
    const data = await apiFetch(`"/api/documents/${documentId}/download/"`);
    return await data.blob();
  });
}

export async function getToOCR() {
  return await api.GET("/api/documents/", {
    params: {
      query: {
        custom_field_query: JSON.stringify(["full-ocr", "exists", false]),
      },
    },
  });
}

export async function setContent(documentId: number, content: string) {
  return await api.PATCH("/api/documents/{id}/", {
    ...fill(documentId),
    body: {
      content,
      custom_fields: [
        {
          field: 10,
          value: "done",
        },
      ],
      remove_inbox_tags: false,
    },
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
