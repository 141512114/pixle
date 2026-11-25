import { IPixle } from '@interface/pixle.interface';
import { PIXLE_ICONS } from '@typescript/emoji.database';
import { MASTER_PATTERNS } from './pixle-pattern-list';
import {
  combine,
  countPlaceholders,
  isValidMutation,
  mirror,
  normalize,
  Pattern,
  Random,
  randomInt,
  recolour,
  rotate,
} from './pattern-mutations';
import { DIFFICULTY_SETTINGS, DifficultyLevel, levelForDate } from './difficulty';

/** Attempts per difficulty level before falling back to the next easier one */
const ATTEMPTS_PER_LEVEL = 20;

/**
 * Random seed generator
 *
 * @param seed
 */
function seededRandom(seed: number): () => number {
  return function () {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

/**
 * Generate a seed out of the current date
 */
function getSeedFromDate(): number {
  const today = new Date();
  return (
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  );
}

let seed = getSeedFromDate();
let random = seededRandom(seed);

/**
 * Generate a random integer between two limiter values --> min and max
 * The parameter min is by default 0
 *
 * @param max
 * @param min
 * @return Random integer
 */
function generateRandomInteger(max: number, min: number = 0): number {
  return randomInt(random, max, min);
}

/**
 * Generate a new pattern. Use a template as a starting point and fill in the missing pieces
 *
 * @param pattern
 * @param new_icons
 * @return Generated pattern
 */
function generateNewPattern(
  pattern: number[][],
  new_icons: number[],
): number[][] {
  let new_pattern: number[][] = [];
  for (let i = 0; i < pattern.length; i++) {
    let new_pattern_row: number[] = [];
    for (let j = 0; j < pattern[i].length; j++) {
      new_pattern_row.push(new_icons[pattern[i][j]]);
    }
    new_pattern.push(new_pattern_row);
  }
  return new_pattern;
}

const sameSize = (a: Pattern, b: Pattern): boolean =>
  a.length === b.length && a[0].length === b[0].length;

/**
 * Mirror the pattern or rotate it by 90, 180 or 270 degrees
 */
function mirrorOrRotate(p: Pattern, random: Random): Pattern {
  switch (randomInt(random, 4)) {
    case 0:
      return mirror(p, 'horizontal');
    case 1:
      return mirror(p, 'vertical');
    default:
      return rotate(p, randomInt(random, 3, 1) as 1 | 2 | 3);
  }
}

/**
 * One attempt to build a pattern of the given level, or null if no second pattern of the
 * same size exists for combining
 */
function buildCandidate(
  level: DifficultyLevel,
  candidates: Pattern[],
  random: Random,
): Pattern | null {
  const settings = DIFFICULTY_SETTINGS[level];
  const base = candidates[randomInt(random, candidates.length - 1)];
  let p = settings.mirrorOrRotate ? mirrorOrRotate(base, random) : base;

  if (settings.combine) {
    let q = candidates[randomInt(random, candidates.length - 1)];
    if (!sameSize(p, q)) q = rotate(q, 1);
    if (!sameSize(p, q)) {
      const matching = candidates.filter((c) => c !== base && sameSize(p, c));
      if (matching.length === 0) return null;
      q = matching[randomInt(random, matching.length - 1)];
    }
    p = combine(p, q, random);
  }

  for (let i = 0; i < settings.recolourings; i++) p = recolour(p, random);
  return normalize(p);
}

/**
 * Mutate a pattern according to the difficulty level. Invalid results are retried, then the
 * next easier level is used; level 1 returns an original pattern unchanged.
 *
 * @param level
 * @param random
 * @param patterns
 */
export function mutatePattern(
  level: DifficultyLevel,
  random: Random,
  patterns: Pattern[] = MASTER_PATTERNS,
): { tiles: Pattern; level: DifficultyLevel } {
  for (let current = level; current >= 2; current--) {
    const minSize = DIFFICULTY_SETTINGS[current as DifficultyLevel].minBaseSize;
    const candidates = patterns.filter(
      (p) => p.length >= minSize && p[0].length >= minSize,
    );
    if (candidates.length === 0) continue;

    for (let attempt = 0; attempt < ATTEMPTS_PER_LEVEL; attempt++) {
      const tiles = buildCandidate(current as DifficultyLevel, candidates, random);
      if (tiles && isValidMutation(tiles, current)) {
        return { tiles, level: current as DifficultyLevel };
      }
    }
  }
  return { tiles: patterns[randomInt(random, patterns.length - 1)], level: 1 };
}

/**
 * Choose random icons / emojis, which will be inserted into the randomly chosen pattern
 *
 * @param pattern
 * @return Array of icons / emojis
 */
function chooseRandomIcons(pattern: number[][]): number[] {
  const maxIconCount: number = countPlaceholders(pattern);
  let chosen_icons: number[] = [];
  for (let i = 0; i < maxIconCount; i++) {
    let current_chosen_icon: number = generateRandomInteger(
      PIXLE_ICONS.length - 1,
    );
    while (chosen_icons.includes(current_chosen_icon)) {
      current_chosen_icon = generateRandomInteger(PIXLE_ICONS.length - 1);
    }
    chosen_icons.push(current_chosen_icon);
  }
  return chosen_icons;
}

/**
 * Generate a new pixle
 *
 * @param pixle_date
 * @param pixle_id
 */
function generateNewPixle(
  pixle_date: any,
  pixle_id: number,
  level: DifficultyLevel,
): IPixle {
  const mutation = mutatePattern(level, random);
  const chosenIcons: number[] = chooseRandomIcons(mutation.tiles);

  return {
    id: pixle_id,
    date: pixle_date,
    tiles: generateNewPattern(mutation.tiles, chosenIcons),
    difficulty: mutation.level,
  };
}

/**
 * Initialize the pixle generator
 */
export default function initPixleGenerator(): IPixle {
  seed = getSeedFromDate();
  random = seededRandom(seed);

  // Get the id of the pixle by counting the days since the initial date.
  // Uses the local calendar date, exactly like the seed, so the id and the
  // puzzle always change together at local midnight.
  const today = new Date();
  const todayAsUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const pixleId = Math.round(
    (todayAsUTC - Date.UTC(2024, 9, 18)) / (1000 * 3600 * 24),
  );

  return generateNewPixle(
    new Date(todayAsUTC).toJSON(),
    pixleId,
    levelForDate(today),
  );
}
