import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {PIXLE_ICONS} from '../database/emoji-database';
import {IPopUp} from '../interface/popup-message.interface';
import {PixPopupMessageComponent} from '../pix-popup-message/pix-popup-message.component';
import {MATCH_PIXLE_NOT_FOUND} from '../database/status-numbers';
import {Router} from '@angular/router';
import {HelperFunctionsService} from '../services/helper-functions.service';
import {IPixle} from '../interface/pixle.interface';
import {PIXLEARTS} from '../database/pix-arts-database';
import {PixGridComponent} from '../pix-grid/pix-grid.component';
import {GameManager} from './game.manager';
import {STYLESHEETS_PATH} from '../app.component';
import {WINDOW} from '../window-injection.token';
import {PixGridElementComponent} from '../pix-grid-element/pix-grid-element.component';
import {PixGridUiComponent} from '../pix-grid-ui/pix-grid-ui.component';

// Popup messages
const MISSING_PIXLE_MSG: IPopUp = {
  headline: 'Missing pixle data!',
  subline: 'There was a mistake retrieving a pixle from the database.',
  message_body: 'If this issue occurs more than it should, report this bug to the team.'
};

// Timer
const UNDO_FLIP_TIME: number = 2000;

@Component({
  selector: 'app-pix-game',
  templateUrl: './pix-game.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-game.component.min.css']
})
export class PixGameComponent implements OnInit, AfterViewInit {
  @ViewChild('match_status') private match_status_msg!: PixPopupMessageComponent;
  @ViewChild(PixGridComponent) private pixGridComponent!: PixGridComponent;
  @ViewChild(PixGridUiComponent) private pixGridUiComponent!: PixGridUiComponent;
  pixle_arts: IPixle[] = PIXLEARTS; // <-- pulled database

  pixle_id: number = -1;
  pixle_image: number[][] = [];
  pixle_image_width: number = 0;
  pixle_image_height: number = 0;
  pixle_emoji_list: number[] = [];

  validating: boolean = false;

  constructor(private router: Router, private location: Location, @Inject(WINDOW) private readonly window: Window) {
  }

  ngOnInit(): void {
    this.searchRandomPixleArt();
  }

  ngAfterViewInit(): void {
    if (this.pixle_image.length <= 0) {
      this.receiveMatchStatus(MATCH_PIXLE_NOT_FOUND);
      return;
    }
    this.startGame();
  }

  /**
   * Receive reload request
   */
  public async receiveReloadRequest() {
    if (this.validating) return;
    let absolute_path: string = this.location.path();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    // Reload component --> redirect to same url but do not reuse old one
    await this.router.navigateByUrl(absolute_path, {skipLocationChange: true}).then(() => {
      this.router.navigate([absolute_path]);
      GameManager.resetGame();
    });
  }

  /**
   * Receive the current status of the ongoing match and evaluate the status number
   *
   * @param status
   */
  public receiveMatchStatus(status: number): void {
    switch (status) {
      case MATCH_PIXLE_NOT_FOUND:
        this.match_status_msg.openPopUp(MISSING_PIXLE_MSG);
        break;
      default:
        break;
    }
  }

  /**
   * Receive validation request from the ui
   */
  public receiveValidationRequest(): void {
    if (this.validating) return;
    this.validatePixle();
  }

  /**
   * Get the emoji by its id --> search it in the emoji collection
   * Return an array of codepoints
   *
   * @param emoji_ids
   */
  public static getEmojisFromListById(emoji_ids: number[] = []): number[] {
    let temp_emoji_codepoints: number[] = [];
    for (let i: number = 0; i < emoji_ids.length; i++) {
      let emoji_codepoint: number = PIXLE_ICONS[emoji_ids[i]];
      temp_emoji_codepoints.push(emoji_codepoint);
    }
    return temp_emoji_codepoints;
  }

  /**
   * Start the game
   * Show the pixle at the beginning for a set duration
   * Hide it, if the timer is over
   *
   * @private
   */
  private startGame(): void {
    this.window.setTimeout(() => {
      this.pixGridComponent.setFlipStatus();
      GameManager.initGame();
    }, UNDO_FLIP_TIME);
  }

  /**
   * Search for any pixle art from the database (get a random one)
   * Emit an event, which sends the chosen pixle object out to be received by other components
   *
   * @private
   */
  private searchRandomPixleArt(): boolean {
    if (this.pixle_arts.length <= 0) return false;
    let rand: number = HelperFunctionsService.generateRandomInteger(this.pixle_arts.length - 1);
    let selected_pixle_art: IPixle = this.pixle_arts[rand];
    if (selected_pixle_art == undefined || null) return false;
    let pixle_art_tiles: number[][] = selected_pixle_art.tiles;
    // Go through the pixle image --> contains only emoji ids --> convert them to codepoints
    let temp_pixle_image: number[][] = [];
    for (let i: number = 0; i < pixle_art_tiles.length; i++) {
      let emojis_in_tile: number[] = PixGameComponent.getEmojisFromListById(pixle_art_tiles[i]);
      temp_pixle_image.push(emojis_in_tile);
    }
    this.pixle_image = temp_pixle_image;
    this.pixle_id = selected_pixle_art.id;
    // Make sure a pixle tile array was assigned
    if (this.pixle_image.length <= 0) return false;
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
    if (this.pixle_image.length <= 0) return false;
    let pixle_convert: number[] = HelperFunctionsService.twoDimensionalArrayToOneDimensional(this.pixle_image);
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
    this.pixle_emoji_list = temp_emoji_list;
    return true;
  }

  /**
   * Validate the pixle
   * Easy version: go through every tile and check its validity separately
   *
   * @private
   */
  private validatePixle(): void {
    if (!GameManager.game_started || GameManager.pixle_solved || this.validating) return;
    this.validating = true;

    let temp_pix_grid_comps: PixGridElementComponent[] = this.pixGridComponent.pixle_emoji_input.toArray();
    let total_count: number = 0, failed_count: number = 0;
    // Check every pixle tile if its valid --> emoji at the exact same position as in the original pixle
    for (let i: number = 0; i < this.pixle_image_height; i++) {
      for (let j: number = 0; j < this.pixle_image_width; j++) {
        let current_column: number = (this.pixle_image_width * i) + j;
        if (temp_pix_grid_comps[current_column].pixle_emoji_codepoint !== this.pixle_image[i][j]) {
          temp_pix_grid_comps[current_column].updateTileStatus(false);
          if (temp_pix_grid_comps[current_column].pixle_tile_lives <= 0) {
            failed_count++;
          }
          continue;
        }
        temp_pix_grid_comps[current_column].updateTileStatus(true);
        total_count++;
      }
    }
    // If any tile has reached its limits --> went out of lives --> game over
    if (failed_count > 0) {
      GameManager.resetGame();
    } else {
      // Player has won the game
      let tile_amount: number = this.pixle_image_width * this.pixle_image_height;
      if (total_count >= tile_amount) {
        GameManager.pixle_solved = true;
        GameManager.game_started = false;
      } else {
        // Player didn't win yet --> reset flip-state of some tiles
        this.window.setTimeout(() => {
          this.pixGridComponent.setFlipStatus();
          this.window.setTimeout(() => {
            this.validating = false;
          }, 1000);
        }, UNDO_FLIP_TIME);
        return;
      }
    }
    this.validating = false;
  }
}
