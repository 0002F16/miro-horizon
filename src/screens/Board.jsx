import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { speak } from "../utils/speech";
import { SECTION_TITLE, INITIAL_VOTES } from "../data/board";
import { getRandomTeamMember } from "../data/scenario";
import { fetchBoardItems, submitVote as apiSubmitVote } from "../api/board";

const MAX_VOTES = 2;

function getVoters(itemId, otherVotes, userVotes) {
  const others = otherVotes[itemId] || [];
  const withYou = userVotes.has(itemId) ? [...others, "You"] : others;
  return withYou;
}

export function Board() {
  const { goToStep, userVotes, setUserVotes, announce, verbosity } = useApp();
  const [boardItems, setBoardItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [otherVotes, setOtherVotes] = useState(() => ({ ...INITIAL_VOTES }));
  const sectionRef = useRef(null);
  const itemRefs = useRef([]);
  const simulatedVoteDone = useRef(false);

  useEffect(() => {
    let cancelled = false;
    announce("Loading board…");
    fetchBoardItems()
      .then((data) => {
        if (!cancelled) {
          setBoardItems(Array.isArray(data) ? data : []);
          setLoading(false);
          announce(`Section: ${SECTION_TITLE}. ${(data?.length ?? 0)} items.`);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLoading(false);
          setError(e.message || "Could not load board.");
          setBoardItems([]);
          announce("Could not load board. Check that the server is running and the board is set up.");
        }
      });
    return () => { cancelled = true; };
  }, [announce]);

  useEffect(() => {
    if (!sectionRef.current || boardItems.length === 0) return;
    sectionRef.current.focus();
  }, [boardItems.length]);

  useEffect(() => {
    if (simulatedVoteDone.current) return;
    simulatedVoteDone.current = true;
    const t = setTimeout(() => {
      if (verbosity === "high") {
        const name = getRandomTeamMember();
        setOtherVotes((prev) => {
          const current = prev["mentor-matching"] || [];
          if (current.includes(name)) return prev;
          return { ...prev, "mentor-matching": [...current, name] };
        });
        announce(`${name} voted for Mentor Matching.`);
      }
    }, 4000);
    return () => clearTimeout(t);
  }, [verbosity, announce]);

  const remaining = MAX_VOTES - userVotes.size;
  const addVote = (id) => {
    if (userVotes.size >= MAX_VOTES) return;
    setUserVotes((prev) => new Set([...prev, id]));
    apiSubmitVote(id).catch(() => { /* best-effort sync to Miro */ });
    const r = remaining - 1;
    if (r <= 0) {
      announce("You have used all available votes.");
      goToStep(8);
    } else {
      announce(r === 1 ? "You have 1 vote remaining." : `You have ${r} votes remaining.`);
    }
  };
  const removeVote = (id) => {
    setUserVotes((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    const r = remaining + 1;
    announce(r === 1 ? "You have 1 vote remaining." : `You have ${r} votes remaining.`);
  };

  useEffect(() => {
    const items = boardItems;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" && focusedIndex < items.length - 1) {
        e.preventDefault();
        itemRefs.current[focusedIndex + 1]?.focus();
      } else if (e.key === "ArrowUp" && focusedIndex > 0) {
        e.preventDefault();
        itemRefs.current[focusedIndex - 1]?.focus();
      } else if (e.key === "v" && !e.shiftKey) {
        e.preventDefault();
        const item = items[focusedIndex];
        if (!item || userVotes.has(item.id)) return;
        if (userVotes.size >= MAX_VOTES) return;
        addVote(item.id);
      } else if (e.key === "V" && e.shiftKey) {
        e.preventDefault();
        const item = items[focusedIndex];
        if (!item || !userVotes.has(item.id)) return;
        removeVote(item.id);
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        const item = items[focusedIndex];
        if (!item) return;
        const voters = getVoters(item.id, otherVotes, userVotes);
        const voteText = voters.length === 0 ? "No votes yet." : `${voters.length} vote${voters.length !== 1 ? "s" : ""}. Voted by: ${voters.join(", ")}.`;
        const youPart = userVotes.has(item.id) ? " You voted for this item." : "";
        speak(`Item ${focusedIndex + 1} of ${items.length}: ${item.title}. ${item.description}. ${voteText}${youPart}`, { interrupt: true });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- addVote/removeVote/otherVotes intentionally omitted to avoid re-subscribing every vote change
  }, [boardItems, focusedIndex, userVotes]);

  const canVote = userVotes.size < MAX_VOTES;
  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";

  if (loading) {
    return (
      <div className="max-w-xl mx-auto w-full text-center py-8 text-slate-600 dark:text-slate-400" role="status" aria-live="polite">
        Loading board…
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-xl mx-auto w-full text-center py-8" role="alert">
        <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400">Start the backend with: npm run server</p>
      </div>
    );
  }

  const items = boardItems;
  return (
    <div className="max-w-xl mx-auto w-full">
      <section
        ref={sectionRef}
        tabIndex={0}
        aria-label={SECTION_TITLE}
        className={`${fc} mb-6`}
        data-speak={`Section: ${SECTION_TITLE}. ${items.length} items.`}
      >
        <h2 tabIndex={0} className={`text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4 ${fc}`} data-speak={`${SECTION_TITLE}. Heading level 2.`}>
          {SECTION_TITLE}
        </h2>
        <ul role="list" className="space-y-2">
          {items.map((it, i) => {
            const voters = getVoters(it.id, otherVotes, userVotes);
            const voteCount = voters.length;
            const votersText = voteCount === 0 ? "No votes" : voteCount === 1 ? `1 vote · ${voters[0]}` : `${voteCount} votes · ${voters.join(", ")}`;
            const speakVoters = voteCount === 0 ? "No votes yet." : `${voteCount} vote${voteCount !== 1 ? "s" : ""}. Voted by: ${voters.join(", ")}.`;
            const dataSpeak = `Item ${i + 1} of ${items.length}: ${it.title}. ${speakVoters} ${userVotes.has(it.id) ? "You voted. " : ""}${canVote ? "Press V to add vote." : ""}`;
            return (
              <li key={it.id}>
                <button
                  ref={(el) => { itemRefs.current[i] = el; }}
                  type="button"
                  tabIndex={0}
                  onFocus={() => setFocusedIndex(i)}
                  className="w-full text-left px-4 py-3 rounded border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-indigo-50 dark:focus:bg-indigo-900/20 outline-none flex flex-col gap-1"
                  aria-label={dataSpeak}
                  data-speak={dataSpeak}
                >
                  <span className="flex justify-between items-center">
                    <span className="font-medium">{it.title}</span>
                    {userVotes.has(it.id) && <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">You voted</span>}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {votersText}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <p
        tabIndex={0}
        className={`text-sm text-slate-500 dark:text-slate-400 mb-4 ${fc}`}
        data-speak="Tab to move between items. V to add vote. Shift+V to remove. R to read details. Enter to open item."
      >
        Tab to move between items. V to add vote. Shift+V to remove. R to read details. Enter to open item.
      </p>
    </div>
  );
}
