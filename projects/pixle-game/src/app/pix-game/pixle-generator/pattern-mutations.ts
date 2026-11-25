/**
 * Pure operations on pixle patterns (grids of placeholders 0..n-1) used to mutate
 * the fixed patterns into new ones. None of them changes its input.
 */
export type Pattern = number[][];

/** Random number generator returning values in [0, 1) */
export type Random = () => number;

const MAX_SIZE = 5;
const MAX_PLACEHOLDERS = 5;

/**
 * Random integer between min and max (both inclusive)
 */
export function randomInt(random: Random, max: number, min: number = 0): number {
  return Math.floor(random() * (max - min + 1) + min);
}

export function mirror(p: Pattern, axis: 'horizontal' | 'vertical'): Pattern {
  return axis === 'horizontal'
    ? p.map((row) => [...row].reverse())
    : [...p].reverse().map((row) => [...row]);
}

/**
 * Rotate clockwise by the given number of quarter turns
 */
export function rotate(p: Pattern, quarterTurns: 1 | 2 | 3): Pattern {
  let result = p.map((row) => [...row]);
  for (let turn = 0; turn < quarterTurns; turn++) {
    const rows = result.length;
    result = result[0].map((_, col) =>
      Array.from({ length: rows }, (_, row) => result[rows - 1 - row][col]),
    );
  }
  return result;
}

/**
 * Renumber placeholders in order of their first appearance (row by row) to 0..n-1
 */
export function normalize(p: Pattern): Pattern {
  const mapping = new Map<number, number>();
  return p.map((row) =>
    row.map((value) => {
      if (!mapping.has(value)) mapping.set(value, mapping.size);
      return mapping.get(value)!;
    }),
  );
}

export function countPlaceholders(p: Pattern): number {
  return new Set(p.flat()).size;
}

/**
 * Neighbours (up, down, left, right) of a tile that lie inside the grid
 */
export function neighbours(p: Pattern, row: number, col: number): [number, number][] {
  return (
    [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ] as [number, number][]
  ).filter(([r, c]) => r >= 0 && r < p.length && c >= 0 && c < p[r].length);
}

/**
 * Check the rules every mutated pattern has to follow (see the design document):
 * rectangular, at most 5×5, 2 to 5 placeholders numbered without gaps, every tile touches
 * another tile with the same placeholder, level 6 needs at least 4 and level 7 exactly 5 placeholders
 */
export function isValidMutation(p: Pattern, level: number): boolean {
  if (p.length === 0 || p.length > MAX_SIZE) return false;
  const width = p[0].length;
  if (width === 0 || width > MAX_SIZE || p.some((row) => row.length !== width)) {
    return false;
  }

  const count = countPlaceholders(p);
  if (count < 2 || count > MAX_PLACEHOLDERS) return false;
  if (p.flat().some((value) => !Number.isInteger(value) || value < 0 || value >= count)) {
    return false;
  }
  if (level >= 7 && count !== 5) return false;
  if (level === 6 && count < 4) return false;

  return p.every((row, r) =>
    row.every((value, c) => neighbours(p, r, c).some(([nr, nc]) => p[nr][nc] === value)),
  );
}
