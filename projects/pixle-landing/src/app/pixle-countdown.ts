export interface PixleCountdown {
  hours: string;
  minutes: string;
  seconds: string;
  /** Share of the current day that has passed, 0-100 */
  progress: number;
}

const pad = (value: number): string => value.toString().padStart(2, '0');

/**
 * Time until the next pixle. A new pixle starts at local midnight,
 * because the game seeds its puzzle with the local calendar date.
 */
export function getPixleCountdown(now: Date = new Date()): PixleCountdown {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const remaining = Math.max(0, Math.floor((nextDay.getTime() - now.getTime()) / 1000));

  return {
    hours: pad(Math.floor(remaining / 3600)),
    minutes: pad(Math.floor((remaining % 3600) / 60)),
    seconds: pad(remaining % 60),
    // Measured against the real length of the day (23 or 25 hours when the clock changes)
    progress:
      ((now.getTime() - startOfDay.getTime()) / (nextDay.getTime() - startOfDay.getTime())) * 100,
  };
}
