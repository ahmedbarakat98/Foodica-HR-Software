function yearsBetween(from: Date, to: Date): number {
  let years = to.getFullYear() - from.getFullYear();
  const monthDelta = to.getMonth() - from.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && to.getDate() < from.getDate())) years -= 1;
  return Math.max(0, years);
}

export function suggestedAnnualLeaveDays(hiringDate?: string, today = new Date()): number {
  if (!hiringDate) return 15;
  const start = new Date(`${hiringDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return 15;
  const years = yearsBetween(start, today);
  if (years < 1) return 15;
  if (years < 2) return 21;
  return 30;
}
