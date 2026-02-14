# Miro integration: feasibility & constraints

Quick reference for turning Horizon into a Miro-integrated app with add/edit post-its and hierarchy (e.g. frames like "Personas").

---

## Your ideal vs Miro’s model

| Your ideal | Miro concept | Supported? |
|------------|--------------|------------|
| Add post-its | Create sticky note (REST or Web SDK) | ✅ Yes |
| Edit post-its | PATCH sticky note content/style | ✅ Yes (you already PATCH for votes) |
| Post-it inside a bigger group (e.g. "Personas") | **Frame** as parent (recommended) or **Group** | ✅ Frames yes; Groups have limits |
| Navigate through groups | List frames → list items per frame (or by `parent`) | ✅ Yes via `parent_item_id` / `parent` |

Use **Frames** for hierarchy (e.g. “Personas”, “Ideas”). **Groups** cannot be nested and need ≥2 items; frames are the right fit for “container → stickies”.

---

## Constraints and limits

### Auth

- **REST API**: Needs `MIRO_ACCESS_TOKEN` (and optionally OAuth for multi-user). You already use a token; same model works for create/edit.
- **Web SDK**: Runs inside Miro (iframe); different auth (board context). For a standalone Horizon app, REST + your existing server is the simplest.

### Sticky notes (REST)

- **Create**: `POST /v2/boards/{board_id}/sticky_notes` — `data.content`, `position`, optional `parent.id` (frame), `style` (e.g. `fillColor`). Scope: `boards:write`.
- **Update**: `PATCH /v2/boards/{board_id}/sticky_notes/{id}` — partial update of `data.content`, style, position. You already do this for votes.
- **Content**: Plain text. Your current convention `slug\ntitle\ndescription` is fine; you can keep or simplify.

### Hierarchy (frames)

- **List frames**: `GET /v2/boards/{board_id}/items?type=frame` (cursor-paginated, limit 10–50).
- **Items in a frame**: `GET /v2/boards/{board_id}/items?parent_item_id={frame_id}&type=sticky_note` (same pagination).
- **Root-level stickies** (no frame): use `parent_item_id=0` (works in practice; see [community](https://community.miro.com/developer-platform-and-apis-57/api-get-items-within-a-frame-20595)).
- **Create sticky inside frame**: `POST .../sticky_notes` with `parent: { id: frameId }` and position `relativeTo: "parent_top_left"` (x,y relative to frame).
- **Max children per frame**: 5000 items.

### Groups (alternative to frames)

- **Cannot nest**: A grouped item cannot be grouped again.
- **Min 2 items**: Need at least two items to create a group.
- **No metadata**: Groups don’t support custom metadata.
- **Web SDK**: `miro.board.group()` / `group.ungroup()`; REST has no “create group” endpoint (grouping is a UX action, then you read item positions/relations).

So for “post-it inside a bigger group called Personas”, **frames are the right primitive**.

### Rate limits

- **REST**: Credit-based; 100,000 credits/minute per app (approximate). Create/update sticky is typically Level 1–2 (e.g. 50–100 credits). Normal add/edit usage is fine; avoid tight loops.
- **429**: Use `X-RateLimit-*` headers and retry with backoff.

### Off-limits / caveats

- **Nested groups**: Not supported.
- **Real-time**: REST is request/response; no live sync. For live updates, you’d poll or move to Web SDK in Miro.
- **Tags**: Create/attach via REST; tag association can require a board refresh to show in UI.
- **Sticky content**: Text only; no rich text in API.

---

## Can you do it in ~2 hours?

**Roughly yes**, for a **minimal but real** integration, if you scope to:

1. **Add post-it**  
   Backend: `POST /v2/boards/{board_id}/sticky_notes` (content + optional `parent.id`).  
   Frontend: form or button that calls your server → server calls Miro.

2. **Edit post-it**  
   Backend: `PATCH .../sticky_notes/{id}` with new `data.content` (you already have token and PATCH for votes).  
   Frontend: select a note (e.g. from your existing Board list), open edit form, submit → server PATCHes.

3. **See hierarchy**  
   Backend:  
   - `GET items?type=frame` → list of frames (e.g. “Personas”).  
   - For each frame (or “root” with `parent_item_id=0`): `GET items?parent_item_id={id}&type=sticky_note` → stickies in that frame.  
   Return a tree or flat list with `parentId` / `frameName` so the UI can show “inside Personas”.

4. **Navigate groups**  
   Frontend:  
   - Show frames as sections (e.g. “Personas”, “Ideas”, “Root”).  
   - Let user pick a frame (or “All” / “Root”) then show stickies in that section; reuse your existing keyboard/list UX.

**Suggested 2h split**

- **~30 min**: Backend endpoints — create sticky, update sticky, get frames, get items by `parent_item_id` (and optionally “all stickies with parent info”).
- **~45 min**: Frontend — “Add post-it” (and optionally “which frame?”), “Edit” from Board list, and a simple frame selector or section list for hierarchy.
- **~30 min**: Wire existing Board screen to new API (list per frame, show frame name), keep accessibility (focus, announce).
- **~15 min**: Test with one board that has 1–2 frames and a few stickies.

If you already have `MIRO_BOARD_ID` and `MIRO_ACCESS_TOKEN` with `boards:read` and `boards:write`, no new auth work is needed for this.

---

## Minimal API shape (for your server)

- `GET /api/frames` → `[{ id, title }]` (from Miro `type=frame`; title from frame `data.title` or similar).
- `GET /api/items?frameId=...` → stickies in that frame (or root if `frameId` empty/0). Return `{ id, title, description, frameId?, frameName? }` so UI can show hierarchy.
- `POST /api/items` → body `{ content, frameId?, position? }` → server creates sticky (and optionally under `parent: { id: frameId }`).
- `PATCH /api/items/:id` → body `{ content }` (and optionally style) → server PATCHes sticky.

Your existing `GET /api/items` can be adapted to “all stickies with frame info” or replaced by frame-scoped calls plus a small tree builder.

---

## References

- [Sticky notes (REST)](https://developers.miro.com/docs/working-with-sticky-notes-and-tags-with-the-rest-api)
- [Create sticky note](https://developers.miro.com/reference/create-sticky-note-item) — request body includes `parent` for frame.
- [Get items (board)](https://developers.miro.com/reference/get-items) — `type=frame` or `type=sticky_note`, `parent_item_id` for frame.
- [Get items within frame](https://developers.miro.com/reference/get-items-within-frame)
- [Frames](https://developers.miro.com/docs/frame-1)
- [Rate limiting](https://developers.miro.com/reference/rate-limiting)
