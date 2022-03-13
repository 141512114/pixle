import {Component, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {PIXLE_ICONS} from '../database/emoji-database';
import {IPopUp} from '../interface/popup-message.interface';
import {PixPopupMessageComponent} from '../pix-popup-message/pix-popup-message.component';
import {MATCH_PIXLE_NOT_FOUND, MATCH_PIXLE_SOLVED, MATCH_PIXLE_UNSOLVED} from '../database/status-numbers';
import {Router} from '@angular/router';

const MISSINGPIXLEMSG: IPopUp = {
  headline: 'Missing pixle data!',
  subline: 'There was a mistake retrieving a pixle from the database.',
  message_body: 'If this issue occurs more than it should, report this bug to the team.'
};

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

@Component({
  selector: 'app-pix-game',
  templateUrl: './pix-game.component.html',
  styleUrls: ['../../assets/stylesheets/css/minified/pix-game.component.min.css']
})
export class PixGameComponent {
  @ViewChild('match_status') private match_status_msg!: PixPopupMessageComponent;

  constructor(private router: Router, private location: Location) {
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
}
