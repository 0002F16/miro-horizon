import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";
import { RESULT_TOTALS } from "../data/board";

export function Results() {
  const { advance } = useApp();
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
        data-speak="Results. Ranked list. Heading level 1."
      >
        Results
      </h1>
      <ol className="list-decimal list-inside space-y-2 mb-6 text-slate-700 dark:text-slate-200">
        {RESULT_TOTALS.map((row, i) => (
          <li
            key={row.id}
            tabIndex={0}
            className={fc}
            data-speak={`${i + 1}. ${row.title}. ${row.votes} vote${row.votes !== 1 ? "s" : ""}.`}
          >
            {row.title} – {row.votes} vote{row.votes !== 1 ? "s" : ""}
          </li>
        ))}
      </ol>
      <p
        tabIndex={0}
        className={`text-slate-600 dark:text-slate-300 mb-6 ${fc}`}
        data-speak="You completed dot voting using structured navigation."
      >
        You completed dot voting using structured navigation.
      </p>
      <Button
        type="button"
        onClick={advance}
        data-speak="Continue to next task. Button."
      >
        Continue to Next Task
      </Button>
    </div>
  );
}
