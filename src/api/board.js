/**
 * Horizon API client for board items (proxied to backend in dev).
 * Returns array of { id, title, description }.
 */
const API_BASE = "";

export async function fetchBoardItems() {
  const res = await fetch(`${API_BASE}/api/items`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `Request failed ${res.status}`);
  }
  return res.json();
}

export async function submitVote(itemId) {
  const res = await fetch(`${API_BASE}/api/items/${encodeURIComponent(itemId)}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `Vote failed ${res.status}`);
  }
  return res.json();
}
