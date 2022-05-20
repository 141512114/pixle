/*

This file contains all patterns.
To create a new one, simply copy an existing pattern and change it a little.
After you are done, add those loose patterns to the master list.
It is as easy as that.

*/

export const HPATTERN: number[][] = [
  [0, 1, 0],
  [0, 0, 0],
  [0, 1, 0]
];

export const CROSSPATTERN: number[][] = [
  [1, 0, 1],
  [2, 1, 2],
  [1, 0, 1]
];

export const TOWERPATTERN: number[][] = [
  [1, 0, 4],
  [3, 1, 2],
  [3, 1, 3],
  [2, 1, 3],
  [4, 0, 1]
];

export const RINGPATTERN: number[][] = [
  [1, 1, 1, 1],
  [1, 0, 2, 1],
  [1, 2, 0, 1],
  [1, 1, 1, 1]
];
