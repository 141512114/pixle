import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {REDCROSS, WHITE_QUESTIONMARK} from '../database/emoji-database';
import {HelperFunctionsService} from '../services/helper-functions.service';
import {STYLESHEETS_PATH} from '../app.component';
import {WINDOW} from '../window-injection.token';
import {GameManager} from '../pix-game/game.manager';

@Component({
  selector: 'app-pix-grid-element',
  templateUrl: './pix-grid-element.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-grid-element.component.min.css']
})
export class PixGridElementComponent implements OnInit, AfterViewInit {
  @ViewChild('component_grid_element') private component_grid_element!: ElementRef;
  @ViewChild('user_interactive') private user_interactive!: ElementRef;
  @ViewChild('emoji_input') private emoji_input!: ElementRef;
  @ViewChild('correct_answer') private correct_answer?: ElementRef;

  @Input() pixle_emoji: number = -1; // <-- stores the correct answer
  /**
   * Different grid element types:
   * 0 => Receiver
   * 1 => Emitter
   */
  @Input() grid_element_type: number = 0;
  @Output() sendIconCodePoint: EventEmitter<number> = new EventEmitter<number>();

  pixle_emoji_default: number = WHITE_QUESTIONMARK;

  pixle_tile_lives: number = 3;
  pixle_tile_solved: boolean = false;
  pixle_emoji_text: string = '';
  pixle_emoji_codepoint: number = -1;

  private do_flip_class: any = 'do-flip';
  private selected_class: any = 'selected';

  constructor(@Inject(WINDOW) private readonly window: Window) {
  }

  ngOnInit(): void {
    // Check which type this grid element has
    switch (this.grid_element_type) {
      case 1:
        this.setElementIcon(this.pixle_emoji);
        break;
      case 0:
      default:
        this.setElementIcon(this.pixle_emoji_default);
        break;
    }
  }

  ngAfterViewInit(): void {
    this.updateElementViewIcon();
    // Check which type this grid element has
    switch (this.grid_element_type) {
      case 1:
        // Disable placeholder elements --> marked with a red cross
        if (this.pixle_emoji === REDCROSS) {
          HelperFunctionsService.lockElement(this.user_interactive.nativeElement);
        } else {
          // Emit signal to outer component --> send codepoint of emoji
          this.component_grid_element.nativeElement.addEventListener('click', () => {
            this.sendIconCodePoint.emit(this.pixle_emoji_codepoint);
          }, false);
        }
        break;
      case 0:
      default:
        // On click: change emoji
        this.component_grid_element.nativeElement.addEventListener('click', () => {
          this.revealOnClick(GameManager.chosen_emoji);
        }, false);
        // If any transition on this element ends --> call this event
        let transitionEnd = GameManager.transitionEndEventName();
        this.component_grid_element.nativeElement.addEventListener(transitionEnd, () => {
          if (GameManager.pixle_solved || !GameManager.game_started) return;
          let element: HTMLElement = this.user_interactive.nativeElement;
          if (element.classList.contains(this.do_flip_class)) return;
          // Reset backface of grid element
          this.hideCorrectAnswer();
          if (this.pixle_tile_lives > 0) {
            HelperFunctionsService.unlockElement(element);
          }
        }, false);
        break;
    }
  }

  /**
   * Get the status of this grid element
   */
  public getStatus(): number {
    return this.pixle_tile_lives;
  }

  /**
   * Select this emoji and element
   */
  public selectThisEmoji(): void {
    if (this.grid_element_type !== 1) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    if (element.classList.contains(this.selected_class)) return;
    element.classList.add(this.selected_class);
  }

  /**
   * Unselect this emoji and element
   */
  public unselectThisEmoji(): void {
    if (this.grid_element_type !== 1) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    if (!element.classList.contains(this.selected_class)) return;
    element.classList.remove(this.selected_class);
  }

  /**
   * After clicking on this component frontend element: reveal / change the icon currently held by the player
   *
   * @param emoji_codepoint
   */
  public revealOnClick(emoji_codepoint: number = -1): void {
    if (this.grid_element_type !== 0 || (this.pixle_tile_solved || this.pixle_tile_lives <= 0)) return;
    this.setElementIcon(emoji_codepoint, true);
  }

  /**
   * Flip grid element
   */
  public doFlip(): void {
    if (this.grid_element_type !== 0) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    // Show correct answer before flipping the grid element
    this.showCorrectAnswer();
    if (!element.classList.contains(this.do_flip_class)) {
      element.classList.add(this.do_flip_class);
    }
    HelperFunctionsService.lockElement(element);
  }

  /**
   * Reverse flipped grid element
   */
  public undoFlip(): void {
    if (this.grid_element_type !== 0) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    if (element.classList.contains(this.do_flip_class)) {
      element.classList.remove(this.do_flip_class);
    }
    // Delay resetting this tile after reversing the flip --> smooth effect
    if (!this.pixle_tile_solved) {
      this.setElementIcon(this.pixle_emoji_default, true);
    }
  }

  /**
   * Update the status of this particular grid element / pixle tile
   *
   * @param solved
   */
  public updateTileStatus(solved: boolean): void {
    if (this.grid_element_type !== 0 || (this.pixle_tile_solved || this.pixle_tile_lives <= 0)) return;
    let grid_native_element: HTMLElement = this.user_interactive.nativeElement;

    if (!solved) {
      this.pixle_tile_lives--;
      // Add class which represents the current health status
      grid_native_element.dataset['gridElementStatus'] = this.pixle_tile_lives.toString();
      if (this.pixle_tile_lives <= 0) {
        this.undoFlip();
        HelperFunctionsService.lockElement(grid_native_element);
      } else {
        this.doFlip();
      }
    } else {
      grid_native_element.dataset['gridElementStatus'] = 'solved';
      HelperFunctionsService.lockElement(grid_native_element);
    }
    this.pixle_tile_solved = solved;
  }

  /**
   * Change the grid elements icon
   *
   * @param emoji_codepoint
   * @param update
   * @private
   */
  private setElementIcon(emoji_codepoint: number = -1, update: boolean = false): void {
    if (emoji_codepoint === -1 || (emoji_codepoint !== -1 && this.pixle_emoji_codepoint === emoji_codepoint)) return;
    this.pixle_emoji_text = String.fromCodePoint(emoji_codepoint);
    this.pixle_emoji_codepoint = emoji_codepoint;

    if (!update) return;
    this.updateElementViewIcon();
  }

  /**
   * Update the icon shown to the player
   *
   * @private
   */
  private updateElementViewIcon(): void {
    let icon_element = this.emoji_input.nativeElement.querySelector('p.emoji');
    icon_element.textContent = this.pixle_emoji_text;
  }

  /**
   * Show the correct answer
   *
   * @private
   */
  private showCorrectAnswer(): void {
    if (this.grid_element_type !== 0 || this.correct_answer == undefined) return;
    let icon_element = this.correct_answer.nativeElement.querySelector('p.emoji');
    icon_element.textContent = String.fromCodePoint(this.pixle_emoji);
  }

  /**
   * Hide the correct answer
   *
   * @private
   */
  private hideCorrectAnswer(): void {
    if (this.grid_element_type !== 0 || this.correct_answer == undefined) return;
    let icon_element = this.correct_answer.nativeElement.querySelector('p.emoji');
    icon_element.textContent = String.fromCodePoint(this.pixle_emoji_default);
  }
}
