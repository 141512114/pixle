import {PIXLE_ICONS} from '../../src/app/database/emoji-database';

const HPATTERN: number[][] = [
  [0, 1, 0],
  [0, 0, 0],
  [0, 1, 0]
];

/**
 * Generate a random integer between two limiter values --> min and max
 * The parameter min is by default 0
 *
 * @param max
 * @param min
 * @return Random integer
 */
function generateRandomInteger(max: number, min: number = 0): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
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
function generateNewPattern(pattern: number[][], new_icons: number[]): number[][] {
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

function chooseRandomIcons(): void {
  let maxIconCount: number = getMaximumIconCount(HPATTERN);
  let chosenIcons: number[] = [];
  for (let i = 0; i < maxIconCount; i++) {
    let current_chosen_icon: number = generateRandomInteger(PIXLE_ICONS.length);
    while (chosenIcons.includes(current_chosen_icon)) {
      current_chosen_icon = generateRandomInteger(PIXLE_ICONS.length);
    }
    chosenIcons.push(current_chosen_icon);
  }
  console.log(generateNewPattern(HPATTERN, chosenIcons));
}

chooseRandomIcons();
