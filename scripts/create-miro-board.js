/**
 * One-time script: create a Miro board and 5 sticky notes for Horizon (Proposed Features).
 * Run after Phase 1 (Miro app + token) and set MIRO_ACCESS_TOKEN in .env.
 *
 * Usage: node scripts/create-miro-board.js
 *
 * Then set MIRO_BOARD_ID in .env to the printed board ID.
 */

import "dotenv/config";

const MIRO_ACCESS_TOKEN = process.env.MIRO_ACCESS_TOKEN;
const MIRO_API = "https://api.miro.com/v2";

const BOARD_ITEMS = [
  { id: "ai-resume", title: "AI Resume Feedback", description: "Get AI-powered feedback on your resume." },
  { id: "mentor-matching", title: "Mentor Matching", description: "Match with mentors based on your goals." },
  { id: "salary-transparency", title: "Internship Salary Transparency", description: "See salary ranges for internships." },
  { id: "application-tracker", title: "Application Tracker", description: "Track your applications in one place." },
  { id: "peer-portfolio", title: "Peer Review Portfolio", description: "Build a portfolio with peer reviews." },
];

async function createBoard() {
  const res = await fetch(`${MIRO_API}/boards`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MIRO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "Horizon – Proposed Features" }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create board failed ${res.status}: ${err}`);
  }
  return res.json();
}

async function createSticky(boardId, item, x, y) {
  // Content format: slug\ntitle\ndescription (so server can map to Horizon id/title/description)
  const content = `${item.id}\n${item.title}\n${item.description}`;
  const res = await fetch(`${MIRO_API}/boards/${boardId}/sticky_notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MIRO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: { content, shape: "rectangle" },
      position: { x, y },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create sticky failed ${res.status}: ${err}`);
  }
  return res.json();
}

async function main() {
  if (!MIRO_ACCESS_TOKEN) {
    console.error("Missing MIRO_ACCESS_TOKEN. Set it in .env (copy from .env.example).");
    process.exit(1);
  }

  console.log("Creating board...");
  const board = await createBoard();
  const boardId = board.id;
  console.log("Board created:", boardId);

  const spacing = 350;
  let x = -700;
  const y = 0;

  for (const item of BOARD_ITEMS) {
    await createSticky(boardId, item, x, y);
    console.log("  Sticky:", item.title);
    x += spacing;
  }

  console.log("\nDone. Add to your .env:");
  console.log("MIRO_BOARD_ID=" + boardId);
  console.log("\nBoard URL: https://miro.com/app/board/" + boardId + "/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
