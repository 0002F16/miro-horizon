import { useEffect, useRef } from "react";
import { Button } from "./ui";

const SHORTCUTS_BASE = [
  { keys: "Tab", desc: "Move forward" },
  { keys: "Shift + Tab", desc: "Move backward" },
  { keys: "Arrow keys", desc: "Move within lists" },
  { keys: "R", desc: "Hear summary" },
  { keys: "Enter", desc: "Activate / open item" },
  { keys: "Escape", desc: "Close this dialog" },
];

const SHORTCUTS_VOTING = [
  { keys: "V", desc: "Add vote (on board)" },
  { keys: "Shift + V", desc: "Remove vote (on board)" },
];

const SHORTCUTS_MOVING = [
  { keys: "V", desc: "Grab post-it" },
  { keys: "Shift + V", desc: "Drop post-it" },
  { keys: "P", desc: "Proceed / continue" },
];

function getShortcuts(currentStep) {
  const isMovingStep = currentStep === 9;
  const vShortcuts = isMovingStep ? SHORTCUTS_MOVING : SHORTCUTS_VOTING;
  return [...SHORTCUTS_BASE.slice(0, 4), ...vShortcuts, ...SHORTCUTS_BASE.slice(4)];
}

export function KeyboardHelpDialog({ open, onClose, currentStep = 0 }) {
  const shortcuts = getShortcuts(currentStep);
  const dialogRef = useRef(null);
  const previousActiveRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    previousActiveRef.current = document.activeElement;
    const firstFocusable = dialogRef.current?.querySelector('button, [href], [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        if (previousActiveRef.current?.focus) previousActiveRef.current.focus();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll('button, [href], input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])');
      const list = Array.from(focusables);
      if (list.length === 0) return;
      const i = list.indexOf(document.activeElement);
      if (e.shiftKey) {
        if (i <= 0) {
          e.preventDefault();
          list[list.length - 1].focus();
        }
      } else {
        if (i === list.length - 1 || i < 0) {
          e.preventDefault();
          list[0].focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-help-title"
      ref={dialogRef}
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
        <h2
          id="keyboard-help-title"
          tabIndex={0}
          className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
          data-speak="Keyboard Help. Heading level 2."
        >
          Keyboard Help
        </h2>
        <ul className="space-y-2 text-slate-600 dark:text-slate-300">
          {shortcuts.map(({ keys, desc }) => (
            <li
              key={keys}
              tabIndex={0}
              className="flex justify-between gap-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded py-1"
              data-speak={`${keys}. ${desc}.`}
            >
              <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm font-mono">{keys}</kbd>
              <span>{desc}</span>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="primary"
          className="mt-6 w-full"
          onClick={() => {
            onClose();
            if (previousActiveRef.current?.focus) previousActiveRef.current.focus();
          }}
          data-speak="Close keyboard help. Button."
        >
          Close
        </Button>
      </div>
    </div>
  );
}
