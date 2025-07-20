import { getFileDownload } from "../ai/file";
import { api, apiFetch, fill } from "./api";
import type { components } from "./spec";

export async function getDocumentDownload(documentId: number) {
  const id = `document${documentId}`;
  return getFileDownload(id, async () => {
    const data = await apiFetch(`/api/documents/${documentId}/download/`);
    return await data.blob();
  });
}

export async function getDoc(id: number) {
  return await api.GET("/api/documents/{id}/", fill(id));
}

export async function getAllDocs() {
  return await api.GET("/api/documents/");
}

type Correspondent = components["schemas"]["Correspondent"];
export async function getAllCorrespondents() {
  const data: Correspondent[] = [];
  for (let page = 1; ; page++) {
    const res = await api.GET("/api/correspondents/", {
      params: {
        query: { page, page_size: 100 },
      },
    });
    const newE = res.data?.results ?? [];
    if (newE.length > 0) {
      data.push(...newE);
      if (res.data?.next) {
        continue;
      }
    }

    break;
  }
  return data;
}

export async function getToClassify() {
  return await api.GET("/api/documents/", {
    params: {
      query: {
        correspondent__isnull: true,
        custom_field_query: JSON.stringify(["full-ocr", "exact", "done"]),
      },
    },
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

export async function getToSummarize() {
  return await api.GET("/api/documents/", {
    params: {
      query: {
        custom_field_query: JSON.stringify(["full-ocr", "exact", "ocr"]),
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
          value: "ocr",
        },
      ],
      remove_inbox_tags: false,
    },
  });
}

export async function setSummary(documentId: number, contents: string) {
  const doc = await getDoc(documentId);

  while (contents.indexOf("\n</summary>\n") != -1) {
    contents = contents.replaceAll("\n</summary>\n", "<\\/summary>");
  }

  await api.PATCH("/api/documents/{id}/", {
    ...fill(documentId),
    body: {
      content: `<summary>\n${contents}\n</summary>\n\n${doc.data!.content}`,
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

export function parseDocContent(doc: components["schemas"]["Document"]) {
  const c = doc.content?.trim();
  if (!c) {
    return {};
  }

  if (c.startsWith("<summary>") && c.indexOf("</summary>") != -1) {
    const summaryEnd = c.indexOf("</summary>");
    const summaryContent = c.substring("<summary>".length, summaryEnd);
    const docContent = c.substring(summaryEnd + "</summary>".length);

    return {
      summary: summaryContent,
      content: docContent,
    };
  }

  return {
    content: c,
  };
}
