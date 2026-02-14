/**
 * Strip HTML tags so content (e.g. from API) displays as plain text, not literal "<p>".
 * @param {string} str
 * @returns {string}
 */
export function stripHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim();
}
