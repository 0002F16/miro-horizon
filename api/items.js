import { fetchBoardItems } from "./_lib/miro.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const list = await fetchBoardItems();
    if (list === null) {
      return res.status(503).json({
        error: "Board not configured",
        message: "Set MIRO_ACCESS_TOKEN and MIRO_BOARD_ID in Vercel environment variables.",
      });
    }
    return res.json(list);
  } catch (e) {
    const status = e.status || 502;
    return res.status(status).json({
      error: "Failed to fetch board items",
      message: e.message,
    });
  }
}
