import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";

export function MovingPostitsBriefing() {
  const { advance, announce } = useApp();
  const h1Ref = useRef(null);

  useEffect(() => {
    if (h1Ref.current) h1Ref.current.focus();
  }, []);

  useEffect(() => {
    announce(
      "Moving Post-its. You'll see three columns: To Do, Doing, and Done. Press V to grab a post-it, move with Tab, then V again to drop. Continue when ready."
    );
  }, [announce]);

  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";
  return (
    <div className="max-w-xl mx-auto">
      <h1
        ref={h1Ref}
        tabIndex={0}
        className={`text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 ${fc}`}
        data-speak="Moving Post-its. Heading level 1."
      >
        Moving Post-its
      </h1>

      <p
        tabIndex={0}
        className={`text-slate-700 dark:text-slate-200 mb-4 ${fc}`}
        data-speak="Imagine three columns in your to-do list, filled with post-its: To Do, Doing, and Done."
      >
        Imagine three columns in your to-do list, filled with post-its: <strong>To Do</strong>, <strong>Doing</strong>, and <strong>Done</strong>.
      </p>

      <p
        tabIndex={0}
        className={`text-slate-700 dark:text-slate-200 mb-4 ${fc}`}
        data-speak="You move post-its between columns. Press V to grab the post-it under focus. Move to the column you want using Tab. Press V again to drop it there."
      >
        You'll move post-its between columns. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-sm">V</kbd> to <strong>grab</strong> the post-it under focus. Move to the column you want using Tab. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-sm">V</kbd> again to <strong>drop</strong> it there.
      </p>

      <p
        tabIndex={0}
        className={`text-slate-600 dark:text-slate-300 text-sm mb-6 ${fc}`}
        data-speak="You navigate by moving focus through the list: first To Do items, then Doing, then Done. Press P anytime to proceed to the next step."
      >
        You navigate by moving focus through the list—first To Do, then Doing, then Done. Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-sm">P</kbd> anytime to proceed to the next step.
      </p>

      <Button type="button" onClick={advance} data-speak="Continue to Moving Post-its. Button.">
        Continue
      </Button>
    </div>
  );
}
