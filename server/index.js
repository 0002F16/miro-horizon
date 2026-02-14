import "dotenv/config";
import express from "express";
import cors from "cors";

const { MIRO_ACCESS_TOKEN, MIRO_BOARD_ID } = process.env;
const PORT = process.env.PORT || 3001;
const MIRO_API = "https://api.miro.com/v2";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

/** Strip HTML tags so content from Miro (e.g. <p>text</p>) is returned as plain text. Preserves newlines. */
function stripHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim();
}

/**
 * Fetch all sticky notes from the board (cursor pagination).
 * Maps Miro items to Horizon shape { id, title, description }.
 * Content format from create script: "slug\ntitle\ndescription"
 */
async function fetchBoardItems() {
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
      const cleaned = stripHtml(raw) || raw.replace(/<[^>]*>/g, "").trim();
      const lines = cleaned.split("\n").map((s) => stripHtml(s).trim()).filter(Boolean);
      if (lines.length >= 3) {
        items.push({
          id: lines[0],
          title: lines[1],
          description: lines.slice(2).join(" "),
        });
      } else {
        const plain = (cleaned || raw).replace(/<[^>]*>/g, "").trim();
        items.push({
          id: String(item.id),
          title: plain.slice(0, 50) || "Untitled",
          description: plain.slice(50) || "",
        });
      }
    }
    cursor = body.cursor || null;
  } while (cursor);
  return items;
}

app.get("/api/items", async (req, res) => {
  try {
    const list = await fetchBoardItems();
    if (list === null) {
      return res.status(503).json({
        error: "Board not configured",
        message: "Set MIRO_ACCESS_TOKEN and MIRO_BOARD_ID in .env and run the create-board script.",
      });
    }
    res.json(list);
  } catch (e) {
    const status = e.status || 502;
    res.status(status).json({ error: "Failed to fetch board items", message: e.message });
  }
});

app.post("/api/items/:itemId/vote", async (req, res) => {
  const { itemId } = req.params;
  if (!MIRO_BOARD_ID || !MIRO_ACCESS_TOKEN) {
    return res.status(503).json({ error: "Board not configured" });
  }
  // itemId from Horizon is our slug; we need Miro's numeric id. We don't store slug->id map,
  // so we fetch items, find by slug, then PATCH that item's id.
  try {
    const list = await fetchBoardItems();
    if (!list || !list.length) {
      return res.status(502).json({ error: "Could not load board" });
    }
    const bySlug = list.find((i) => i.id === itemId);
    if (!bySlug) {
      return res.status(404).json({ error: "Item not found", itemId });
    }
    // We need Miro item id. Our list only has slug. So we must fetch raw items and find id by matching content (slug in first line).
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
    const newContent = currentContent.includes("Voted by:") ? currentContent : currentContent + append;

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
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to record vote", message: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Horizon API server at http://localhost:${PORT}`);
  if (!MIRO_ACCESS_TOKEN) console.warn("Missing MIRO_ACCESS_TOKEN in .env");
  if (!MIRO_BOARD_ID) console.warn("Missing MIRO_BOARD_ID in .env (run create-board script after Phase 1–2)");
});
