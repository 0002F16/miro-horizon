import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";

export function Completion() {
  const { goToStep, announce } = useApp();
  const buttonRef = useRef(null);

  useEffect(() => {
    announce("You have used all available votes.");
  }, [announce]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (buttonRef.current) buttonRef.current.focus();
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";
  return (
    <div className="max-w-xl mx-auto text-center">
      <p
        tabIndex={0}
        className={`text-slate-700 dark:text-slate-200 mb-6 ${fc}`}
        data-speak="You have used all available votes."
      >
        You have used all available votes.
      </p>
      <Button
        ref={buttonRef}
        type="button"
        onClick={() => goToStep(9)}
        data-speak="View Results. Button."
      >
        View Results
      </Button>
    </div>
  );
}
