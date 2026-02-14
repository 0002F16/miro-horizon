import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";

export function NavOnboarding() {
  const { advance, navTabCount, setNavTabCount } = useApp();
  const h1Ref = useRef(null);

  useEffect(() => {
    if (h1Ref.current) h1Ref.current.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") setNavTabCount((c) => c + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setNavTabCount]);

  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";
  return (
    <div className="max-w-xl mx-auto">
      <h1
        ref={h1Ref}
        tabIndex={0}
        className={`text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 ${fc}`}
        data-speak="How to Navigate. Heading level 1."
      >
        How to Navigate
      </h1>
      <ul className="space-y-3 text-slate-600 dark:text-slate-300 mb-8 list-disc list-inside">
        <li tabIndex={0} className={fc} data-speak="Use Tab to move forward.">Use Tab to move forward.</li>
        <li tabIndex={0} className={fc} data-speak="Shift + Tab to move backward.">Shift + Tab to move backward.</li>
        <li tabIndex={0} className={fc} data-speak="Arrow keys move within lists.">Arrow keys move within lists.</li>
        <li tabIndex={0} className={fc} data-speak="Press R to hear a summary.">Press R to hear a summary.</li>
      </ul>
      <Button
        type="button"
        onClick={advance}
        data-speak="Next. Press Enter to continue. Button."
      >
        Next
      </Button>
    </div>
  );
}
