import * as tiles from './pix-tiles-database';
import {IPixle} from '../interface/pixle.interface';

/**
 * Store all images / tiles from the tiles-database into one array
 * Assign to each image / tile a (unique) id
 */
export const PIXLEARTS: IPixle[] = [
  {id: 1, tiles: tiles.PIXLE_REDSQUARE},
  {id: 2, tiles: tiles.PIXLE_BLUESQUARE},
  {id: 3, tiles: tiles.PIXLE_ORANGESQUARE},
  {id: 4, tiles: tiles.PIXLE_YELLOWSQUARE},
  {id: 5, tiles: tiles.PIXLE_GREENSQUARE},
  {id: 6, tiles: tiles.PIXLE_PURPLESQUARE},
];
