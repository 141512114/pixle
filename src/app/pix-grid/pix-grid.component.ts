import {AfterViewInit, Component, EventEmitter, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {IPixle} from '../interface/pixle.interface';
import {PIXLEARTS} from '../database/pix-arts-database';
import {REDCROSS, WHITE_QUESTIONMARK} from '../database/emoji-database';
import {PixGridElementComponent} from '../pix-grid-element/pix-grid-element.component';
import {PixGameComponent} from '../pix-game/pix-game.component';

@Component({
  selector: 'app-pix-grid',
  templateUrl: './pix-grid.component.html',
  styleUrls: ['../../assets/stylesheets/css/minified/pix-grid.component.min.css']
})
export class PixGridComponent implements OnInit, AfterViewInit {
  @ViewChildren(PixGridElementComponent) private pixGridElementComponents!: QueryList<PixGridElementComponent>;
  pixle_arts: IPixle[] = PIXLEARTS; // <-- pulled database

  @Output() sendMatchStatus: EventEmitter<number> = new EventEmitter<number>();

  empty_emoji_slot: number = REDCROSS;
  hidden_pixle_tile: number = WHITE_QUESTIONMARK;

  pixle_id: number = -1;
  pixle_image?: number[][];
  pixle_image_width: number = 0;
  pixle_image_height: number = 0;
  pixle_emoji_list: number[] = [];
  pixle_solved: boolean = false;

  game_started: boolean = false;
  chosen_emoji: number = -1;

  ngOnInit(): void {
    if (!this.searchRandomPixleArt()) {
      this.sendMatchStatus.emit(500);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hidePixle();
    }, 2000);
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
   * After clicking on a button, validate the pixle created by the player
   */
  public validatePixleOnClick(): void {
    this.pixle_solved = this.validatePixle();
    if (!this.pixle_solved) return;
    this.sendMatchStatus.emit(100);
  }

  /**
   * Search for any pixle art from the database (get a random one)
   * Emit an event, which sends the chosen pixle object out to be received by other components
   *
   * @private
   */
  private searchRandomPixleArt(): boolean {
    if (this.pixle_arts == undefined || null) return false;
    let rand: number = PixGameComponent.generateRandomInteger(this.pixle_arts.length - 1);

    let selected_pixle_art: IPixle = this.pixle_arts[rand];
    if (selected_pixle_art == undefined || null) return false;
    let pixle_art_tiles: number[][] = selected_pixle_art.tiles;

    // Go through the pixle image --> contains only emoji ids --> convert them to codepoints
    let temp_pixle_image: number[][] = [];
    for (let i: number = 0; i < pixle_art_tiles.length; i++) {
      temp_pixle_image.push(PixGameComponent.getIconsFromListById(pixle_art_tiles[i]));
    }
    this.pixle_image = temp_pixle_image;
    this.pixle_id = selected_pixle_art.id;

    // Make sure a pixle tile array was assigned
    if (this.pixle_image == undefined || null) return false;
    this.pixle_image_height = this.pixle_image.length;
    this.pixle_image_width = this.pixle_image[0].length;

    return this.getEmojiList();
  }

  /**
   * Get the list of emojis used in the pixle
   *
   * @private
   */
  private getEmojiList(): boolean {
    // Make sure a pixle tile array was assigned
    if (this.pixle_image == undefined || null) return false;

    let pixle_convert: number[] = this.convertPixleIntoNormalArray();
    if (pixle_convert.length <= 0) return false;

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
    return true;
  }

  /**
   * Hide the pixle --> swap emojis on all tiles
   *
   * @private
   */
  private hidePixle(): void {
    let temp_pix_grid_comps: PixGridElementComponent[] = this.pixGridElementComponents.toArray();
    if (temp_pix_grid_comps == undefined || null) return;
    for (let i: number = 0; i < temp_pix_grid_comps.length; i++) {
      if (temp_pix_grid_comps[i].grid_element_type === 1) continue;
      temp_pix_grid_comps[i].changeElementIcon(this.hidden_pixle_tile);
    }
    this.game_started = true;
  }

  /**
   * Validate the pixle
   * Easy version: go through every tile and check its validity separately
   *
   * @private
   */
  private validatePixle(): boolean {
    if (!this.game_started) return false;
    let temp_pix_grid_comps: PixGridElementComponent[] = this.pixGridElementComponents.toArray();
    if (temp_pix_grid_comps == undefined || null) return false;

    let total_count: number = 0;
    let pixle_convert: number[] = this.convertPixleIntoNormalArray();
    if (pixle_convert.length <= 0) return false;
    // Check every pixle tile if its valid --> emoji at the exact same position as in the original pixle
    for (let i: number = 0; i < pixle_convert.length; i++) {
      if (temp_pix_grid_comps[i].pixle_tile_solved) {
        total_count++;
        continue;
      }
      if (temp_pix_grid_comps[i].pixle_emoji_codepoint !== pixle_convert[i]) {
        temp_pix_grid_comps[i].updateTileStatus(false);
        continue;
      }
      temp_pix_grid_comps[i].updateTileStatus(true);
      total_count++;
    }

    return total_count >= pixle_convert.length;
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
    for (let i: number = 0; i < this.pixle_image_height; i++) {
      for (let j: number = 0; j < this.pixle_image_width; j++) {
        pixle_convert.push(this.pixle_image[i][j]);
      }
    }

    return pixle_convert;
  }
}
