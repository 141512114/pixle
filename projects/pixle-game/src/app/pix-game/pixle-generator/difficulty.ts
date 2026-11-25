/**
 * Weekly difficulty curve: Monday is the easiest day (1), Sunday the hardest (7)
 */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface DifficultySettings {
  /** Mirror or rotate the base pattern */
  mirrorOrRotate: boolean;
  /** Combine the base pattern with a second one */
  combine: boolean;
  /** Number of recoloured areas */
  recolourings: number;
  /** Minimum rows and columns of the base pattern (0 = any size) */
  minBaseSize: number;
}

export const DIFFICULTY_SETTINGS: Readonly<Record<DifficultyLevel, DifficultySettings>> = {
  1: { mirrorOrRotate: false, combine: false, recolourings: 0, minBaseSize: 0 },
  2: { mirrorOrRotate: true, combine: false, recolourings: 0, minBaseSize: 0 },
  3: { mirrorOrRotate: true, combine: false, recolourings: 1, minBaseSize: 0 },
  4: { mirrorOrRotate: false, combine: true, recolourings: 0, minBaseSize: 0 },
  5: { mirrorOrRotate: false, combine: true, recolourings: 1, minBaseSize: 0 },
  6: { mirrorOrRotate: false, combine: true, recolourings: 2, minBaseSize: 4 },
  7: { mirrorOrRotate: false, combine: true, recolourings: 3, minBaseSize: 4 },
};

/**
 * Difficulty level of a date: Monday 1 … Sunday 7 (local weekday)
 */
export function levelForDate(date: Date): DifficultyLevel {
  return (((date.getDay() + 6) % 7) + 1) as DifficultyLevel;
}
