import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../components/ui";
import { COMPANY_NAME, TEAM_NAMES } from "../data/scenario";
import { fetchBoardItems } from "../api/board";

export function SprintScenario() {
  const { advance, announce } = useApp();
  const h1Ref = useRef(null);
  const [itemCount, setItemCount] = useState(5);

  useEffect(() => {
    if (h1Ref.current) h1Ref.current.focus();
  }, []);

  useEffect(() => {
    fetchBoardItems()
      .then((data) => setItemCount(Array.isArray(data) ? data.length : 5))
      .catch(() => {});
  }, []);

  useEffect(() => {
    announce(`Voting active. 2 votes available. ${itemCount} items.`);
  }, [announce, itemCount]);

  const fc = "outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded";
  return (
    <div className="max-w-xl mx-auto">
      <h1
        ref={h1Ref}
        tabIndex={0}
        className={`text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 ${fc}`}
        data-speak="Design Sprint Scenario. Heading level 1."
      >
        Design Sprint Scenario
      </h1>
      <div className="text-slate-600 dark:text-slate-300 space-y-4 mb-6">
        <p tabIndex={0} className={fc} data-speak="Listen carefully.">Listen carefully.</p>
        <p tabIndex={0} className={fc} data-speak={`You are part of the product team at ${COMPANY_NAME}.`}>You are part of the product team at {COMPANY_NAME}.</p>
        <p tabIndex={0} className={fc} data-speak={`Your team: ${TEAM_NAMES.join(", ")}.`}>Your team: {TEAM_NAMES.join(", ")}.</p>
        <p tabIndex={0} className={fc} data-speak="Your goal: vote on the top two features to prioritize.">Your goal: vote on the top two features to prioritize.</p>
        <p tabIndex={0} className={fc} data-speak="You have 2 votes.">You have 2 votes.</p>
        <p tabIndex={0} className={fc} data-speak={`Board contains 1 Section with ${itemCount} feature proposals.`}>Board contains 1 Section with {itemCount} feature proposals.</p>
      </div>
      <Button
        type="button"
        onClick={advance}
        data-speak="Button. Enter Voting Board."
      >
        Enter Voting Board
      </Button>
    </div>
  );
}
