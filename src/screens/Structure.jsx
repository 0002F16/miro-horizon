import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";
import { speak } from "../utils/speech";

const DEMO_ITEMS = [
  { id: "demo1", label: "Item 1", description: "Improve onboarding." },
  { id: "demo2", label: "Item 2", description: "Add analytics." },
];

export function Structure() {
  const { advance } = useApp();
  const h1Ref = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (h1Ref.current) h1Ref.current.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" && focusedIndex < DEMO_ITEMS.length - 1) {
        e.preventDefault();
        setFocusedIndex((i) => i + 1);
      } else if (e.key === "ArrowUp" && focusedIndex > 0) {
        e.preventDefault();
        setFocusedIndex((i) => i - 1);
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        speak(`Section: Example Section. ${DEMO_ITEMS.length} items.`, { interrupt: true });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex]);

  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";
  return (
    <div className="max-w-xl mx-auto">
      <h1
        ref={h1Ref}
        tabIndex={0}
        className={`text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 ${fc}`}
        data-speak="How this board is organized. Heading level 1."
      >
        How This Board Is Organized
      </h1>
      <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 mb-6 space-y-1">
        <li tabIndex={0} className={fc} data-speak="Boards contain Sections.">Boards contain Sections.</li>
        <li tabIndex={0} className={fc} data-speak="Sections contain Items.">Sections contain Items.</li>
        <li tabIndex={0} className={fc} data-speak="Items contain content and votes.">Items contain content and votes.</li>
        <li tabIndex={0} className={fc} data-speak="Relationships are defined by structure, not position.">Relationships are defined by structure, not position.</li>
      </ul>
      <div
        role="region"
        aria-label="Example Section"
        className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6 bg-white dark:bg-slate-800"
      >
        <h2 tabIndex={0} className={`font-semibold text-slate-800 dark:text-slate-100 mb-3 ${fc}`} data-speak="Example Section. Heading level 2.">Example Section</h2>
        <ul role="list" className="space-y-2">
          {DEMO_ITEMS.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                tabIndex={focusedIndex === i ? 0 : -1}
                onClick={() => setFocusedIndex(i)}
                className={`w-full text-left px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none ${
                  focusedIndex === i ? "ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : ""
                }`}
                data-speak={`Item ${i + 1} of ${DEMO_ITEMS.length}: ${item.description}`}
              >
                {item.label}: {item.description}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Button type="button" onClick={advance} data-speak="Next. Button.">
        Next
      </Button>
    </div>
  );
}
