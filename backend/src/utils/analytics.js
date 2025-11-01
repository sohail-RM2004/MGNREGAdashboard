export function computeSummaryForRecord(record) {
  if (!record) return null;
  
  const summary = {
    employmentIndex: calculateEmploymentIndex(record),
    wageIndex: calculateWageIndex(record),
    workCompletionRate: calculateWorkCompletionRate(record),
    verdict: "Good" // Default verdict
  };
  
  // Calculate overall verdict based on indices
  const avgIndex = (summary.employmentIndex + summary.wageIndex + summary.workCompletionRate) / 3;
  if (avgIndex >= 80) summary.verdict = "Excellent";
  else if (avgIndex >= 60) summary.verdict = "Good";
  else if (avgIndex >= 40) summary.verdict = "Average";
  else summary.verdict = "Needs Improvement";
  
  return summary;
}

function calculateEmploymentIndex(record) {
  const avgDays = record.avgDaysOfEmploymentPerHH || 0;
  return Math.min((avgDays / 100) * 100, 100); // Normalize to 100
}

function calculateWageIndex(record) {
  const avgWage = record.avgWageRatePerDayPerPerson || 0;
  return Math.min((avgWage / 300) * 100, 100); // Assuming 300 as benchmark
}

function calculateWorkCompletionRate(record) {
  const completed = record.completedWorks || 0;
  const total = (record.completedWorks || 0) + (record.ongoingWorks || 0);
  return total > 0 ? (completed / total) * 100 : 0;
}