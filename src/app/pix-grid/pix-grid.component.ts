import {Component, OnInit} from '@angular/core';
import {IPixle} from '../interface/pixle.interface';
import {PIXLEARTS} from '../database/pix-arts-database';
import {PIXLE_ICONS, REDCROSS} from '../database/emoji-database';

@Component({
  selector: 'app-pix-grid',
  templateUrl: './pix-grid.component.html',
  styleUrls: ['../../assets/stylesheets/css/minified/pix-grid.component.min.css']
})
export class PixGridComponent implements OnInit {
  pixle_arts: IPixle[] = PIXLEARTS; // <-- pulled database

  empty_emoji_slot: number = REDCROSS;

  pixle_id: number = 0;
  pixle_image?: number[][];
  pixle_image_width: number = 0;
  pixle_image_height: number = 0;
  pixle_emoji_list: number[] = [];

  chosen_emoji: number = -1;

  ngOnInit(): void {
    this.searchRandomPixleArt();
  }

  /**
   * Receive the icon codepoint from one of the grid elements
   *
   * @param emoji_codepoint
   */
  public receiveIconCodePoint(emoji_codepoint: number): void {
    this.chosen_emoji = emoji_codepoint;
  }

  /**
   * Search for any pixle art from the database (get a random one)
   * Emit an event, which sends the chosen pixle object out to be received by other components
   *
   * @private
   */
  private searchRandomPixleArt(): void {
    let rand: number = PixGridComponent.generateRandomInteger(this.pixle_arts.length - 1);

    let selected_pixle_art: IPixle = this.pixle_arts[rand];
    let pixle_art_tiles: number[][] = selected_pixle_art.tiles;

    // Go through the pixle image --> contains only emoji ids --> convert them to codepoints
    let temp_pixle_image: number[][] = [];
    for (let i: number = 0; i < pixle_art_tiles.length; i++) {
      temp_pixle_image.push(PixGridComponent.getIconsFromListById(pixle_art_tiles[i]));
    }
    this.pixle_image = temp_pixle_image;
    this.pixle_id = selected_pixle_art.id;

    // Make sure a pixle tile array was assigned
    if (this.pixle_image == undefined || null) return;
    this.pixle_image_height = this.pixle_image.length;
    this.pixle_image_width = this.pixle_image[0].length;

    this.getEmojiList();
  }

  /**
   * Get the list of emojis used in the pixle
   *
   * @private
   */
  private getEmojiList(): void {
    // Make sure a pixle tile array was assigned
    if (this.pixle_image == undefined || null) return;

    let pixle_convert: number[] = this.convertPixleIntoNormalArray();
    if (pixle_convert.length <= 0) return;

    let temp_emoji_list: number[] = [];
    for (let i: number = 0; i < pixle_convert.length; i++) {
      for (let j: number = pixle_convert.length - 1; j > 0; j--) {
        // Make absolutely sure that both picked entries are the exact same (or not)
        if (pixle_convert[j] === pixle_convert[i]) {
          let emoji_codepoint: number = pixle_convert[i];
          // Check if there already exists this exact emoji code point in the temporary array
          if (temp_emoji_list.includes(emoji_codepoint)) {
            break;
          } else {
            temp_emoji_list.push(emoji_codepoint);
          }
        }
      }
    }

    // Fill empty slots with placeholders, if there ever are less emojis used than the vertical amount of icons in a pixle
    if (temp_emoji_list.length < this.pixle_image_height) {
      let short_count: number = this.pixle_image_height - temp_emoji_list.length;
      for (let i: number = 0; i < short_count; i++) {
        temp_emoji_list.push(this.empty_emoji_slot);
      }
    }

    this.pixle_emoji_list = temp_emoji_list;
  }

  /**
   * Convert the pixle array (two-dimensional) into a "normal" array (one-dimensional)
   * This makes it easier to compare every entry with each other and find duplicates
   *
   * @private
   */
  private convertPixleIntoNormalArray(): number[] {
    let pixle_convert: number[] = [];

    // Make sure a pixle tile array was assigned
    if (this.pixle_image == undefined || null) return [];
    for (let i: number = 0; i < this.pixle_image.length; i++) {
      for (let j: number = 0; j < this.pixle_image[i].length; j++) {
        pixle_convert.push(this.pixle_image[i][j]);
      }
    }

    return pixle_convert;
  }

  /**
   * Generate a random integer between two limiter values --> min and max
   * The parameter min is by default 0
   *
   * @param max
   * @param min
   * @private
   */
  private static generateRandomInteger(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Get the emoji by its id --> search it in the emoji collection
   * Return an array of codepoints
   *
   * @param emoji_ids
   * @private
   */
  private static getIconsFromListById(emoji_ids: number[]): number[] {
    if (emoji_ids == undefined || null) return [];

    let temp_emoji_codepoints: number[] = [];
    for (let i: number = 0; i < emoji_ids.length; i++) {
      let emoji_codepoint: number = PIXLE_ICONS[emoji_ids[i]];
      temp_emoji_codepoints.push(emoji_codepoint);
    }

    return temp_emoji_codepoints;
  }
}
