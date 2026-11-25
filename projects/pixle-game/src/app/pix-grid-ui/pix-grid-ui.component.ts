import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import { PixGridElementComponent } from '../pix-grid-element/pix-grid-element.component';
import { GameManager } from '../pix-game/game.manager';
import { faClipboard, faLink } from '@fortawesome/free-solid-svg-icons';
import { WINDOW } from '@typescript/window-injection.token';
import { Clipboard } from '@angular/cdk/clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-pix-grid-ui',
  templateUrl: './pix-grid-ui.component.html',
  styleUrls: ['./pix-grid-ui.component.scss'],
  imports: [FontAwesomeModule, PixGridElementComponent],
})
export class PixGridUiComponent {
  public readonly pixle_emoji_output = viewChildren(PixGridElementComponent);
  readonly emoji_list = input<string[]>([]);
  readonly pixle_share_result = input<string>('Not quite there yet!');
  readonly sendValidationRequest = output<void>();
  readonly sendReloadRequest = output<void>();
  readonly iconShareAny = faLink;
  readonly iconShareCopy = faClipboard;
  // Only rendered while there are emojis to choose from
  private readonly ui_wrapper = viewChild<ElementRef<HTMLElement>>('ui_wrapper');
  private readonly copied_badge =
    viewChild.required<ElementRef<HTMLElement>>('copied_badge');
  private readonly window = inject(WINDOW);
  private readonly clipboard = inject(Clipboard);
  private copied_badge_timer: number = -1;

  constructor() {
    inject(DestroyRef).onDestroy(() =>
      this.window.clearTimeout(this.copied_badge_timer),
    );
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
    if (this.window.navigator.share) {
      this.window.navigator
        .share({
          text: this.pixle_share_result() + '\n',
          title: 'Can you solve this pixle?',
          url: this.getPixleUrl(),
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
   * Link shared together with the result: the address the game is running on
   * (Pixle is not bound to a fixed domain)
   */
  private getPixleUrl(): string {
    return this.window.document.baseURI;
  }

  /**
   * Copy pixle content to the clipboard
   */
  public copyToClipboard(): void {
    const msgToCopy: string =
      this.pixle_share_result() + '\n' + this.getPixleUrl();
    if (this.clipboard.copy(msgToCopy)) {
      this.window.clearTimeout(this.copied_badge_timer);
      const copied_badge_element: HTMLElement = this.copied_badge().nativeElement;
      copied_badge_element.classList.remove('close');
      this.copied_badge_timer = this.window.setTimeout(() => {
        copied_badge_element.classList.add('close');
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
    this.ui_wrapper()?.nativeElement.classList.toggle('switch-ui');
  }

  /**
   * Select the currently chosen emoji --> apply styling
   *
   * @private
   */
  private selectCurrentChosenEmoji(): void {
    const emojiEmitterList: readonly PixGridElementComponent[] =
      this.pixle_emoji_output();
    for (let i = 0; i < emojiEmitterList.length; i++) {
      const current_entry: PixGridElementComponent = emojiEmitterList[i];
      if (
        current_entry.twa_emoji_class_front_face() !== GameManager.chosen_emoji
      ) {
        current_entry.unselectThisEmoji();
        continue;
      }
      current_entry.selectThisEmoji();
    }
  }
}
