import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";

export function Completion() {
  const { goToStep, announce } = useApp();
  const h1Ref = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (h1Ref.current) h1Ref.current.focus();
  }, []);

  useEffect(() => {
    announce(
      "Congratulations. You successfully moved post-its without looking at your screen. In Miro you can only move post-its by position on the canvas. Not by meaning, so participation for blind users is harder. Moving by meaning—like you just did—makes collaboration more inclusive."
    );
  }, [announce]);

  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";
  return (
    <div className="max-w-xl mx-auto text-center">
      <h1
        ref={h1Ref}
        tabIndex={0}
        className={`text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 ${fc}`}
        data-speak="Congratulations. Heading level 1."
      >
        Congratulations
      </h1>
      <p
        tabIndex={0}
        className={`text-slate-700 dark:text-slate-200 mb-4 ${fc}`}
        data-speak="You have successfully moved post-its without looking at your screen."
      >
        You have successfully moved post-its without looking at your screen.
      </p>
      <p
        tabIndex={0}
        className={`text-slate-600 dark:text-slate-300 text-sm mb-2 ${fc}`}
        data-speak="In Miro, you can only move post-its by position on the canvas."
      >
        In Miro, you can only move post-its by position on the canvas.
      </p>
      <p
        tabIndex={0}
        className={`text-slate-600 dark:text-slate-300 text-sm mb-2 ${fc}`}
        data-speak="Not by meaning, so participation for blind users is harder."
      >
        Not by meaning, so participation for blind users is harder.
      </p>
      <p
        tabIndex={0}
        className={`text-slate-600 dark:text-slate-300 text-sm mb-6 ${fc}`}
        data-speak="Moving by meaning—like you just did—makes collaboration more inclusive."
      >
        Moving by meaning—like you just did—makes collaboration more inclusive.
      </p>
      <Button
        ref={buttonRef}
        type="button"
        onClick={() => goToStep(11)}
        data-speak="Finish. Button."
      >
        Finish
      </Button>
    </div>
  );
}
