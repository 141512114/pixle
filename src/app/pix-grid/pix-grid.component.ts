import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import {PixGridElementComponent} from '../pix-grid-element/pix-grid-element.component';
import {HelperFunctionsService} from '../services/helper-functions.service';
import {GameManager} from '../pix-game/game.manager';

// Timer
const UNDO_FLIP_TIME: number = 2000;

@Component({
  selector: 'app-pix-grid',
  templateUrl: './pix-grid.component.html',
  styleUrls: ['../../stylesheets/css/pix-grid.component.min.css']
})
export class PixGridComponent implements OnInit, AfterViewInit {
  @ViewChildren('pixle_emoji_input') private pixle_emoji_input!: QueryList<PixGridElementComponent>;
  @ViewChildren('pixle_emoji_output') private pixle_emoji_output!: QueryList<PixGridElementComponent>;
  @ViewChild('flip_ui') private flip_ui!: ElementRef;

  @Input() grid_image: number[][] = [];
  @Input() emoji_list: number[] = [];
  @Output() sendMatchStatus: EventEmitter<number> = new EventEmitter<number>();
  @Output() sendReloadRequest: EventEmitter<any> = new EventEmitter<any>();

  grid_image_width: number = 0;
  grid_image_height: number = 0;

  chosen_emoji: number = -1;
  validating: boolean = false;

  ngOnInit(): void {
    if (this.grid_image.length <= 0) return;
    this.grid_image_width = this.grid_image[0].length;
    this.grid_image_height = this.grid_image.length;
  }

  ngAfterViewInit(): void {
    this.setDisplayStatusOfPixle(false);
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
  public setDisplayStatusOfPixle(reverse: boolean = true): void {
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
   * Flip the playground ui
   * (sitting at the bottom of the pixle grid)
   *
   * @private
   */
  private flipPlaygroundUI(): void {
    let flip_ui_element: HTMLElement = this.flip_ui.nativeElement;
    if (flip_ui_element.classList.contains('do-flip')) return;
    flip_ui_element.classList.add('do-flip');
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
    if (!GameManager.game_started || GameManager.pixle_solved || this.grid_image.length <= 0) return;
    let temp_pix_grid_comps: PixGridElementComponent[] = this.pixle_emoji_input.toArray();
    let total_count: number = 0, failed_count: number = 0;
    let pixle_convert: number[] = HelperFunctionsService.twoDimensionalArrayToOneDimensional(this.grid_image);
    // Check every pixle tile if its valid --> emoji at the exact same position as in the original pixle
    for (let i: number = 0; i < pixle_convert.length; i++) {
      if (temp_pix_grid_comps[i].pixle_emoji_codepoint !== pixle_convert[i]) {
        temp_pix_grid_comps[i].updateTileStatus(false);
        if (temp_pix_grid_comps[i].pixle_tile_lives <= 0) failed_count++;
        continue;
      }
      temp_pix_grid_comps[i].updateTileStatus(true);
      total_count++;
    }
    // If any tile has reached its limits --> went out of lives --> game over
    if (failed_count > 0) {
      GameManager.game_started = false;
      this.flipPlaygroundUI();
    } else {
      // Player has won the game
      if (total_count >= pixle_convert.length) {
        GameManager.pixle_solved = true;
        GameManager.game_started = false;
        this.flipPlaygroundUI();
      } else {
        this.validating = true;
        // Player didn't win yet --> reset flip-state of some tiles
        window.setTimeout(() => {
          this.setDisplayStatusOfPixle();
          this.validating = false;
        }, UNDO_FLIP_TIME);
      }
    }
  }
}
