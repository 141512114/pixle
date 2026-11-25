import {
  Component,
  computed,
  ElementRef,
  OnInit,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { WHITE_QUESTIONMARK } from '@typescript/emoji.database';
import { HelperFunctionsService } from '@abstract/services/helper-functions.service';
import { GameManager } from '../pix-game/game.manager';
import { AbstractHtmlElement } from '@abstract/abstract.html-element';

@Component({
  selector: 'app-pix-grid-element',
  templateUrl: './pix-grid-element.component.html',
  styleUrls: ['./pix-grid-element.component.scss'],
})
export class PixGridElementComponent
  extends AbstractHtmlElement
  implements OnInit
{
  readonly pixle_emoji = input<string>(''); // <-- stores the correct answer
  /**
   * Different grid element types:
   * 0 => Receiver
   * 1 => Emitter
   */
  readonly grid_element_type = input<number>(0);
  readonly sendTWAEmojiClass = output<string>();
  readonly pixle_emoji_default: string = WHITE_QUESTIONMARK;
  pixle_tile_lives: number = 3;
  pixle_tile_solved: boolean = false;
  // Signals, because they are changed from native event listeners and timers
  // and the view has to follow (zoneless change detection)
  readonly twa_emoji_class_front_face = signal<string>(WHITE_QUESTIONMARK);
  readonly twa_emoji_class_back_face = signal<string>(WHITE_QUESTIONMARK);
  // Accessible name, the emoji itself is only a background image (e.g. "twa-red-heart" -> "red heart")
  readonly tile_label = computed(() => {
    const emoji = this.twa_emoji_class_front_face()
      .replace(/^twa-/, '')
      .replaceAll('-', ' ');
    return this.grid_element_type() === 1 ? `Choose ${emoji}` : `Tile: ${emoji}`;
  });
  private readonly user_interactive =
    viewChild.required<ElementRef<HTMLElement>>('user_interactive');
  private readonly do_flip_class: string = 'do-flip';
  private readonly selected_class: string = 'selected';

  ngOnInit(): void {
    // Check which type this grid element has
    switch (this.grid_element_type()) {
      case 1:
        this.setElementIcon(this.pixle_emoji());
        break;
      case 0:
      default:
        this.setElementIcon(this.pixle_emoji_default);
        break;
    }
  }

  /**
   * Click (or tap) on the tile
   * Emitter: send the twa class of the emoji to the outer component
   * Receiver: place the emoji currently held by the player
   * Only click is used: touchstart would also fire when the player just starts scrolling
   */
  public onTileClick(): void {
    if (this.grid_element_type() === 1) {
      this.sendTWAEmojiClass.emit(this.twa_emoji_class_front_face());
    } else {
      this.revealOnClick(GameManager.chosen_emoji);
    }
  }

  /**
   * A transition on this tile has ended --> finish the "undo flip" of a receiver tile
   */
  public onTransitionEnd(): void {
    if (
      this.grid_element_type() !== 0 ||
      GameManager.pixle_solved ||
      this.pixle_tile_solved
    )
      return;
    const element = this.user_interactive().nativeElement;
    if (!element.classList.contains(this.do_flip_class)) {
      // Reset backface of grid element
      this.showCorrectAnswer(false);
      if (!GameManager.game_started) return;
      HelperFunctionsService.unlockElement(element);
    }
  }

  /**
   * Select this emoji and element
   */
  public selectThisEmoji(): void {
    if (this.grid_element_type() !== 1) return;
    this.addClassToHTMLElement(
      this.user_interactive().nativeElement,
      this.selected_class,
    );
  }

  /**
   * Unselect this emoji and element
   */
  public unselectThisEmoji(): void {
    if (this.grid_element_type() !== 1) return;
    this.removeClassFromHTMLElement(
      this.user_interactive().nativeElement,
      this.selected_class,
    );
  }

  /**
   * After clicking on this component frontend element: reveal / change the icon currently held by the player
   *
   * @param twa_emoji_class
   */
  public revealOnClick(twa_emoji_class: string = ''): void {
    if (
      this.grid_element_type() !== 0 ||
      this.pixle_tile_solved ||
      this.pixle_tile_lives <= 0
    )
      return;
    this.setElementIcon(twa_emoji_class);
  }

  /**
   * Flip grid element
   */
  public doFlip(): void {
    if (this.grid_element_type() !== 0) return;
    const element = this.user_interactive().nativeElement;
    // Show correct answer before flipping the grid element
    this.showCorrectAnswer();
    this.addClassToHTMLElement(element, this.do_flip_class);
    HelperFunctionsService.lockElement(element);
  }

  /**
   * Reverse flipped grid element
   */
  public undoFlip(): void {
    if (this.grid_element_type() !== 0 || this.pixle_tile_solved) return;
    this.removeClassFromHTMLElement(
      this.user_interactive().nativeElement,
      this.do_flip_class,
    );
    this.setElementIcon(this.pixle_emoji_default);
    // Second part is executed in an event listener
    // The listener is set right at the beginning of this components lifespan
  }

  /**
   * Update the status of this particular grid element / pixle tile
   *
   * @param solved
   */
  public updateTileStatus(solved: boolean): void {
    if (
      this.grid_element_type() !== 0 ||
      this.pixle_tile_solved ||
      this.pixle_tile_lives <= 0
    )
      return;
    const gridNativeElement = this.user_interactive().nativeElement;
    if (!solved) {
      this.pixle_tile_lives--;
      // Add class which represents the current health status
      gridNativeElement.dataset['gridElementStatus'] =
        this.pixle_tile_lives.toString();
      if (this.pixle_tile_lives <= 0) {
        this.undoFlip();
        HelperFunctionsService.lockElement(gridNativeElement);
      } else {
        this.doFlip();
      }
    } else {
      gridNativeElement.dataset['gridElementStatus'] = 'solved';
      HelperFunctionsService.lockElement(gridNativeElement);
    }
    this.pixle_tile_solved = solved;
  }

  /**
   * Change the grid elements icon
   *
   * @param twa_emoji_class
   * @private
   */
  private setElementIcon(twa_emoji_class: string = ''): void {
    if (twa_emoji_class === '') return;
    this.twa_emoji_class_front_face.set(twa_emoji_class);
  }

  /**
   * Show the correct answer
   *
   * @param show
   * @private
   */
  private showCorrectAnswer(show: boolean = true): void {
    if (this.grid_element_type() !== 0) return;
    this.twa_emoji_class_back_face.set(
      show ? this.pixle_emoji() : this.pixle_emoji_default,
    );
  }
}
