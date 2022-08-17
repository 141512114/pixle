import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {PixGridElementComponent} from '../pix-grid-element/pix-grid-element.component';
import {STYLESHEETS_PATH} from '../app.component';
import {DOCUMENT} from '@angular/common';
import {WINDOW} from '@typescript/window-injection.token';
import {GameManager} from '../pix-game/game.manager';
import {HelperFunctionsService} from '@abstract/services/helper-functions.service';

// Timer / Offset
const ROW_OFFSET: number = 355;

@Component({
  selector: 'app-pix-grid',
  templateUrl: './pix-grid.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-grid.component.min.css']
})
export class PixGridComponent implements OnInit, AfterViewInit {
  @ViewChildren(PixGridElementComponent) public pixle_emoji_input!: QueryList<PixGridElementComponent>;
  @Input() grid_image_id: number = -1;
  @Input() grid_image: string[][] = [];
  grid_image_width: number = 0;
  grid_image_height: number = 0;
  grid_image_row_timer: any[] = [];
  @ViewChild('grid_wrapper') private grid_wrapper!: ElementRef;
  @ViewChild('grid_buffer') private grid_buffer!: ElementRef;
  @ViewChild('grid_inner') private grid_inner!: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private readonly window: Window) {
  }

  ngOnInit(): void {
    if (this.grid_image.length <= 0) return;
    this.grid_image_width = this.grid_image[0].length;
    this.grid_image_height = this.grid_image.length;
  }

  ngAfterViewInit() {
    if (HelperFunctionsService.getSessionCookie('lock_grid') === '1' &&
      HelperFunctionsService.getSessionCookie('pixle_id') === this.grid_image_id.toString()) return;
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
  public flipWholePixle(delay_active: boolean = false, reverse: boolean = true): void {
    if (GameManager.pixle_solved) return;
    let temp_pix_grid_comps: PixGridElementComponent[] = this.pixle_emoji_input.toArray();
    let current_grid_row: number = 0;
    this.checkGridRowTimers();
    // Instant / regular flip
    const flipWholeRow = (row_num: number = 0): boolean => {
      if (row_num >= this.grid_image_height) return false;
      let solved_tiles_count: number = 0;
      for (let i: number = 0; i < this.grid_image_width; i++) {
        let current_grid_column: number = this.grid_image_width * row_num + i;
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
    }
    // Delayed flip
    const delayFlip = (do_delay: boolean = false): void => {
      if (current_grid_row >= this.grid_image_height) return;
      if (do_delay) {
        this.grid_image_row_timer.push(setTimeout(() => {
          current_grid_row++;
          delayFlip(flipWholeRow(current_grid_row));
        }, ROW_OFFSET));
      } else {
        current_grid_row++;
        delayFlip(flipWholeRow(current_grid_row));
      }
    }
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
    let grid_image_row_timer: number[] = this.grid_image_row_timer;
    if (grid_image_row_timer.length <= 0) return;
    for (let i = 0; i < grid_image_row_timer.length; i++) {
      if (grid_image_row_timer[i] != null) {
        this.window.clearTimeout(grid_image_row_timer[i]);
      }
    }
    this.grid_image_row_timer.length = 0;
  }
}
