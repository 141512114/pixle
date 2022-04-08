import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {PixGridElementComponent} from '../pix-grid-element/pix-grid-element.component';
import {HelperFunctionsService} from '../services/helper-functions.service';
import {GameManager} from '../pix-game/game.manager';
import {STYLESHEETS_PATH} from '../app.component';
import {DOCUMENT} from '@angular/common';
import {WINDOW} from '../window-injection.token';

// Timer
const UNDO_FLIP_TIME: number = 2000;

@Component({
  selector: 'app-pix-grid',
  templateUrl: './pix-grid.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-grid.component.min.css']
})
export class PixGridComponent implements OnInit, AfterViewInit {
  @ViewChild('grid_wrapper') private grid_wrapper!: ElementRef;
  @ViewChild('grid_inner') private grid_inner!: ElementRef;
  @ViewChild('ui_wrapper') private ui_wrapper!: ElementRef;
  @ViewChildren('pixle_emoji_input') private pixle_emoji_input!: QueryList<PixGridElementComponent>;
  @ViewChildren('pixle_emoji_output') private pixle_emoji_output!: QueryList<PixGridElementComponent>;

  @Input() grid_image: number[][] = [];
  @Input() emoji_list: number[] = [];
  @Output() sendMatchStatus: EventEmitter<number> = new EventEmitter<number>();
  @Output() sendReloadRequest: EventEmitter<any> = new EventEmitter<any>();

  grid_image_width: number = 0;
  grid_image_height: number = 0;

  chosen_emoji: number = -1;
  validating: boolean = false;

