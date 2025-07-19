import dotenv from "dotenv";
dotenv.config();
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
  const data = await fetch(`/documents/${documentId}/download`);
  const blob = await data.blob();
  console.log("got ", blob.size, "bytes");
}
