// @ts-nocheck
const tmPromise = import(
  /* @vite-ignore */
  "https://cdn.jsdelivr.net/npm/@thumbmarkjs/thumbmarkjs/dist/thumbmark.umd.js"
).then(() => new (window as any).ThumbmarkJS.Thumbmark());

export async function getVisitorId(): Promise<string | null> {
  try {
    const tm = await tmPromise;
    const result = await tm.get();
    return result.thumbmark;
  } catch (err) {
    console.warn("ThumbmarkJS failed:", err);
    return null;
  }
}
