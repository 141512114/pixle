import { IPixle } from '@interface/pixle.interface';
import { PIXLE_ICONS } from '@typescript/emoji.database';
import { MASTER_PATTERNS } from './pixle-pattern-list';

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
  return Math.floor(random() * (max - min + 1) + min);
}

/**
 * Get the maximum icon count which is possible inside a given pattern
 *
 * @param pattern
 * @return Maximum icon count possible
 */
function getMaximumIconCount(pattern: number[][]): number {
  if (pattern === undefined) return 0;
  let total_count: number[] = [];
  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[i].length; j++) {
      if (total_count.length <= 0 || !total_count.includes(pattern[i][j])) {
        total_count.push(pattern[i][j]);
      }
    }
  }
  return total_count.length;
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

/**
 * Choose a random pattern from the master list
 *
 * @return Chosen pattern
 */
function chooseRandomPattern(): number[][] {
  const rand: number = generateRandomInteger(MASTER_PATTERNS.length - 1);
  return MASTER_PATTERNS[rand];
}

/**
 * Choose random icons / emojis, which will be inserted into the randomly chosen pattern
 *
 * @param pattern
 * @return Array of icons / emojis
 */
function chooseRandomIcons(pattern: number[][]): number[] {
  const maxIconCount: number = getMaximumIconCount(pattern);
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
function generateNewPixle(pixle_date: any, pixle_id: number = 0): IPixle {
  const pattern: number[][] = chooseRandomPattern();
  const chosenIcons: number[] = chooseRandomIcons(pattern);

  return {
    id: pixle_id,
    date: pixle_date,
    tiles: generateNewPattern(pattern, chosenIcons),
  };
}

/**
 * Initialize the pixle generator
 */
export default function initPixleGenerator(): IPixle {
  seed = getSeedFromDate();
  random = seededRandom(seed);

  // Get the id of the pixle by counting the days since the initial date
  const timeDiff =
    new Date().getTime() - new Date('2024-10-18T00:00:00Z').getTime();
  const pixleId = Math.floor(timeDiff / (1000 * 3600 * 24));

  const pixleDate: Date = new Date();
  pixleDate.setUTCHours(0, 0, 0, 0);
  pixleDate.setUTCDate(pixleDate.getUTCDate());

  return generateNewPixle(pixleDate.toJSON(), pixleId);
}
