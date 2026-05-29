type ProjectHealthInput = {
  completion: number;
  openTasks: number;
  openRfis: number;
  overdueRfis: number;
  dailyLogsThisWeek: number;
};

export function calculateProjectHealth({
  completion,
  openTasks,
  openRfis,
  overdueRfis,
  dailyLogsThisWeek,
}: ProjectHealthInput) {
  let score = 100;

  score -= openTasks * 3;
  score -= openRfis * 5;
  score -= overdueRfis * 10;

  if (dailyLogsThisWeek === 0) {
    score -= 10;
  }

  if (completion < 25 && openTasks > 10) {
    score -= 10;
  }

  const finalScore = Math.max(0, Math.min(100, score));

  let label = "Excellent";

  if (finalScore < 85) label = "Good";
  if (finalScore < 70) label = "Warning";
  if (finalScore < 50) label = "At Risk";
  if (finalScore < 30) label = "Critical";

  return {
    score: finalScore,
    label,
  };
}