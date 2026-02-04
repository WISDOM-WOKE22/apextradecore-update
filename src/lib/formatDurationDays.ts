const DAYS_PER_MONTH = 30;

/**
 * Format duration for display: under 30 days as "X days", 30+ as "X month(s) and Y day(s)".
 * e.g. 40 → "1 month and 10 days", 30 → "1 month", 15 → "15 days"
 */
export function formatDurationDays(days: number): string {
  if (days <= 0 || !Number.isFinite(days)) return "—";
  if (days < DAYS_PER_MONTH) {
    return days === 1 ? "1 day" : `${days} days`;
  }
  const months = Math.floor(days / DAYS_PER_MONTH);
  const remainder = days % DAYS_PER_MONTH;
  const monthPart = months === 1 ? "1 month" : `${months} months`;
  if (remainder === 0) return monthPart;
  const dayPart = remainder === 1 ? "1 day" : `${remainder} days`;
  return `${monthPart} and ${dayPart}`;
}