  private prev_window_width: number = 0;
  private prev_window_height: number = 0;

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private readonly window: Window) {
  }

  ngOnInit(): void {
    if (this.grid_image.length <= 0) return;
    this.grid_image_width = this.grid_image[0].length;
    this.grid_image_height = this.grid_image.length;

    this.window.addEventListener('resize', () => {
      this.scaleDownGridElements();
    });
  }

  ngAfterViewInit() {
    this.window.setTimeout(() => {
      // Set an initial maximum width and height on each grid element
      let grid_buffer_element: HTMLElement = this.grid_wrapper.nativeElement.querySelector('div.pix-grid-buffer');
      this.grid_inner.nativeElement.style.maxWidth = grid_buffer_element.offsetWidth + 'px';

      this.setInitialSizes();
    }, 10);
    this.setFlipStatus(false);
  }

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
   * Reload the whole game component
   */
  public reloadGameComponent(): void {
    if (this.validating) return;
    this.sendReloadRequest.emit();
  }

  /**
   * Receive the icon codepoint from one of the grid elements
   *
   * @param emoji_codepoint
   */
  public receiveIconCodePoint(emoji_codepoint: number = -1): void {
    if (GameManager.pixle_solved || emoji_codepoint === -1) return;
    this.chosen_emoji = emoji_codepoint;
    this.selectCurrentChosenEmoji();
  }

  /**
   * After clicking on a button, validate the pixle created by the player
   */
  public validatePixleOnClick(): void {
    if (this.validating) return;
    this.validatePixle();
  }

  /**
   * Show the pixle --> swap emojis on all tiles
   *
   * OR
   *
   * Hide the pixle --> swap emojis on all tiles
   * Flip tiles over
   *
   * @param reverse
   */
  public setFlipStatus(reverse: boolean = true): void {
    let temp_pix_grid_comps: PixGridElementComponent[] = this.pixle_emoji_input.toArray();
    for (let i: number = 0; i < temp_pix_grid_comps.length; i++) {
      if (temp_pix_grid_comps[i].grid_element_type !== 0) continue;
      if (reverse) {
        temp_pix_grid_comps[i].reverseFlip();
      } else {
        temp_pix_grid_comps[i].initFlip();
      }
    }
  }

  /**
   * Used inside an EventListener attached to the window
   *
   * @private
   */
  private scaleDownGridElements(): void {
    let grid_buffer_element: HTMLElement = this.grid_wrapper.nativeElement.querySelector('div.pix-grid-buffer');
    let grid_inner_element: HTMLElement = this.grid_inner.nativeElement;

    // Set an initial maximum width and height on each grid element
    grid_inner_element.style.maxWidth = grid_buffer_element.offsetWidth + 'px';

    this.setInitialSizes();
  }

  /**
   * Set the (initial) sizes of every grid participant
   *
   * @private
   */
  private setInitialSizes(): void {
    let grid_wrapper_element: HTMLElement = this.grid_wrapper.nativeElement;
    let grid_buffer_element: HTMLElement = this.grid_wrapper.nativeElement.querySelector('div.pix-grid-buffer');
    let grid_inner_element: HTMLElement = this.grid_inner.nativeElement;

    let grid_inner_new_width: number = grid_inner_element.offsetWidth;
    // If window is getting resized on x-axis
    if (this.prev_window_width === 0 || this.prev_window_width != this.window.innerWidth) {
      if (this.window.innerWidth <= grid_wrapper_element.offsetWidth) {
        grid_inner_new_width = this.calculateWidthOfGridInnerElementViaWindowWidth();
        this.prev_window_width = this.window.innerWidth;
      }
    }
    // If window is getting resized on y-axis
    if (this.prev_window_height === 0 || this.prev_window_height != this.window.innerHeight) {
      let padding_top: number = parseInt(this.window.getComputedStyle(grid_buffer_element, null).paddingTop);
      let padding_bottom: number = parseInt(this.window.getComputedStyle(grid_buffer_element, null).paddingBottom);
      let padding_offset: number = padding_top + padding_bottom;
      let real_height_of_buffer: number = grid_buffer_element.offsetHeight - padding_offset;

      if (real_height_of_buffer <= grid_inner_element.offsetHeight || grid_inner_element.offsetWidth < grid_buffer_element.offsetWidth) {
        grid_inner_new_width = this.calculateWidthOfGridInnerElementViaWindowHeight();
        this.prev_window_height = this.window.innerHeight;
      }
    }

    let min: number = 200;
    let max: number = grid_buffer_element.offsetWidth;
    let clamp_grid_inner_width: number = Math.min(Math.max(grid_inner_new_width, min), max);
    grid_inner_element.style.width = clamp_grid_inner_width + 'px';
  }

  /**
   * Calculate the grid-inner width by looking at the window inner width
   *
   * @private
   */
  private calculateWidthOfGridInnerElementViaWindowWidth(): number {
    let grid_wrapper_element: HTMLElement = this.grid_wrapper.nativeElement;
    let padding_left: number = parseInt(this.window.getComputedStyle(grid_wrapper_element, null).paddingLeft);
    let padding_right: number = parseInt(this.window.getComputedStyle(grid_wrapper_element, null).paddingRight);
    return this.window.innerWidth - (padding_left + padding_right);
  }

  /**
   * Calculate the grid-inner width by looking at the window inner height
   *
   * @private
   */
  private calculateWidthOfGridInnerElementViaWindowHeight(): number {
    let grid_buffer_element: HTMLElement = this.grid_wrapper.nativeElement.querySelector('div.pix-grid-buffer');
    let grid_inner_element: HTMLElement = this.grid_inner.nativeElement;
    let ui_wrapper_element: HTMLElement = this.ui_wrapper.nativeElement;
    let header_element: HTMLElement | null = this.document.body.querySelector('header.navbar');

    if (header_element == null || undefined) return 0;

    let window_inner_height: number = this.window.innerHeight - header_element.offsetHeight;
    let relative_ui_wrapper_height_per: number = ui_wrapper_element.offsetHeight / window_inner_height;
    let relative_grid_wrapper_height: number = window_inner_height * (1 - relative_ui_wrapper_height_per);
    // Manipulate width of grid inner element
    let calc_grid_inner_width: number = (relative_grid_wrapper_height / grid_inner_element.offsetHeight) * grid_inner_element.offsetWidth;

    let padding_top: number = parseInt(this.window.getComputedStyle(grid_buffer_element, null).paddingTop);
    let padding_bottom: number = parseInt(this.window.getComputedStyle(grid_buffer_element, null).paddingBottom);
    return calc_grid_inner_width - (padding_top + padding_bottom);
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
      if (current_entry.pixle_emoji_codepoint !== this.chosen_emoji) {
        current_entry.unselectThisEmoji();
        continue;
      }
      current_entry.selectThisEmoji();
    }
  }

  /**
   * Validate the pixle
   * Easy version: go through every tile and check its validity separately
   *
   * @private
   */
  private validatePixle(): void {
    if (!GameManager.game_started || GameManager.pixle_solved || this.validating) return;
    this.validating = true;

    let temp_pix_grid_comps: PixGridElementComponent[] = this.pixle_emoji_input.toArray();
    let total_count: number = 0, failed_count: number = 0;
    // Check every pixle tile if its valid --> emoji at the exact same position as in the original pixle
    for (let i: number = 0; i < this.grid_image.length; i++) {
      for (let j: number = 0; j < this.grid_image_width; j++) {
        let current_column: number = (this.grid_image_width * i) + j;
        if (temp_pix_grid_comps[current_column].pixle_emoji_codepoint !== this.grid_image[i][j]) {
          temp_pix_grid_comps[current_column].updateTileStatus(false);
          if (temp_pix_grid_comps[current_column].pixle_tile_lives <= 0) {
            failed_count++;
          }
          continue;
        }
        temp_pix_grid_comps[current_column].updateTileStatus(true);
        total_count++;
      }
    }
    // If any tile has reached its limits --> went out of lives --> game over
    if (failed_count > 0) {
      GameManager.resetGame();
    } else {
      // Player has won the game
      let tile_amount: number = this.grid_image_width * this.grid_image.length;
      if (total_count >= tile_amount) {
        GameManager.pixle_solved = true;
        GameManager.game_started = false;
      } else {
        // Player didn't win yet --> reset flip-state of some tiles
        this.window.setTimeout(() => {
          this.setFlipStatus();
          this.window.setTimeout(() => {
            this.validating = false;
          }, 1000);
        }, UNDO_FLIP_TIME);
        return;
      }
    }
    this.validating = false;
  }
}
