import {PIXLE_ICONS} from '../../src/app/database/emoji-database';
import {IPixle} from '../../src/app/interface/pixle.interface';
import * as fs from 'fs';

const HPATTERN: number[][] = [
  [0, 1, 0],
  [0, 0, 0],
  [0, 1, 0]
];

let pixle_master_list: IPixle[] = [];

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

/**
 * Choose random icons / emojis, which will be inserted into the randomly chosen pattern
 *
 * @return Array of icons / emojis
 */
function chooseRandomIcons(): number[] {
  let max_icon_count: number = getMaximumIconCount(HPATTERN);
  let chosen_icons: number[] = [];
  for (let i = 0; i < max_icon_count; i++) {
    let current_chosen_icon: number = generateRandomInteger(PIXLE_ICONS.length - 1);
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
 * @param pixle_id
 */
function generateNewPixle(pixle_id: number = 0): void {
  let chosen_icons: number[] = chooseRandomIcons();
  let new_pixle: IPixle = {id: pixle_id, tiles: generateNewPattern(HPATTERN, chosen_icons)};
  pixle_master_list.push(new_pixle);
}

/**
 * Create the file which stores all pixles
 */
function createPixleDatabaseFile(): void {
  const path_name: string = './local/pixle-generator/database/';
  const file_name: string = 'pixle-arts.database.json';
  const json_content: string = JSON.stringify(pixle_master_list);
  fs.writeFile(path_name + file_name, json_content, 'utf8', function (err) {
    if (err) return console.log(err);
    console.log("The file was saved!");
  });
}

/**
 * Initialize the pixle generator
 */
function initPixleGenerator(): void {
  for (let i = 0; i < 10; i++) {
    generateNewPixle(i);
  }
  createPixleDatabaseFile();
}

initPixleGenerator();
