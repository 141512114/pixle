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
 * rectangular, at most 5×5, 2 to 5 placeholders numbered without gaps, level 6 needs at least
 * 4 and level 7 exactly 5 placeholders. From level 3 on no placeholder may cover a single tile.
 * Scattered tiles are fine: the original patterns use them on purpose.
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

  // Level 2 only mirrors or rotates an original, which stays as designed. Everything else
  // must not leave an emoji on a single tile (e.g. cut off by combine)
  if (level <= 2) return true;
  const sizes = new Map<number, number>();
  p.flat().forEach((value) => sizes.set(value, (sizes.get(value) ?? 0) + 1));
  return [...sizes.values()].every((size) => size >= 2);
}

/**
 * Combine two patterns of the same size: the grid is split along a row boundary, a column
 * boundary or a checkerboard of 2×2 blocks; part one comes from a, part two from b
 */
export function combine(a: Pattern, b: Pattern, random: Random): Pattern {
  const rows = a.length;
  const cols = a[0].length;
  if (b.length !== rows || b.some((row) => row.length !== cols)) {
    throw new Error('combine: patterns must have the same size');
  }

  const offset = countPlaceholders(a);
  const mode = randomInt(random, 2);
  const boundary =
    mode === 0 ? randomInt(random, rows - 1, 1) : randomInt(random, cols - 1, 1);
  const fromA = (r: number, c: number): boolean => {
    if (mode === 0) return r < boundary;
    if (mode === 1) return c < boundary;
    return ((r >> 1) + (c >> 1)) % 2 === 0;
  };

  const combined = a.map((row, r) =>
    row.map((value, c) => (fromA(r, c) ? value : b[r][c] + offset)),
  );
  return reducePlaceholders(normalize(combined), MAX_PLACEHOLDERS);
}

/**
 * Merge the placeholder with the fewest tiles into the placeholder it touches most often,
 * until at most max placeholders are left
 */
export function reducePlaceholders(p: Pattern, max: number): Pattern {
  let result = normalize(p);
  while (countPlaceholders(result) > max) {
    const sizes = new Map<number, number>();
    result.flat().forEach((v) => sizes.set(v, (sizes.get(v) ?? 0) + 1));
    const smallest = [...sizes.entries()].sort((x, y) => x[1] - y[1] || x[0] - y[0])[0][0];

    const touches = new Map<number, number>();
    result.forEach((row, r) =>
      row.forEach((value, c) => {
        if (value !== smallest) return;
        for (const [nr, nc] of neighbours(result, r, c)) {
          const other = result[nr][nc];
          if (other !== smallest) touches.set(other, (touches.get(other) ?? 0) + 1);
        }
      }),
    );
    const target =
      [...touches.entries()].sort((x, y) => y[1] - x[1] || x[0] - y[0])[0]?.[0] ??
      [...sizes.keys()].find((v) => v !== smallest)!;

    result = normalize(result.map((row) => row.map((v) => (v === smallest ? target : v))));
  }
  return result;
}

/**
 * Connected regions (4-neighbourhood) of one placeholder
 */
function regionsOf(p: Pattern, placeholder: number): [number, number][][] {
  const seen = p.map((row) => row.map(() => false));
  const regions: [number, number][][] = [];
  p.forEach((row, r) =>
    row.forEach((value, c) => {
      if (value !== placeholder || seen[r][c]) return;
      const region: [number, number][] = [];
      const stack: [number, number][] = [[r, c]];
      seen[r][c] = true;
      while (stack.length > 0) {
        const [cr, cc] = stack.pop()!;
        region.push([cr, cc]);
        for (const [nr, nc] of neighbours(p, cr, cc)) {
          if (!seen[nr][nc] && p[nr][nc] === placeholder) {
            seen[nr][nc] = true;
            stack.push([nr, nc]);
          }
        }
      }
      regions.push(region);
    }),
  );
  return regions;
}

/**
 * Give one connected region (at least 2 tiles) a different placeholder: a new one
 * (if fewer than 5 exist) or another existing one
 */
export function recolour(p: Pattern, random: Random): Pattern {
  const source = normalize(p);
  const count = countPlaceholders(source);
  // Only connected areas of at least 2 tiles are recoloured, so no new scattered tiles appear
  const regions = Array.from({ length: count }, (_, i) => i).flatMap((placeholder) =>
    regionsOf(source, placeholder)
      .filter((region) => region.length >= 2)
      .map((region) => ({ placeholder, region })),
  );
  if (regions.length === 0) return source;
  const { placeholder, region } = regions[randomInt(random, regions.length - 1)];

  const others = Array.from({ length: count }, (_, i) => i).filter((v) => v !== placeholder);
  // A region holding every tile of its placeholder would look the same with a new placeholder
  const coversPlaceholder = region.length === source.flat().filter((v) => v === placeholder).length;
  const useNew =
    count < MAX_PLACEHOLDERS &&
    (others.length === 0 || (!coversPlaceholder && random() < 0.5));
  const target = useNew ? count : others[randomInt(random, others.length - 1)];

  const result = source.map((row) => [...row]);
  for (const [r, c] of region) result[r][c] = target;
  return normalize(result);
}
