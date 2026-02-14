export const COMPANY_NAME = "BetterInternship.com";
export const TEAM_NAMES = ["Sherwin", "Jana", "Mo", "Bowei", "Paul"];

export function getRandomTeamMember() {
  return TEAM_NAMES[Math.floor(Math.random() * TEAM_NAMES.length)];
}
