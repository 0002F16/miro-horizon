import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";

export function Intro() {
  const { advance, announce } = useApp();
  const h1Ref = useRef(null);

  useEffect(() => {
    if (h1Ref.current) {
      h1Ref.current.focus();
    }
    announce("Welcome to Horizon. Press Tab to navigate. Press Enter to begin.");
  }, [announce]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [advance]);

  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";
  return (
    <div className="max-w-xl mx-auto text-center">
      <h1
        ref={h1Ref}
        tabIndex={0}
        className={`text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 ${fc}`}
        data-speak="Welcome to Horizon. Press Tab to navigate. Press Enter to begin."
      >
        Welcome to Horizon
      </h1>
      <p
        tabIndex={0}
        className={`text-lg text-slate-600 dark:text-slate-300 mb-2 ${fc}`}
        data-speak="A semantic collaboration board."
      >
        A semantic collaboration board.
      </p>
      <div className="text-slate-600 dark:text-slate-400 space-y-2 mb-8 text-left">
        <p
          tabIndex={0}
          className={fc}
          data-speak="This is not a visual whiteboard."
        >
          This is not a visual whiteboard.
        </p>
        <p
          tabIndex={0}
          className={fc}
          data-speak="This is a structured collaboration system."
        >
          This is a structured collaboration system.
        </p>
        <p
          tabIndex={0}
          className={fc}
          data-speak="Everything works with keyboard or touch."
        >
          Everything works with keyboard or touch.
        </p>
      </div>
      <Button
        type="button"
        onClick={advance}
        data-speak="Press Enter to begin. Button."
      >
        Press Enter to Begin
      </Button>
      <p
        tabIndex={0}
        className={`mt-6 text-sm text-slate-500 ${fc}`}
        data-speak="Use Tab to move between elements."
      >
        Use Tab to move between elements.
      </p>
    </div>
  );
}
