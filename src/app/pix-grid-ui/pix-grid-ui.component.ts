import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {STYLESHEETS_PATH} from '../app.component';
import {HelperFunctionsService} from '../services/helper-functions.service';
import {PixGridElementComponent} from '../pix-grid-element/pix-grid-element.component';
import {GameManager} from '../pix-game/game.manager';

@Component({
  selector: 'app-pix-grid-ui',
  templateUrl: './pix-grid-ui.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-grid-ui.component.min.css']
})
export class PixGridUiComponent {
  @ViewChildren(PixGridElementComponent) public pixle_emoji_output!: QueryList<PixGridElementComponent>;

  @Input() emoji_list: number[] = [];
  @Output() sendValidationRequest: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendReloadRequest: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Helper function
   * Makes an array of numbers which helps to use *ngFor as a normal for loop
   *
   * @param i
   */
  public counter(i: number): number[] {
    return HelperFunctionsService.makeForLoopCount(i);
  }

  /**
   * Request validation of the pixle grid
   */
  public validatePixleOnClick(): void {
    this.sendValidationRequest.emit();
  }

  /**
   * Reload the whole game component
   */
  public reloadGameComponent(): void {
    this.sendReloadRequest.emit();
  }

  /**
   * Receive the icon codepoint from one of the grid elements
   *
   * @param emoji_codepoint
   */
  public receiveIconCodePoint(emoji_codepoint: number = -1): void {
    if (GameManager.pixle_solved || emoji_codepoint === -1) return;
    GameManager.chosen_emoji = emoji_codepoint;
    this.selectCurrentChosenEmoji();
  }

  /**
   * Select the currently chosen emoji --> apply styling
   *
   * @private
   */
  private selectCurrentChosenEmoji(): void {
    let emoji_emitter_list: PixGridElementComponent[] = this.pixle_emoji_output.toArray();
    for (let i = 0; i < emoji_emitter_list.length; i++) {
      let current_entry: PixGridElementComponent = emoji_emitter_list[i];
      if (current_entry.pixle_emoji_codepoint !== GameManager.chosen_emoji) {
        current_entry.unselectThisEmoji();
        continue;
      }
      current_entry.selectThisEmoji();
    }
  }
}
