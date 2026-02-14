import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";

export function BlindModeIntro() {
  const { advance, blindMode, setBlindMode, announce } = useApp();
  const h1Ref = useRef(null);

  useEffect(() => {
    if (h1Ref.current) h1Ref.current.focus();
  }, []);

  const handleToggle = () => {
    const next = !blindMode;
    setBlindMode(next);
    if (next) announce("Blind Mode enabled.");
  };

  const handleNext = () => {
    setBlindMode(true);
    advance();
  };

  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";
  return (
    <div className="max-w-xl mx-auto">
      <h1
        ref={h1Ref}
        tabIndex={0}
        className={`text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 ${fc}`}
        data-speak="Vision off mode. Heading level 1."
      >
        Vision Off Mode
      </h1>
      <p
        tabIndex={0}
        className={`text-slate-600 dark:text-slate-300 mb-4 ${fc}`}
        data-speak="You can complete every task without visuals."
      >
        You can complete every task without visuals.
      </p>
      <Button
        type="button"
        variant="secondary"
        onClick={handleToggle}
        className="mb-6"
        data-speak={blindMode ? "Button. Toggle Blind Mode off." : "Button. Toggle Blind Mode. Screen will darken. Focus ring remains visible."}
      >
        Toggle Blind Mode
      </Button>
      <p
        tabIndex={0}
        className={`text-slate-500 dark:text-slate-400 text-sm mb-6 ${fc}`}
        data-speak="When you continue, Vision Off mode will turn on and the screen will go black for the rest of the experience. Focus ring remains visible, all controls remain functional."
      >
        When you continue, Vision Off mode will turn on and the screen will go black for the rest of the experience. Focus ring remains visible, all controls remain functional.
      </p>
      <Button type="button" onClick={handleNext} data-speak="Button. Next. Vision Off mode will turn on for the rest of the experience.">
        Next
      </Button>
    </div>
  );
}
