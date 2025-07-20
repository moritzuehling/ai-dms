import dotenv from "dotenv";
dotenv.config({ quiet: true });
import type { paths } from "./spec";
import createClient, { type FetchResponse } from "openapi-fetch";

const baseUrl = process.env["PAPERLESS_API"]!.replace(/\/api\/?$/, "");
const token = process.env["PAPERLESS_API_TOKEN"];

export const api = createClient<paths>({
  baseUrl: baseUrl,
  headers: {
    Authorization: `Token ${token}`,
  },
});

export function apiFetch(url: string, req?: RequestInit) {
  const base = url.startsWith("https://") ? "" : baseUrl;

  return globalThis.fetch(`${base}${url}`, {
    ...req,
    headers: {
      authorization: `Token ${token}`,
      ...(req?.headers ?? {}),
    },
  });
}

export function fill(id: number) {
  return {
    params: {
      path: {
        id,
      },
    },
  };
}
