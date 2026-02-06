/**
 * Utilities to convert between HTML date inputs (YYYY-MM-DD), JS Date, and backend Time bigint values
 */

/**
 * Convert backend Time (nanoseconds) to YYYY-MM-DD string for HTML date input
 */
export function formatDateForInput(time: bigint): string {
  const milliseconds = Number(time / BigInt(1_000_000));
  const date = new Date(milliseconds);
  return date.toISOString().split('T')[0];
}

/**
 * Convert HTML date input (YYYY-MM-DD) to backend Time (nanoseconds)
 */
export function parseInputDate(dateString: string): bigint {
  const date = new Date(dateString + 'T00:00:00.000Z');
  return BigInt(date.getTime()) * BigInt(1_000_000);
}

/**
 * Convert backend Time (nanoseconds) to JS Date
 */
export function timeToDate(time: bigint): Date {
  const milliseconds = Number(time / BigInt(1_000_000));
  return new Date(milliseconds);
}

/**
 * Convert JS Date to backend Time (nanoseconds)
 */
export function dateToTime(date: Date): bigint {
  return BigInt(date.getTime()) * BigInt(1_000_000);
}
