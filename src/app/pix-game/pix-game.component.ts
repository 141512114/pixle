import {Component, ViewChild} from '@angular/core';
import {PIXLE_ICONS} from '../database/emoji-database';
import {IPopUp} from '../interface/popup-message.interface';
import {PixPopupMessageComponent} from '../pix-popup-message/pix-popup-message.component';

@Component({
  selector: 'app-pix-game',
  templateUrl: './pix-game.component.html',
  styleUrls: ['../../assets/stylesheets/css/minified/pix-game.component.min.css']
})
export class PixGameComponent {
  @ViewChild('match_status') private match_status_msg!: PixPopupMessageComponent;
  missing_pixle_msg: IPopUp = {
    headline: 'Missing pixle data!',
    subline: 'There was a mistake retrieving a pixle from the database.',
    message_body: 'If this issue occurs more than it should, report this bug to the team.'
  };

  /**
   * Receive the current status of the ongoing match and evaluate the status number
   *
   * @param status
   */
  public receiveMatchStatus(status: number): void {
    switch (status) {
      case 100:
        this.match_status_msg.openPopUp();
        break;
      default:
        break;
    }
  }

  /**
   * Generate a random integer between two limiter values --> min and max
   * The parameter min is by default 0
   *
   * @param max
   * @param min
   */
  public static generateRandomInteger(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Get the emoji by its id --> search it in the emoji collection
   * Return an array of codepoints
   *
   * @param emoji_ids
   */
  public static getIconsFromListById(emoji_ids: number[]): number[] {
    if (emoji_ids == undefined || null) return [];

    let temp_emoji_codepoints: number[] = [];
    for (let i: number = 0; i < emoji_ids.length; i++) {
      let emoji_codepoint: number = PIXLE_ICONS[emoji_ids[i]];
      temp_emoji_codepoints.push(emoji_codepoint);
    }

    return temp_emoji_codepoints;
  }
}
