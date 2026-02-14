/**
 * Productivity-themed post-its for the Moving Post-its task (To Do / Doing / Done).
 * Separate context from the voting board.
 */

export const INITIAL_COLUMNS = {
  todo: [
    { id: "csmodel-mp", title: "Do CSMODEL machine problems" },
    { id: "review-pr", title: "Review PR for backend API" },
  ],
  doing: [
    { id: "englcom-meeting", title: "Attend meeting with ENGLICOM stakeholders" },
    { id: "sprint-retro", title: "Finish sprint retrospective notes" },
    { id: "project-timeline", title: "Update project timeline" },
  ],
  done: [],
};
