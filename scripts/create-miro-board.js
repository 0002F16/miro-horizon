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

/** Initial votes to show as tags/dots on the Miro board (same as src/data/board.js INITIAL_VOTES). */
const INITIAL_VOTES = {
  "mentor-matching": ["Jana", "Mo"],
  "ai-resume": ["Sherwin"],
  "application-tracker": ["Bowei"],
  "salary-transparency": [],
  "peer-portfolio": [],
};

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

async function createTag(boardId, title, fillColor = "red") {
  const res = await fetch(`${MIRO_API}/boards/${boardId}/tags`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MIRO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, fillColor }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create tag failed ${res.status}: ${err}`);
  }
  return res.json();
}

async function attachTagToItem(boardId, itemId, tagId) {
  const res = await fetch(`${MIRO_API}/boards/${boardId}/items/${itemId}?tag_id=${encodeURIComponent(tagId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MIRO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Attach tag failed ${res.status}: ${err}`);
  }
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

  const stickyIdsBySlug = {};
  for (const item of BOARD_ITEMS) {
    const sticky = await createSticky(boardId, item, x, y);
    stickyIdsBySlug[item.id] = sticky.id;
    console.log("  Sticky:", item.title);
    x += spacing;
  }

  const allVoterNames = [...new Set(Object.values(INITIAL_VOTES).flat())];
  const tagColors = ["red", "blue", "green", "violet"];
  const tagIdsByName = {};
  for (let i = 0; i < allVoterNames.length; i++) {
    const name = allVoterNames[i];
    const tag = await createTag(boardId, name, tagColors[i % tagColors.length]);
    tagIdsByName[name] = tag.id;
    console.log("  Tag (dot):", name);
  }

  for (const [itemSlug, voters] of Object.entries(INITIAL_VOTES)) {
    const stickyId = stickyIdsBySlug[itemSlug];
    if (!stickyId || !voters.length) continue;
    for (const name of voters) {
      const tagId = tagIdsByName[name];
      if (tagId) {
        await attachTagToItem(boardId, stickyId, tagId);
        console.log("  Dot", name, "->", itemSlug);
      }
    }
  }

  console.log("\nDone. Add to your .env:");
  console.log("MIRO_BOARD_ID=" + boardId);
  console.log("\nBoard URL: https://miro.com/app/board/" + boardId + "/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
