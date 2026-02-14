import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";

export function VotingComplete() {
  const { advance, announce } = useApp();
  const h1Ref = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (h1Ref.current) h1Ref.current.focus();
  }, []);

  useEffect(() => {
    announce("Congratulations. You completed the voting task. You now know how to navigate the screen reader. Continue to the next activity.");
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
        className={`text-slate-700 dark:text-slate-200 mb-6 ${fc}`}
        data-speak="You completed the voting task. Well done. You now know how to navigate the screen reader. Continue when ready."
      >
        You completed the voting task. Well done. You now know how to navigate the screen reader.
      </p>
      <p
        tabIndex={0}
        className={`text-slate-600 dark:text-slate-300 text-sm mb-6 ${fc}`}
        data-speak="Continue to the next activity. Button below."
      >
        Continue when you're ready.
      </p>
      <Button
        ref={buttonRef}
        type="button"
        onClick={advance}
        data-speak="Button. Continue."
      >
        Continue
      </Button>
    </div>
  );
}
