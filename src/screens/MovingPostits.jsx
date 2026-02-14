import { useEffect, useRef, useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { speak } from "../utils/speech";
import { Button } from "../components/ui";
import { INITIAL_COLUMNS } from "../data/movingPostits";

const COLUMN_IDS = ["todo", "doing", "done"];
const COLUMN_LABELS = { todo: "To Do", doing: "Doing", done: "Done" };

function buildFocusEntries(columns) {
  const entries = [];
  for (const colId of COLUMN_IDS) {
    const items = columns[colId] || [];
    if (items.length > 0) {
      items.forEach((item) => entries.push({ type: "item", columnId: colId, item }));
    } else {
      entries.push({ type: "dropZone", columnId: colId });
    }
  }
  return entries;
}

export function MovingPostits() {
  const { advance, announce } = useApp();
  const [columns, setColumns] = useState(() => ({
    todo: [...INITIAL_COLUMNS.todo],
    doing: [...INITIAL_COLUMNS.doing],
    done: [...INITIAL_COLUMNS.done],
  }));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [carriedItemId, setCarriedItemId] = useState(null);
  const [carriedFromColumn, setCarriedFromColumn] = useState(null);
  const itemRefs = useRef([]);
  const h1Ref = useRef(null);
  const successAdvancedRef = useRef(false);

  const focusEntries = useMemo(() => buildFocusEntries(columns), [columns]);
  const doingEmpty = (columns.doing || []).length === 0;

  useEffect(() => {
    if (h1Ref.current) h1Ref.current.focus();
  }, []);

  useEffect(() => {
    announce(
      "Moving Post-its. To Do, Doing, Done. Move all items from Doing to Done. V to grab or drop. P to proceed."
    );
  }, [announce]);

  useEffect(() => {
    if (doingEmpty && !successAdvancedRef.current) {
      successAdvancedRef.current = true;
      announce("All items moved to Done.");
      advance();
    }
  }, [doingEmpty, announce, advance]);

  useEffect(() => {
    const entries = focusEntries;
    const handleKeyDown = (e) => {
      if ((e.key === "v" || e.key === "V") && !e.shiftKey) {
        e.preventDefault();
        const entry = entries[focusedIndex];
        if (carriedItemId) {
          const targetColumn = entry?.columnId ?? "done";
          setColumns((prev) => {
            const next = {
              todo: [...(prev.todo || [])],
              doing: [...(prev.doing || [])],
              done: [...(prev.done || [])],
            };
            const item = [...(prev.todo || []), ...(prev.doing || []), ...(prev.done || [])].find(
              (i) => i.id === carriedItemId
            );
            if (!item) return prev;
            next[carriedFromColumn] = next[carriedFromColumn].filter((i) => i.id !== carriedItemId);
            next[targetColumn] = [...next[targetColumn], item];
            return next;
          });
          setCarriedItemId(null);
          setCarriedFromColumn(null);
          const label = COLUMN_LABELS[targetColumn];
          announce(`Dropped into ${label}.`);
        } else if (entry?.type === "item") {
          setCarriedItemId(entry.item.id);
          setCarriedFromColumn(entry.columnId);
          announce(`Grabbed ${entry.item.title}.`);
        }
      } else if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        advance();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        const entry = entries[focusedIndex];
        if (!entry) return;
        const colLabel = COLUMN_LABELS[entry.columnId];
        if (entry.type === "dropZone") {
          speak(`${colLabel}. Empty. Drop zone.`, { interrupt: true });
        } else {
          const itemsInCol = columns[entry.columnId] || [];
          const idx = itemsInCol.findIndex((i) => i.id === entry.item.id);
          const pos = idx + 1;
          const total = itemsInCol.length;
          speak(`${colLabel}, item ${pos} of ${total}: ${entry.item.title}.`, { interrupt: true });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [columns, focusEntries, focusedIndex, carriedItemId, carriedFromColumn, announce, advance]);

  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";

  return (
    <div className="max-w-4xl mx-auto w-full px-4">
      <h1
        ref={h1Ref}
        tabIndex={0}
        className={`text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 ${fc}`}
        data-speak="Moving Post-its. Heading level 1."
      >
        Moving Post-its
      </h1>
      <p
        tabIndex={0}
        className={`text-sm text-slate-500 dark:text-slate-400 mb-4 ${fc}`}
        data-speak="V to grab or drop. Move all from Doing to Done. P to proceed."
      >
        V to grab or drop. Move all from Doing to Done. P to proceed.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-4" aria-hidden="true">
        {COLUMN_IDS.map((colId) => (
          <div
            key={colId}
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-800/50 min-h-[160px]"
          >
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {COLUMN_LABELS[colId]}
            </h2>
            <ul className="space-y-2 list-none">
              {(columns[colId] || []).map((item) => (
                <li key={item.id} className="px-3 py-2 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200">
                  {item.title}
                </li>
              ))}
              {(columns[colId] || []).length === 0 && (
                <li className="text-slate-400 dark:text-slate-500 text-sm italic">Empty</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
        Tab through items and drop zones below. V grab or drop, P proceed.
      </p>
      <ul role="list" className="space-y-2 max-w-xl" aria-label="Post-its and drop zones">
        {focusEntries.map((entry, i) => {
          const isFocused = i === focusedIndex;
          const isCarried = entry.type === "item" && entry.item.id === carriedItemId;
          if (entry.type === "dropZone") {
            const label = `${COLUMN_LABELS[entry.columnId]}, empty, drop zone`;
            return (
              <li key={`drop-${entry.columnId}`}>
                <button
                  ref={(el) => { itemRefs.current[i] = el; }}
                  type="button"
                  tabIndex={0}
                  onFocus={() => setFocusedIndex(i)}
                  className={`w-full text-left px-4 py-3 rounded border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 ${fc}`}
                  aria-label={label}
                  data-speak={label}
                >
                  {COLUMN_LABELS[entry.columnId]} (empty)
                </button>
              </li>
            );
          }
          const item = entry.item;
          const colLabel = COLUMN_LABELS[entry.columnId];
          const itemsInCol = columns[entry.columnId] || [];
          const pos = itemsInCol.findIndex((x) => x.id === item.id) + 1;
          const total = itemsInCol.length;
          const ariaLabel = `${colLabel}, item ${pos} of ${total}: ${item.title}. ${carriedItemId ? "V to drop." : "V to grab."}`;
          return (
            <li key={item.id}>
              <button
                ref={(el) => { itemRefs.current[i] = el; }}
                type="button"
                tabIndex={0}
                onFocus={() => setFocusedIndex(i)}
                className={`w-full text-left px-4 py-3 rounded border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                  isCarried
                    ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-600"
                    : "border-slate-200 dark:border-slate-700 focus:bg-indigo-50 dark:focus:bg-indigo-900/20"
                }`}
                aria-label={ariaLabel}
                data-speak={ariaLabel}
              >
                <span className="font-medium text-slate-800 dark:text-slate-100">{item.title}</span>
                {isCarried && (
                  <span className="block text-xs text-amber-700 dark:text-amber-400 mt-1">
                    Carried — move focus then V to drop
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={advance}
          data-speak="Button. Continue. P to proceed."
          aria-label="Continue (P)"
        >
          Continue (P)
        </Button>
      </div>
    </div>
  );
}
