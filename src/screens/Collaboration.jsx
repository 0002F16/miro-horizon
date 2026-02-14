import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";

export function Collaboration() {
  const { advance, verbosity, setVerbosity, announceQueued } = useApp();
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
    const msg1 = "Sherwin joined the board.";
    setEvents((e) => [...e, msg1]);
    if (verbosityRef.current === "high") announceQueued(msg1);
    const t2 = setTimeout(() => {
      const msg = "Jana joined the board.";
      setEvents((e) => [...e, msg]);
      if (verbosityRef.current === "high") announceQueued(msg);
    }, 3000);
    const t3 = setTimeout(() => {
      const msg = "Sherwin added red post it note to feature board: employer testimonials.";
      setEvents((e) => [...e, msg]);
      if (verbosityRef.current === "high") announceQueued(msg);
    }, 5000);
    const t4 = setTimeout(() => {
      const msg = "Mo removed post it note from feature board: employer testimonials.";
      setEvents((e) => [...e, msg]);
      if (verbosityRef.current === "high") announceQueued(msg);
    }, 7000);
    return () => {
      scheduledRef.current = false;
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [announceQueued]);

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
      <div className="mb-6 min-h-[120px] rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Events</p>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 text-sm space-y-1">
          {events.map((ev, i) => (
            <li key={i} tabIndex={0} className={fc} data-speak={ev}>{ev}</li>
          ))}
        </ul>
      </div>
      <Button type="button" onClick={advance} data-speak="Next. Button.">
        Next
      </Button>
    </div>
  );
}
