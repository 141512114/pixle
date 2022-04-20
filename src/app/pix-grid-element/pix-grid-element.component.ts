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

const SHORT_OFFSET: number = 500;

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
          });
        }
        break;
      case 0:
      default:
        // On click: change emoji
        this.component_grid_element.nativeElement.addEventListener('click', () => {
          this.revealOnClick(GameManager.chosen_emoji);
        });
        break;
    }
  }

  /**
   * Used in the grid component (parent component --> game controller)
   */
  public initFlip(): void {
    this.doFlip(this.user_interactive.nativeElement);
  }

  /**
   * Used to reverse flip an element
   */
  public reverseFlip(): void {
    this.undoFlip(this.user_interactive.nativeElement);
  }

  /**
   * Select this emoji and element
   */
  public selectThisEmoji(): void {
    if (this.grid_element_type !== 1) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    if (element.classList.contains('selected')) return;
    element.classList.add('selected');
  }

  /**
   * Unselect this emoji and element
   */
  public unselectThisEmoji(): void {
    if (this.grid_element_type !== 1) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    if (!element.classList.contains('selected')) return;
    element.classList.remove('selected');
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
      if (this.pixle_tile_lives <= 0) {
        grid_native_element.dataset['gridElementStatus'] = 'failed';
        this.undoFlip(grid_native_element, true);
        HelperFunctionsService.lockElement(grid_native_element);
      } else {
        grid_native_element.dataset['gridElementStatus'] = this.pixle_tile_lives.toString();
        this.doFlip(grid_native_element);
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

  /**
   * Flip grid element
   *
   * @param element
   * @private
   */
  private doFlip(element: HTMLElement): void {
    if (this.grid_element_type !== 0 || element == undefined || null) return;
    // Show correct answer before flipping the grid element
    this.showCorrectAnswer();
    if (!element.classList.contains('do-flip')) {
      element.classList.add('do-flip');
    }
    HelperFunctionsService.lockElement(element);
  }

  /**
   * Reverse flipped grid element
   *
   * @param element
   * @param reset
   * @private
   */
  private undoFlip(element: HTMLElement, reset: boolean = false): void {
    if (this.grid_element_type !== 0 || element == undefined || null) return;
    if (element.classList.contains('do-flip')) {
      element.classList.remove('do-flip');
    }
    // Delay resetting this tile after reversing the flip --> smooth effect
    if (!this.pixle_tile_solved) {
      this.setElementIcon(this.pixle_emoji_default, true);
      if (!reset) {
        this.window.setTimeout(() => {
          this.hideCorrectAnswer();
          if (this.pixle_tile_lives > 0) {
            HelperFunctionsService.unlockElement(element);
          }
        }, SHORT_OFFSET);
      }
    }
  }
}
