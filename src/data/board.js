export const SECTION_TITLE = "Proposed Features";

export const BOARD_ITEMS = [
  { id: "ai-resume", title: "AI Resume Feedback", description: "Get AI-powered feedback on your resume.", voteCount: 0 },
  { id: "mentor-matching", title: "Mentor Matching", description: "Match with mentors based on your goals.", voteCount: 0 },
  { id: "salary-transparency", title: "Internship Salary Transparency", description: "See salary ranges for internships.", voteCount: 0 },
  { id: "application-tracker", title: "Application Tracker", description: "Track your applications in one place.", voteCount: 0 },
  { id: "peer-portfolio", title: "Peer Review Portfolio", description: "Build a portfolio with peer reviews.", voteCount: 0 },
];

/**
 * Initial votes on the board when user enters (simulated other participants).
 * Each key is item id, value is array of voter names (from TEAM_NAMES).
 */
export const INITIAL_VOTES = {
  "mentor-matching": ["Jana", "Mo"],
  "ai-resume": ["Sherwin"],
  "application-tracker": ["Bowei"],
  "salary-transparency": [],
  "peer-portfolio": [],
};

/** Result totals for Screen 9 (ranked). Order: 1st to 5th. */
export const RESULT_TOTALS = [
  { id: "mentor-matching", title: "Mentor Matching", votes: 4 },
  { id: "ai-resume", title: "AI Resume Feedback", votes: 3 },
  { id: "application-tracker", title: "Application Tracker", votes: 2 },
  { id: "salary-transparency", title: "Salary Transparency", votes: 1 },
  { id: "peer-portfolio", title: "Peer Review Portfolio", votes: 0 },
];
