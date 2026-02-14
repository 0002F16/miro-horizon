let currentUtterance = null;

/**
 * Speak text using the Web Speech API. Like a screen reader.
 * @param {string} text - Text to speak
 * @param {{ interrupt?: boolean }} options - interrupt: cancel current speech and speak new text
 */
export function speak(text, { interrupt = true } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }
  const t = String(text || "").trim();
  if (!t) return;

  if (interrupt) {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(t);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

/**
 * Cancel any in-progress speech.
 */
export function cancelSpeech() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

/**
 * Get accessible label for an element: data-speak > aria-label > aria-labelledby > role + text
 */
export function getSpeakLabel(element) {
  if (!element || typeof element.getAttribute !== "function") return "";
  const dataSpeak = element.getAttribute("data-speak");
  if (dataSpeak) return dataSpeak.trim();
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel.trim();
  const ariaLabelledby = element.getAttribute("aria-labelledby");
  if (ariaLabelledby && element.ownerDocument) {
    const id = ariaLabelledby.split(/\s+/)[0];
    const ref = element.ownerDocument.getElementById(id);
    if (ref) return (ref.textContent || "").trim();
  }
  const role = element.getAttribute("role") || (element.tagName && element.tagName.toLowerCase());
  const name = (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 200);
  if (role === "button" || role === "link" || element.tagName === "A" || element.tagName === "BUTTON") {
    return name ? `Button: ${name}` : "Button";
  }
  if (role === "heading" || /^h[1-6]$/.test(element.tagName || "")) {
    const level = element.getAttribute("aria-level") || (element.tagName && element.tagName.match(/^H([1-6])$/)?.[1]) || "1";
    return name ? `Heading level ${level}: ${name}` : `Heading level ${level}`;
  }
  return name || "";
}
