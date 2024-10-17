import initPixleGenerator from './pixle-generator/pixle-generator';
import { HelperFunctionsService } from '@abstract/services/helper-functions.service';

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

  public static generatePixle(): void {
    const pixle = initPixleGenerator();

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
   * Reset important variables
   * They need to be explicitly reset because of their static nature
   */
  public static resetGame(): void {
    GameManager.chosen_emoji = '';
    GameManager.pixle_solved = false;
    GameManager.game_started = false;
  }
}
