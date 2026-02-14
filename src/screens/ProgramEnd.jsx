import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

export function ProgramEnd() {
  const h1Ref = useRef(null);

  useEffect(() => {
    if (h1Ref.current) h1Ref.current.focus();
  }, []);

  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";
  return (
    <div className="max-w-xl mx-auto">
      <h1
        ref={h1Ref}
        tabIndex={0}
        className={`text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 ${fc}`}
        data-speak="What you experienced. Heading level 1."
      >
        What You Experienced
      </h1>
      <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 mb-6">
        <li tabIndex={0} className={fc} data-speak="Structured hierarchy instead of spatial layout.">Structured hierarchy instead of spatial layout</li>
        <li tabIndex={0} className={fc} data-speak="Live collaboration awareness.">Live collaboration awareness</li>
        <li tabIndex={0} className={fc} data-speak="Keyboard-first interaction.">Keyboard-first interaction</li>
        <li tabIndex={0} className={fc} data-speak="Optional Blind Mode.">Optional Blind Mode</li>
      </ul>
      <p
        tabIndex={0}
        className={`text-slate-700 dark:text-slate-200 font-medium ${fc}`}
        data-speak="Collaboration should not depend on sight."
      >
        Collaboration should not depend on sight.
      </p>
    </div>
  );
}
