function toDateOnly(value: string): Date {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid date: ${value}`);
  return date;
}

export function calculateLeaveDays(fromDate: string, toDate: string, excludeFridays = true): number {
  const start = toDateOnly(fromDate);
  const end = toDateOnly(toDate);
  if (end < start) return 0;

  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    const isFriday = cursor.getDay() === 5;
    if (!(excludeFridays && isFriday)) count += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}
