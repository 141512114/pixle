import initPixleGenerator from './pixle-generator/pixle-generator';
import { HelperFunctionsService } from '@abstract/services/helper-functions.service';
import { PixGridElementComponent } from '../pix-grid-element/pix-grid-element.component';
import {
  CODEPOINT_GREENSQUARE,
  CODEPOINT_ORANGESQUARE,
  CODEPOINT_REDSQUARE,
  CODEPOINT_YELLOWSQUARE,
} from '@typescript/emoji.database';
import { IPixle } from '@interface/pixle.interface';

/**
 * This class acts as the manager for every pixle-solving game
 */
export class GameManager {
  public static pixle_solved: boolean = false;
  public static game_started: boolean = false;
  public static game_reloaded: boolean = false;

  public static pixle_id: number = -1;
  public static pixle_image: string[][] = [];
  public static pixle_image_width: number = 0;
  public static pixle_image_height: number = 0;
  public static pixle_emoji_list: string[] = [];

  public static chosen_emoji: string = '';

  /**
   * Initialize the game
   */
  public static initGame(): void {
    GameManager.pixle_solved = false;
    GameManager.game_started = true;
  }

  /**
   * Reset important variables
   * They need to be explicitly reset because of their static nature
   */
  public static resetGame(): void {
    GameManager.chosen_emoji = '';
    GameManager.pixle_solved = false;
    GameManager.game_started = false;
  }

  public static generatePixle(): void {
    const pixle: IPixle = initPixleGenerator();

    let temp_pixle_image: string[][] = [];
    for (let i: number = 0; i < pixle.tiles.length; i++) {
      let emojis_in_tile: string[] =
        HelperFunctionsService.getEmojisFromListById(pixle.tiles[i]);
      temp_pixle_image.push(emojis_in_tile);
    }

    this.pixle_id = pixle.id;
    this.pixle_image = temp_pixle_image;
    // Make sure a pixle tile array was assigned
    if (this.pixle_image.length <= 0) return;
    this.pixle_image_height = this.pixle_image.length;
    this.pixle_image_width = this.pixle_image[0].length;

    this.pixle_emoji_list = HelperFunctionsService.getEmojiList(
      this.pixle_image,
    );
  }

  /**
   * Generate the share message
   *
   * @return {string} Generated message
   * @param grid_elements_array
   */
  public static generateShareMessage(
    grid_elements_array: PixGridElementComponent[],
  ): string {
    if (!grid_elements_array) return '';

    const pixle_title: string = 'Pixle';
    const pixle_details: string =
      GameManager.pixle_id +
      '/' +
      GameManager.pixle_image_width +
      '/' +
      GameManager.pixle_image_height;
    const share_result: string[] =
      this.generatePixleStatusMap(grid_elements_array);
    let pixle_status_map: string = '';
    for (let i = 0; i < share_result.length; i++) {
      let one_pixle_tile: string = pixle_status_map + share_result[i];
      if ((i + 1) % GameManager.pixle_image_width === 0) {
        pixle_status_map = one_pixle_tile + '\n';
      } else {
        pixle_status_map = one_pixle_tile;
      }
    }
    return pixle_title + '\n\n' + pixle_status_map + '\n\n' + pixle_details;
  }

  /**
   * Generate a status map after solving a pixle or just finishing a match
   * The status map displays the lives left on each tile of a pixle
   *
   * @return {string[]} Generated status map
   * @private
   * @param grid_elements_array
   */
  private static generatePixleStatusMap(
    grid_elements_array: PixGridElementComponent[],
  ): string[] {
    let pixle_status_map: string[] = [];
    for (let i: number = 0; i < grid_elements_array.length; i++) {
      switch (grid_elements_array[i].pixle_tile_lives) {
        case 0:
          pixle_status_map.push(String.fromCodePoint(CODEPOINT_REDSQUARE));
          break;
        case 1:
          pixle_status_map.push(String.fromCodePoint(CODEPOINT_ORANGESQUARE));
          break;
        case 2:
          pixle_status_map.push(String.fromCodePoint(CODEPOINT_YELLOWSQUARE));
          break;
        case 3:
        default:
          pixle_status_map.push(String.fromCodePoint(CODEPOINT_GREENSQUARE));
          break;
      }
    }
    return pixle_status_map;
  }
}
