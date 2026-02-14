/**
 * Shared Miro API logic for Vercel serverless functions.
 * Uses MIRO_ACCESS_TOKEN and MIRO_BOARD_ID from process.env.
 */
const MIRO_API = "https://api.miro.com/v2";

export async function fetchBoardItems() {
  const { MIRO_ACCESS_TOKEN, MIRO_BOARD_ID } = process.env;
  if (!MIRO_BOARD_ID || !MIRO_ACCESS_TOKEN) {
    return null;
  }
  const items = [];
  let cursor;
  do {
    const url = new URL(`${MIRO_API}/boards/${MIRO_BOARD_ID}/items`);
    url.searchParams.set("type", "sticky_note");
    url.searchParams.set("limit", "50");
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${MIRO_ACCESS_TOKEN}` },
    });
    if (!res.ok) {
      const err = new Error(`Miro API ${res.status}`);
      err.status = res.status;
      throw err;
    }
    const body = await res.json();
    for (const item of body.data || []) {
      const raw = item.data?.content ?? "";
      const lines = raw.split("\n").map((s) => s.trim()).filter(Boolean);
      if (lines.length >= 3) {
        items.push({
          id: lines[0],
          title: lines[1],
          description: lines.slice(2).join(" "),
        });
      } else {
        items.push({
          id: String(item.id),
          title: raw.slice(0, 50) || "Untitled",
          description: raw.slice(50) || "",
        });
      }
    }
    cursor = body.cursor || null;
  } while (cursor);
  return items;
}
