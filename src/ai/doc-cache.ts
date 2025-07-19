import type { File } from "@google/genai/node";
import fs from "fs/promises";

async function load(): Promise<{}> {
  try {
    return JSON.parse(await fs.readFile("data/google.json", "utf-8"));
  } catch {
    return {};
  }
}

const cache: { [id: string]: File } = await load();

export async function set(id: string, file: File) {
  cache[id] = file;
  return file;
}

export async function get(id: string): Promise<File | undefined> {
  return cache[id];
}
