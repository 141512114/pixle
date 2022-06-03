/*

This file contains all patterns.
To create a new one, simply copy an existing pattern and change it a little.
After you are done, add those loose patterns to the master list.
It is as easy as that.

*/

export const CRISSCROSSPATTERN: number[][] = [
  [1, 1, 4, 1, 1],
  [0, 2, 0, 2, 0],
  [1, 1, 3, 1, 1],
  [0, 2, 0, 2, 0],
  [1, 1, 4, 1, 1]
];

export const MCPATTERN: number[][] = [
  [0, 0, 0, 2, 2],
  [0, 0, 2, 2, 2],
  [1, 2, 2, 2, 0],
  [0, 1, 2, 0, 0],
  [1, 0, 1, 0, 0]
];

export const FERENGIPATTERN: number[][] = [
  [2, 2, 0, 2, 2],
  [0, 0, 2, 0, 0],
  [0, 3, 0, 3, 0],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0]
];

export const STAIRCASEPATTERN: number[][] = [
  [1, 1, 0, 2, 3],
  [0, 1, 1, 0, 2],
  [2, 0, 1, 1, 0],
  [2, 2, 0, 1, 1],
  [3, 2, 2, 0, 1]
];

export const TRIANGLEPATTERN: number[][] = [
  [0, 2, 3, 2, 3],
  [0, 0, 2, 3, 2],
  [0, 1, 0, 2, 3],
  [0, 1, 1, 0, 2],
  [0, 0, 0, 0, 0]
];

export const TETRISPATTERN: number[][] = [
  [0, 0, 0, 0, 3],
  [0, 0, 4, 4, 3],
  [0, 0, 4, 4, 3],
  [0, 1, 2, 2, 3],
  [1, 1, 1, 2, 2]
];

export const BIGCROSSPATTERN: number[][] = [
  [1, 2, 0, 2, 1],
  [3, 1, 3, 1, 3],
  [4, 4, 1, 4, 4],
  [3, 1, 3, 1, 3],
  [1, 2, 0, 2, 1]
];

export const MOSAICPATTERN: number[][] = [
  [1, 0, 3, 0, 2],
  [0, 1, 1, 2, 0],
  [3, 1, 2, 1, 3],
  [0, 2, 1, 1, 0],
  [2, 0, 3, 0, 1]
];

export const MOSAIC2PATTERN: number[][] = [
  [4, 0, 4, 0, 4],
  [0, 0, 3, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 2, 3, 0, 0],
  [4, 0, 4, 0, 4]
];

export const RUBIKSPATTERN: number[][] = [
  [4, 4, 2, 1, 1],
  [4, 1, 2, 2, 2],
  [3, 1, 1, 3, 4],
  [2, 1, 0, 4, 0],
  [4, 3, 2, 3, 0]
];

export const RUBIKS2PATTERN: number[][] = [
  [4, 0, 0, 2, 3],
  [1, 2, 3, 2, 0],
  [1, 2, 2, 3, 1],
  [1, 3, 4, 1, 3],
  [2, 2, 4, 2, 3]
];

export const RUBIKS3PATTERN: number[][] = [
  [4, 0, 0, 2],
  [1, 2, 3, 2],
  [1, 2, 2, 3],
  [1, 3, 4, 1],
  [2, 2, 4, 2]
];

export const MOSAIC3PATTERN: number[][] = [
  [1, 0, 3, 0],
  [0, 1, 1, 2],
  [3, 1, 2, 1],
  [0, 2, 1, 1],
  [2, 0, 3, 0]
];

export const RUBIKS4PATTERN: number[][] = [
  [4, 0, 0, 2, 3],
  [1, 2, 3, 2, 0],
  [1, 2, 0, 3, 1],
  [1, 3, 4, 1, 3],
];

export const MOSAIC4PATTERN: number[][] = [
  [1, 0, 3, 0, 2],
  [0, 4, 2, 2, 0],
  [3, 1, 2, 1, 3],
  [0, 2, 3, 1, 0],
];

export const THREESTRIPESH: number[][] = [
  [1, 1, 1],
  [0, 0, 0],
  [1, 1, 1],
  [0, 0, 0],
  [1, 1, 1]
];

export const THREESTRIPESH2: number[][] = [
  [1, 1, 1],
  [0, 0, 0],
  [2, 2, 2],
  [0, 0, 0],
  [1, 1, 1]
];

export const HPATTERN: number[][] = [
  [0, 1, 0],
  [0, 0, 0],
  [0, 1, 0]
];

export const SMALLCIRCLEPATTERN: number[][] = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1]
];

export const TWIRLPATTERN: number[][] = [
  [0, 2, 0],
  [2, 1, 2],
  [0, 2, 0]
];

export const CROSSPATTERN: number[][] = [
  [1, 0, 1],
  [2, 1, 2],
  [1, 0, 1]
];

export const TOWERPATTERN: number[][] = [
  [1, 2, 1],
  [1, 0, 1],
  [1, 0, 1],
  [1, 2, 1],
  [1, 2, 1]
];

export const TTOWERPATTERN: number[][] = [
  [1, 1, 1],
  [3, 1, 3],
  [2, 1, 2],
  [1, 1, 1],
  [0, 0, 0]
];

export const CASCADINGPATTERN: number[][] = [
  [4, 4, 4],
  [3, 3, 3],
  [2, 2, 2],
  [1, 1, 1],
  [0, 0, 0]
];

export const CONFUSEDPATTERN: number[][] = [
  [0, 0, 4],
  [3, 1, 2],
  [3, 1, 3],
  [2, 1, 3],
  [4, 0, 0]
];

export const RINGPATTERN: number[][] = [
  [1, 1, 1, 1],
  [1, 0, 2, 1],
  [1, 2, 0, 1],
  [1, 1, 1, 1]
];

export const CAROUSELPATTERN: number[][] = [
  [0, 1, 0, 0],
  [0, 1, 2, 2],
  [2, 2, 1, 0],
  [0, 0, 1, 0]
];

export const HOUSEPATTERN: number[][] = [
  [0, 0, 0, 0],
  [0, 1, 0, 0],
  [1, 3, 1, 0],
  [1, 2, 1, 4]
];

export const CHECKERDPATTERN: number[][] = [
  [0, 1, 0, 1],
  [2, 0, 2, 0],
  [0, 1, 0, 1],
  [2, 0, 2, 0]
];

export const LIGHTINGPATTERN: number[][] = [
  [2, 1, 0, 1],
  [1, 1, 1, 0],
  [0, 1, 2, 0],
  [2, 0, 1, 0]
];
