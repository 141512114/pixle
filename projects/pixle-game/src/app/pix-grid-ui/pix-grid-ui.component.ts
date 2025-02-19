import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { HelperFunctionsService } from '@abstract/services/helper-functions.service';
import { PixGridElementComponent } from '../pix-grid-element/pix-grid-element.component';
import { GameManager } from '../pix-game/game.manager';
import { faClipboard, faLink } from '@fortawesome/free-solid-svg-icons';
import { WINDOW } from '@typescript/window-injection.token';
import { AbstractHtmlElement } from '@abstract/abstract.html-element';

@Component({
  selector: 'app-pix-grid-ui',
  templateUrl: './pix-grid-ui.component.html',
  styleUrls: ['./pix-grid-ui.component.scss'],
})
export class PixGridUiComponent extends AbstractHtmlElement {
  @ViewChildren(PixGridElementComponent)
  public pixle_emoji_output!: QueryList<PixGridElementComponent>;
  @Input() emoji_list: string[] = [];
  @Input() pixle_share_result: string = 'Not quite there yet!';
  @Output() sendValidationRequest: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendReloadRequest: EventEmitter<any> = new EventEmitter<any>();
  iconShareAny = faLink;
  iconShareCopy = faClipboard;
  @ViewChild('ui_wrapper') private ui_wrapper!: ElementRef;
  @ViewChild('copied_badge') private copied_badge!: ElementRef;
  private windowNavigator;
  private copied_badge_timer: any = -1;

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    private clipboard: Clipboard,
  ) {
    super();
    this.windowNavigator = this.window.navigator;
  }

  /**
   * Helper function
   * Makes an array of numbers which helps to use *ngFor as a normal for loop
   *
   * @param i
   * @return {number[]} Array of numbers
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
      this.windowNavigator
        .share({
          text: this.pixle_share_result + '\n',
          title: 'Can you solve this pixle?',
          url: 'https://www.pixle.gg/',
        })
        .then(() => {
          console.log('Successful share');
        })
        .catch((error) => {
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
    const pixleUrl: string = 'https://www.pixle.gg/';
    const msgToCopy: string = this.pixle_share_result + '\n' + pixleUrl;
    if (this.clipboard.copy(msgToCopy)) {
      this.window.clearTimeout(this.copied_badge_timer);
      const copied_badge_element: HTMLElement = this.copied_badge.nativeElement;
      this.removeClassFromHTMLElement(copied_badge_element, 'close');
      this.copied_badge_timer = setTimeout(() => {
        this.addClassToHTMLElement(copied_badge_element, 'close');
      }, 2000);
    }
  }

  /**
   * Receive the icon codepoint from one of the grid elements
   *
   * @param twa_emoji_class
   */
  public receiveIconCodePoint(twa_emoji_class: string = ''): void {
    if (GameManager.pixle_solved || twa_emoji_class === '') return;
    GameManager.chosen_emoji = twa_emoji_class;
    this.selectCurrentChosenEmoji();
  }

  /**
   * Switch between the ui elements 'social_share' and 'emoji_list_wrapper'
   * Toggle one or the other
   */
  public switchUiElements(): void {
    const uiWrapperElement: HTMLElement = this.ui_wrapper.nativeElement;
    const closeClass: string = 'switch-ui';
    if (!uiWrapperElement.classList.contains(closeClass)) {
      uiWrapperElement.classList.add(closeClass);
    } else {
      uiWrapperElement.classList.remove(closeClass);
    }
  }

  /**
   * Select the currently chosen emoji --> apply styling
   *
   * @private
   */
  private selectCurrentChosenEmoji(): void {
    const emojiEmitterList: PixGridElementComponent[] =
      this.pixle_emoji_output.toArray();
    for (let i = 0; i < emojiEmitterList.length; i++) {
      const current_entry: PixGridElementComponent = emojiEmitterList[i];
      if (
        current_entry.twa_emoji_class_front_face !== GameManager.chosen_emoji
      ) {
        current_entry.unselectThisEmoji();
        continue;
      }
      current_entry.selectThisEmoji();
    }
  }
}
