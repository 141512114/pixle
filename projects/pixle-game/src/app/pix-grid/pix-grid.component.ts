import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { PixGridElementComponent } from '../pix-grid-element/pix-grid-element.component';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '@typescript/window-injection.token';
import { GameManager } from '../pix-game/game.manager';
import { HelperFunctionsService } from '@abstract/services/helper-functions.service';
import * as CookieService from '@abstract/composables/cookies';

// Timer / Offset
const ROW_OFFSET: number = 355;

const MIN_GRID_WIDTH: number = 135;

@Component({
  selector: 'app-pix-grid',
  templateUrl: './pix-grid.component.html',
  styleUrls: ['./pix-grid.component.scss'],
})
export class PixGridComponent implements OnInit, AfterViewInit {
  @ViewChildren(PixGridElementComponent)
  public pixle_emoji_input!: QueryList<PixGridElementComponent>;
  @Input() grid_image_id: number = -1;
  @Input() grid_image: string[][] = [];
  grid_image_width: number = 0;
  grid_image_height: number = 0;
  grid_image_row_timer: any[] = [];
  @ViewChild('grid_wrapper') private grid_wrapper!: ElementRef;
  @ViewChild('grid_buffer') private grid_buffer!: ElementRef;
  @ViewChild('grid_inner') private grid_inner!: ElementRef;
  private prev_window_height: number = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private readonly window: Window,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    if (this.grid_image.length <= 0) return;
    this.grid_image_width = this.grid_image[0].length;
    this.grid_image_height = this.grid_image.length;
    HelperFunctionsService.addEventListenerToElement(
      this.window,
      'resize',
      () => {
        this.setInitialSizes();
      },
    );
  }

  ngAfterViewInit() {
    this.window.setTimeout(() => {
      this.setInitialSizes();
    }, 10);
    if (
      CookieService.getSessionCookie('lock_grid') === '1' &&
      CookieService.getSessionCookie('pixle_id') ===
        this.grid_image_id.toString()
    )
      return;
    this.flipWholePixle(false, false);
  }

  /**
   * Show the pixle --> swap emojis on all tiles
   *
   * OR
   *
   * Hide the pixle --> swap emojis on all tiles
   * Flip tiles over
   *
   * @param delay_active
   * @param reverse
   */
  public flipWholePixle(
    delay_active: boolean = false,
    reverse: boolean = true,
  ): void {
    if (GameManager.pixle_solved) return;
    const temp_pix_grid_comps: PixGridElementComponent[] =
      this.pixle_emoji_input.toArray();
    let current_grid_row: number = 0;
    this.checkGridRowTimers();
    // Instant / regular flip
    const flipWholeRow = (row_num: number = 0): boolean => {
      if (row_num >= this.grid_image_height) return false;
      let solved_tiles_count: number = 0;
      for (let i: number = 0; i < this.grid_image_width; i++) {
        const current_grid_column: number = this.grid_image_width * row_num + i;
        if (temp_pix_grid_comps[current_grid_column].pixle_tile_solved) {
          solved_tiles_count++;
          continue;
        }
        if (reverse) {
          temp_pix_grid_comps[current_grid_column].undoFlip();
        } else {
          temp_pix_grid_comps[current_grid_column].doFlip();
        }
      }
      return solved_tiles_count < this.grid_image_width;
    };
    // Delayed flip
    const delayFlip = (do_delay: boolean = false): void => {
      if (current_grid_row >= this.grid_image_height) return;
      if (do_delay) {
        this.grid_image_row_timer.push(
          setTimeout(() => {
            current_grid_row++;
            delayFlip(flipWholeRow(current_grid_row));
          }, ROW_OFFSET),
        );
      } else {
        current_grid_row++;
        delayFlip(flipWholeRow(current_grid_row));
      }
    };
    if (delay_active) {
      delayFlip(flipWholeRow(current_grid_row));
    } else {
      for (let i = 0; i < this.grid_image_height; i++) {
        flipWholeRow(i);
      }
    }
  }

  /**
   * Check if the grid row timers have finished
   * But they must all have finished their task
   */
  public checkGridRowTimers(): void {
    const grid_image_row_timer: number[] = this.grid_image_row_timer;
    if (grid_image_row_timer.length <= 0) return;
    for (let i = 0; i < grid_image_row_timer.length; i++) {
      if (grid_image_row_timer[i] != null) {
        this.window.clearTimeout(grid_image_row_timer[i]);
      }
    }
    this.grid_image_row_timer.length = 0;
  }

  /**
   * Set the (initial) sizes of every grid participant
   *
   * @private
   */
  private setInitialSizes(): void {
    const gridWrapperElement = this.grid_wrapper.nativeElement as HTMLElement;
    const gridBufferElement = this.grid_buffer.nativeElement as HTMLElement;
    const gridInnerElement = this.grid_inner.nativeElement as HTMLElement;

    // Cache computed styles and dimensions
    const gridBufferStyles = this.window.getComputedStyle(gridBufferElement);
    const gridWrapperStyles = this.window.getComputedStyle(gridWrapperElement);

    const paddingTop = parseInt(gridBufferStyles.paddingTop, 10) || 0;
    const paddingBottom = parseInt(gridBufferStyles.paddingBottom, 10) || 0;
    const paddingLeft = parseInt(gridWrapperStyles.paddingLeft, 10) || 0;
    const paddingRight = parseInt(gridWrapperStyles.paddingRight, 10) || 0;

    const paddingOffset = paddingTop + paddingBottom;
    const realHeightOfBuffer = gridBufferElement.offsetHeight - paddingOffset;

    let gridInnerNewWidth = gridBufferElement.offsetWidth;

    // Optimize window resize logic
    if (
      this.prev_window_height === 0 ||
      this.prev_window_height != this.window.innerHeight
    ) {
      // If window is getting resized on y-axis
      if (
        gridBufferElement.offsetWidth < gridWrapperElement.offsetWidth ||
        realHeightOfBuffer <= gridInnerElement.offsetHeight
      ) {
        gridInnerNewWidth =
          this.calculateWidthOfGridBufferElementViaWindowHeight();
      }
      this.prev_window_height = this.window.innerHeight;
    }

    // Calculate the clamped width
    const maxGridWidth =
      gridWrapperElement.offsetWidth - (paddingLeft + paddingRight);
    const clampedGridInnerWidth = HelperFunctionsService.clampValue(
      gridInnerNewWidth,
      MIN_GRID_WIDTH,
      maxGridWidth,
    );

    // Use Renderer2 for DOM manipulation
    this.renderer.setStyle(
      gridBufferElement,
      'width',
      `${clampedGridInnerWidth}px`,
    );
  }

  /**
   * Calculate the grid-buffer width by looking at the window inner height
   *
   * @return {number} Calculated height of the grid buffer
   * @private
   */
  private calculateWidthOfGridBufferElementViaWindowHeight(): number {
    const grid_buffer_element: HTMLElement = this.grid_buffer.nativeElement;
    const ui_wrapper_element: HTMLElement | null =
      this.document.getElementById('pix-grid-ui');
    const header_element: HTMLElement | null =
      this.document.getElementById('main-navbar');

    if (
      header_element == null ||
      undefined ||
      ui_wrapper_element == null ||
      undefined
    )
      return grid_buffer_element.offsetWidth;

    const padding_top: number = parseInt(
      this.window.getComputedStyle(grid_buffer_element, null).paddingTop,
    );
    const padding_bottom: number = parseInt(
      this.window.getComputedStyle(grid_buffer_element, null).paddingBottom,
    );
    let padding_offset: number = padding_top + padding_bottom;

    const window_inner_height: number =
      this.window.innerHeight - header_element.offsetHeight;
    const relative_ui_wrapper_height_per: number =
      ui_wrapper_element.offsetHeight / window_inner_height;
    const relative_grid_wrapper_height: number =
      window_inner_height * (1 - relative_ui_wrapper_height_per);
    const new_grid_buffer_width: number =
      (relative_grid_wrapper_height / this.grid_image_height) *
        this.grid_image_width -
      padding_offset;

    grid_buffer_element.style.maxWidth = new_grid_buffer_width + 'px';
    return new_grid_buffer_width;
  }
}
