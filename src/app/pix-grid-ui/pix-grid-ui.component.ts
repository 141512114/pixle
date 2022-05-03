import {Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {STYLESHEETS_PATH} from '../app.component';
import {HelperFunctionsService} from '../services/helper-functions.service';
import {PixGridElementComponent} from '../pix-grid-element/pix-grid-element.component';
import {GameManager} from '../pix-game/game.manager';
import {faTwitter, faWhatsapp, IconDefinition} from '@fortawesome/free-brands-svg-icons';
import {faClipboard} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pix-grid-ui',
  templateUrl: './pix-grid-ui.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-grid-ui.component.min.css']
})
export class PixGridUiComponent {
  @ViewChild('emoji_list_wrapper') private emoji_list_wrapper!: ElementRef;
  @ViewChild('social_share') private social_share!: ElementRef;
  @ViewChildren(PixGridElementComponent) public pixle_emoji_output!: QueryList<PixGridElementComponent>;

  @Input() emoji_list: number[] = [];
  @Output() sendValidationRequest: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendReloadRequest: EventEmitter<any> = new EventEmitter<any>();

  iconShareTwitter: IconDefinition = faTwitter;
  iconShareWhatsApp: IconDefinition = faWhatsapp;
  iconShareCopy: IconDefinition = faClipboard;

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
   * Switch between the ui elements 'social_share' and 'emoji_list_wrapper'
   * Toggle one or the other
   */
  public switchUiElements(): void {
    let emoji_list_element: HTMLElement = this.emoji_list_wrapper.nativeElement;
    let social_share_element: HTMLElement = this.social_share.nativeElement;
    let close_class: string = 'close';
    if (emoji_list_element.classList.contains(close_class)) {
      emoji_list_element.classList.remove(close_class);
      if (!social_share_element.classList.contains(close_class)) {
        social_share_element.classList.add(close_class);
      }
    } else {
      emoji_list_element.classList.add(close_class);
      if (social_share_element.classList.contains(close_class)) {
        social_share_element.classList.remove(close_class);
      }
    }
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
