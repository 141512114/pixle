/**
 * Base for every pixle
 */
export interface IPixle {
  id: number;
  date: any;
  tiles: number[][];
  /** Difficulty level that was generated (1 = Monday … 7 = Sunday) */
  difficulty: number;
}
