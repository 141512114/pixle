/**
 * Base for every pixle
 */
export interface IPixle {
  id: number;
  /** Day of the pixle (ISO date string) */
  date: string;
  tiles: number[][];
  /** Difficulty level that was generated (1 = Monday … 7 = Sunday) */
  difficulty: number;
}
