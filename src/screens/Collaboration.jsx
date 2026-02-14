import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";
import { TEAM_NAMES } from "../data/scenario";

export function Collaboration() {
  const { advance, verbosity, setVerbosity, announce } = useApp();
  const h1Ref = useRef(null);
  const [events, setEvents] = useState([]);
  const scheduledRef = useRef(false);
  const verbosityRef = useRef(verbosity);
  verbosityRef.current = verbosity;

  useEffect(() => {
    if (h1Ref.current) h1Ref.current.focus();
  }, []);

  useEffect(() => {
    if (scheduledRef.current) return;
    scheduledRef.current = true;
    const name = TEAM_NAMES[0]; // Jana
    // Play "Jana joined the board" as soon as you get to section 3
    const msgJoined = `${name} joined the board.`;
    setEvents((e) => [...e, msgJoined]);
    if (verbosityRef.current === "high") announce(msgJoined);
    const t2 = setTimeout(() => {
      const msg = "New item added in Example Section.";
      setEvents((e) => [...e, msg]);
      if (verbosityRef.current === "high") announce(msg);
    }, 3000);
    const t3 = setTimeout(() => {
      const msg = "2 votes added to Improve onboarding.";
      setEvents((e) => [...e, msg]);
      if (verbosityRef.current === "high") announce(msg);
    }, 5000);
    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [announce]);

  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";
  return (
    <div className="max-w-xl mx-auto">
      <h1
        ref={h1Ref}
        tabIndex={0}
        className={`text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 ${fc}`}
        data-speak="Collaboration awareness. Heading level 1."
      >
        Collaboration Awareness
      </h1>
      <p
        tabIndex={0}
        className={`text-slate-600 dark:text-slate-300 mb-4 ${fc}`}
        data-speak="Simulated events appear below. Verbosity setting controls how much you hear."
      >
        Simulated events appear below. Verbosity setting controls how much you hear.
      </p>
      <div className="mb-6">
        <p tabIndex={0} className={`text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 ${fc}`} data-speak="Verbosity.">Verbosity</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="verbosity"
              checked={verbosity === "low"}
              onChange={() => setVerbosity("low")}
              className="rounded-full"
              data-speak="Verbosity low. Radio button."
            />
            <span>Low</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="verbosity"
              checked={verbosity === "high"}
              onChange={() => setVerbosity("high")}
              className="rounded-full"
              data-speak="Verbosity high. Radio button."
            />
            <span>High</span>
          </label>
        </div>
      </div>
      {events.length > 0 && (
        <ul className="mb-6 list-disc list-inside text-slate-600 dark:text-slate-400 text-sm">
          {events.map((ev, i) => (
            <li key={i} tabIndex={0} className={fc} data-speak={ev}>{ev}</li>
          ))}
        </ul>
      )}
      <Button type="button" onClick={advance} data-speak="Next. Button.">
        Next
      </Button>
    </div>
  );
}
