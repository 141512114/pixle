import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {PIXLE_ICONS, REDCROSS} from '../database/emoji-database';
import {IPopUp} from '../interface/popup-message.interface';
import {PixPopupMessageComponent} from '../pix-popup-message/pix-popup-message.component';
import {MATCH_PIXLE_NOT_FOUND, MATCH_PIXLE_SOLVED, MATCH_PIXLE_UNSOLVED} from '../database/status-numbers';
import {Router} from '@angular/router';
import {HelperFunctionsService} from '../services/helper-functions.service';
import {IPixle} from '../interface/pixle.interface';
import {PIXLEARTS} from '../database/pix-arts-database';
import {PixGridComponent} from '../pix-grid/pix-grid.component';

// Popup messages
const SUCCESSMSG: IPopUp = {
  headline: 'Congratulations!',
  subline: 'You solved today\'s pixle!',
  message_body: 'But do not worry, there are many more to come! Look forward for your next pixle!'
};
const FAILEDMSG: IPopUp = {
  headline: 'Something\'s not right!',
  subline: 'You didn\'t solve today\'s pixle!',
  message_body: 'Keep it up! There is still time left to give it another shot.'
};
const MISSINGPIXLEMSG: IPopUp = {
  headline: 'Missing pixle data!',
  subline: 'There was a mistake retrieving a pixle from the database.',
  message_body: 'If this issue occurs more than it should, report this bug to the team.'
};

// Timer
const UNDO_FLIP_TIME: number = 2000;

@Component({
  selector: 'app-pix-game',
  templateUrl: './pix-game.component.html',
  styleUrls: ['../../assets/stylesheets/css/minified/pix-game.component.min.css']
})
export class PixGameComponent implements OnInit, AfterViewInit {
  @ViewChild('match_status') private match_status_msg!: PixPopupMessageComponent;
  @ViewChild(PixGridComponent) private pixGridComponent!: PixGridComponent;
  pixle_arts: IPixle[] = PIXLEARTS; // <-- pulled database

  empty_emoji_slot: number = REDCROSS;

  pixle_id: number = -1;
  pixle_image: number[][] = [];
  pixle_image_width: number = 0;
  pixle_image_height: number = 0;
  pixle_emoji_list: number[] = [];

  public static pixle_solved: boolean = false;
  public static game_started: boolean = false;

  constructor(private router: Router, private location: Location) {
  }

  ngOnInit(): void {
    this.startGame();
  }

  ngAfterViewInit(): void {
    if (this.pixle_image.length <= 0) {
      this.receiveMatchStatus(MATCH_PIXLE_NOT_FOUND);
    }
  }

  /**
   * Receive reload request
   */
  public async receiveReloadRequest() {
    let absolute_path: string = this.location.path();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    // Reload component --> redirect to same url but do not reuse old one
    await this.router.navigateByUrl(absolute_path, {skipLocationChange: true}).then(() => {
      this.router.navigate([absolute_path]);
    });
  }

  /**
   * Receive the current status of the ongoing match and evaluate the status number
   *
   * @param status
   */
  public receiveMatchStatus(status: number): void {
    switch (status) {
      case MATCH_PIXLE_SOLVED:
        this.match_status_msg.openPopUp(SUCCESSMSG);
        break;
      case MATCH_PIXLE_UNSOLVED:
        this.match_status_msg.openPopUp(FAILEDMSG);
        break;
      case MATCH_PIXLE_NOT_FOUND:
        this.match_status_msg.openPopUp(MISSINGPIXLEMSG);
        break;
      default:
        break;
    }
  }

  /**
   * Get the emoji by its id --> search it in the emoji collection
   * Return an array of codepoints
   *
   * @param emoji_ids
   */
  public static getEmojisFromListById(emoji_ids: number[] = []): number[] {
    if (emoji_ids.length <= 0) return [];
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
    if (!this.searchRandomPixleArt()) return;
    window.setTimeout(() => {
      this.pixGridComponent.setDisplayStatusOfPixle();
      PixGameComponent.game_started = true;
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
    let pixle_convert: number[] = HelperFunctionsService.twoDimensionalArrayToOneDimensional(this.pixle_image);
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
    let modulo: number = temp_emoji_list.length % this.pixle_image_height;
    if (modulo > 0 && modulo < this.pixle_image_height) {
      let short_count: number = this.pixle_image_height - modulo;
      for (let i: number = 0; i < short_count; i++) {
        temp_emoji_list.push(this.empty_emoji_slot);
      }
    }
    this.pixle_emoji_list = temp_emoji_list;
    return true;
  }
}
