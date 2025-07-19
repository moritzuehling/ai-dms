import { get, set } from "./doc-cache";
import { gemini } from "./google";

export async function getFileDownload(id: string, fn: () => Promise<Blob>) {
  const cached = await get(id);
  if (
    cached?.expirationTime &&
    new Date(cached.expirationTime).getTime() > Date.now()
  ) {
    return cached;
  }

  try {
    return set(id, await gemini.files.get({ name: id }));
  } catch {}

  return set(
    id,
    await gemini.files.upload({
      file: await fn(),
      config: {
        name: id,
      },
    })
  );
}
