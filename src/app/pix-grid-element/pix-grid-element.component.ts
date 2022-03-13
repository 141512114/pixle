import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {REDCROSS, WHITE_QUESTIONMARK} from '../database/emoji-database';
import {HelperFunctionsService} from '../services/helper-functions.service';

const UNDO_FLIP_TIME: number = 2000;

@Component({
  selector: 'app-pix-grid-element',
  templateUrl: './pix-grid-element.component.html',
  styleUrls: ['../../assets/stylesheets/css/minified/pix-grid-element.component.min.css']
})
export class PixGridElementComponent implements OnInit, AfterViewInit {
  @ViewChild('component_grid_element') private component_grid_element!: ElementRef;
  @ViewChild('user_interactive') private user_interactive!: ElementRef;
  @ViewChild('correct_answer') private correct_answer!: ElementRef;
  @Input() pixle_emoji: number = -1; // <-- stores the correct answer
  @Input() receive_chosen_emoji: number = -1;
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

  ngOnInit(): void {
    // Check which type this grid element has
    switch (this.grid_element_type) {
      case 1:
        this.changeElementIcon(this.pixle_emoji);
        break;
      case 0:
      default:
        this.changeElementIcon(this.pixle_emoji_default);
        break;
    }
  }

  ngAfterViewInit(): void {
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
          this.revealOnClick(this.receive_chosen_emoji);
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
   * Select this emoji and element
   */
  public selectThisEmoji(): void {
    if (this.grid_element_type !== 1) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    if (!element.classList.contains('selected')) {
      element.classList.add('selected');
    }
  }

  /**
   * Unselect this emoji and element
   */
  public unselectThisEmoji(): void {
    if (this.grid_element_type !== 1) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    if (element.classList.contains('selected')) {
      element.classList.remove('selected');
    }
  }

  /**
   * After clicking on this component frontend element: reveal / change the icon currently held by the player
   *
   * @param emoji_codepoint
   */
  public revealOnClick(emoji_codepoint: number = -1): void {
    if ((this.grid_element_type !== 0) || (this.pixle_tile_solved || this.pixle_tile_lives <= 0)) return;
    this.changeElementIcon(emoji_codepoint);
  }

  /**
   * Update the status of this particular grid element / pixle tile
   *
   * @param solved
   */
  public updateTileStatus(solved: boolean): void {
    if (this.grid_element_type !== 0 || this.pixle_tile_solved || this.pixle_tile_lives <= 0) return;
    let grid_native_element: HTMLElement = this.user_interactive.nativeElement;

    if (!solved) {
      this.pixle_tile_lives--;
      // Add class which represents the current health status
      if (this.pixle_tile_lives <= 0) {
        grid_native_element.dataset['gridElementStatus'] = 'failed';
        HelperFunctionsService.lockElement(grid_native_element);
        this.undoFlip(grid_native_element);
        return;
      }
      grid_native_element.dataset['gridElementStatus'] = this.pixle_tile_lives.toString();
      this.doFlip(grid_native_element);
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
   * @private
   */
  private changeElementIcon(emoji_codepoint: number = -1): void {
    if ((emoji_codepoint === -1) || (this.pixle_emoji_codepoint === emoji_codepoint)) return;
    this.pixle_emoji_text = String.fromCodePoint(emoji_codepoint);
    this.pixle_emoji_codepoint = emoji_codepoint;
  }

  /**
   * Show the correct answer
   *
   * @private
   */
  private showCorrectAnswer(): void {
    if (this.grid_element_type !== 0) return;
    let icon_element = this.correct_answer.nativeElement.querySelector('p.icon-inner');
    icon_element.textContent = String.fromCodePoint(this.pixle_emoji);
  }

  /**
   * Hide the correct answer
   *
   * @private
   */
  private hideCorrectAnswer(): void {
    if (this.grid_element_type !== 0) return;
    let icon_element = this.correct_answer.nativeElement.querySelector('p.icon-inner');
    icon_element.textContent = String.fromCodePoint(this.pixle_emoji_default);
  }

  /**
   * Flip grid element
   *
   * @param element
   * @private
   */
  private doFlip(element: HTMLElement): void {
    if ((this.grid_element_type !== 0) || (element == undefined || null) || (element.classList.contains('do-flip'))) return;
    // Show correct answer before flipping the grid element
    this.showCorrectAnswer();
    element.classList.add('do-flip');
    HelperFunctionsService.lockElement(element);

    window.setTimeout(() => {
      this.undoFlip(element);
    }, UNDO_FLIP_TIME);
  }

  /**
   * Reverse flipped grid element
   *
   * @param element
   * @private
   */
  private undoFlip(element: HTMLElement): void {
    if ((this.grid_element_type !== 0) || (element == undefined || null) || (!element.classList.contains('do-flip'))) return;
    element.classList.remove('do-flip');
    this.hideCorrectAnswer();
    this.changeElementIcon(this.pixle_emoji_default);
    HelperFunctionsService.unlockElement(element);
  }
}
