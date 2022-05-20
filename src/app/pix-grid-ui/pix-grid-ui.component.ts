import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Clipboard} from '@angular/cdk/clipboard';
import {STYLESHEETS_PATH} from '../app.component';
import {HelperFunctionsService} from '../abstract/services/helper-functions.service';
import {PixGridElementComponent} from '../pix-grid-element/pix-grid-element.component';
import {GameManager} from '../pix-game/game.manager';
import {faClipboard, faLink} from '@fortawesome/free-solid-svg-icons';
import {WINDOW} from '../window-injection.token';
import {AbstractHtmlElement} from '../abstract/abstract.html-element';

@Component({
  selector: 'app-pix-grid-ui',
  templateUrl: './pix-grid-ui.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-grid-ui.component.min.css']
})
export class PixGridUiComponent extends AbstractHtmlElement {
  @ViewChildren(PixGridElementComponent) public pixle_emoji_output!: QueryList<PixGridElementComponent>;
  @Input() emoji_list: number[] = [];
  @Input() pixle_share_result: string = 'Not quite there yet!';
  @Output() sendValidationRequest: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendReloadRequest: EventEmitter<any> = new EventEmitter<any>();
  iconShareAny = faLink;
  iconShareCopy = faClipboard;
  @ViewChild('ui_wrapper') private ui_wrapper!: ElementRef;
  @ViewChild('copied_badge') private copied_badge!: ElementRef;
  private windowNavigator;
  private copied_badge_timer: number = -1;

  constructor(@Inject(WINDOW) private readonly window: Window, private clipboard: Clipboard) {
    super();
    this.windowNavigator = this.window.navigator;
  }

  /**
   * Helper function
   * Makes an array of numbers which helps to use *ngFor as a normal for loop
   *
   * @param i
   * @return Array of numbers
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
   * Open up a new ui, which allows the user to share on any platform
   * Works for example on mobile
   * The user then can share via social media, email, directly to contacts or just copy the contents
   */
  public shareOnSocialMedia(): void {
    // Check if device can share / has the api
    if (this.windowNavigator.share) {
      this.windowNavigator.share({
        text: this.pixle_share_result,
        title: 'Can you solve this pixle?',
        url: 'https://pixle.gg/'
      }).then(() => {
        console.log('Successful share');
      }).catch((error) => {
        console.log('Error sharing', error);
      });
    } else {
      // If not, just copy the content
      this.copyToClipboard();
    }
  }

  /**
   * Copy pixle content to the clipboard
   */
  public copyToClipboard(): void {
    let pixle_url: string = 'https://pixle.gg/';
    let msg_to_copy: string = this.pixle_share_result + '\n' + pixle_url;
    if (this.clipboard.copy(msg_to_copy)) {
      this.window.clearTimeout(this.copied_badge_timer);
      let copied_badge_element: HTMLElement = this.copied_badge.nativeElement;
      this.addClassToHTMLElement(copied_badge_element);
      this.copied_badge_timer = setTimeout(() => {
        this.removeClassFromHTMLElement(copied_badge_element);
      }, 2000);
    }
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
    let ui_wrapper_element: HTMLElement = this.ui_wrapper.nativeElement;
    let close_class: string = 'switch-ui';
    if (!ui_wrapper_element.classList.contains(close_class)) {
      ui_wrapper_element.classList.add(close_class);
    } else {
      ui_wrapper_element.classList.remove(close_class);
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
