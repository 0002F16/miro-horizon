import { fetchBoardItems } from "../../_lib/miro.js";

const MIRO_API = "https://api.miro.com/v2";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { MIRO_ACCESS_TOKEN, MIRO_BOARD_ID } = process.env;
  if (!MIRO_BOARD_ID || !MIRO_ACCESS_TOKEN) {
    return res.status(503).json({ error: "Board not configured" });
  }

  const itemId = req.query.itemId;
  if (!itemId) {
    return res.status(400).json({ error: "Missing itemId" });
  }

  try {
    const list = await fetchBoardItems();
    if (!list || !list.length) {
      return res.status(502).json({ error: "Could not load board" });
    }
    const bySlug = list.find((i) => i.id === itemId);
    if (!bySlug) {
      return res.status(404).json({ error: "Item not found", itemId });
    }

    let cursor;
    let miroId;
    do {
      const url = new URL(`${MIRO_API}/boards/${MIRO_BOARD_ID}/items`);
      url.searchParams.set("type", "sticky_note");
      url.searchParams.set("limit", "50");
      if (cursor) url.searchParams.set("cursor", cursor);
      const r = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${MIRO_ACCESS_TOKEN}` },
      });
      if (!r.ok) throw new Error(`Miro ${r.status}`);
      const body = await r.json();
      for (const item of body.data || []) {
        const firstLine = (item.data?.content ?? "").split("\n")[0]?.trim();
        if (firstLine === itemId) {
          miroId = item.id;
          break;
        }
      }
      cursor = body.cursor;
    } while (cursor && !miroId);

    if (!miroId) {
      return res.status(404).json({ error: "Sticky not found on board", itemId });
    }

    const patchUrl = `${MIRO_API}/boards/${MIRO_BOARD_ID}/sticky_notes/${miroId}`;
    const getRes = await fetch(patchUrl, {
      headers: { Authorization: `Bearer ${MIRO_ACCESS_TOKEN}` },
    });
    if (!getRes.ok) throw new Error(`Miro get ${getRes.status}`);
    const existing = await getRes.json();
    const currentContent = existing.data?.content ?? "";
    const append = "\nVoted by: Horizon user";
    const newContent = currentContent.includes("Voted by:")
      ? currentContent
      : currentContent + append;

    const patchRes = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${MIRO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { content: newContent } }),
    });
    if (!patchRes.ok) {
      const errBody = await patchRes.text();
      throw new Error(`Miro PATCH ${patchRes.status}: ${errBody}`);
    }
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({
      error: "Failed to record vote",
      message: e.message,
    });
  }
}
