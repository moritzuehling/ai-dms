import dotenv from "dotenv";
import { getFileDownload } from "../ai/file";
dotenv.config({ quiet: true });
const baseUrl = process.env["PAPERLESS_API"];
const token = process.env["PAPERLESS_API_TOKEN"];

function fetch(url: string, req?: RequestInit) {
  return globalThis.fetch(`${baseUrl}${url}`, {
    headers: {
      ...(req?.headers ?? {}),
      authorization: `Token ${token}`,
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
