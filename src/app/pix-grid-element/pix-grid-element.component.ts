import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {WHITE_QUESTIONMARK} from '../database/emoji-database';

@Component({
  selector: 'app-pix-grid-element',
  templateUrl: './pix-grid-element.component.html',
  styleUrls: ['../../assets/stylesheets/css/minified/pix-grid-element.component.min.css']
})
export class PixGridElementComponent implements OnInit, AfterViewInit {
  @ViewChild('component_grid_element') private component_grid_element!: ElementRef;
  @Input() pixle_emoji: number = -1;
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
    this.changeElementIcon(this.pixle_emoji);
  }

  ngAfterViewInit(): void {
    // Check which type this grid element has
    switch (this.grid_element_type) {
      case 1:
        // Emit signal to outer component --> send codepoint of emoji
        this.component_grid_element.nativeElement.addEventListener('click', () => {
          this.sendIconCodePoint.emit(this.pixle_emoji_codepoint);
        });
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
   * After clicking on this component frontend element: reveal / change the icon currently held by the player
   *
   * @param emoji_codepoint
   */
  public revealOnClick(emoji_codepoint: number = -1): void {
    if (this.pixle_tile_solved || this.pixle_tile_lives <= 0) return;
    this.changeElementIcon(emoji_codepoint);
  }

  /**
   * Change the grid elements icon
   *
   * @param emoji_codepoint
   */
  public changeElementIcon(emoji_codepoint: number = -1): void {
    if ((emoji_codepoint == -1) || (this.pixle_emoji_codepoint === emoji_codepoint)) return;
    this.pixle_emoji_text = String.fromCodePoint(emoji_codepoint);
    this.pixle_emoji_codepoint = emoji_codepoint;
  }

  /**
   * Update the status of this particular grid element / pixle tile
   *
   * @param solved
   */
  public updateTileStatus(solved: boolean): void {
    if (this.grid_element_type === 1 || this.pixle_tile_solved || this.pixle_tile_lives <= 0) return;
    let grid_native_element: HTMLElement = this.component_grid_element.nativeElement;

    if (!solved) {
      this.changeElementIcon(this.pixle_emoji_default);
      this.pixle_tile_lives--;
      // Add class which represents the current health status
      if (this.pixle_tile_lives <= 0) {
        grid_native_element.classList.add('grid-element-status__failed');
      } else {
        grid_native_element.classList.add('grid-element-status__' + this.pixle_tile_lives);
      }
    } else {
      grid_native_element.classList.add('grid-element-status__solved');
      this.pixle_tile_solved = solved;
    }
  }
}
