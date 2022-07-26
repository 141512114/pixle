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
import {WHITE_QUESTIONMARK} from '@typescript/emoji.database';
import {HelperFunctionsService} from '@abstract/services/helper-functions.service';
import {STYLESHEETS_PATH} from '../app.component';
import {WINDOW} from '@typescript/window-injection.token';
import {GameManager} from '../pix-game/game.manager';
import {AbstractHtmlElement} from '@abstract/abstract.html-element';

@Component({
  selector: 'app-pix-grid-element',
  templateUrl: './pix-grid-element.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-grid-element.component.min.css']
})
export class PixGridElementComponent extends AbstractHtmlElement implements OnInit, AfterViewInit {
  @Input() pixle_emoji: string = ''; // <-- stores the correct answer
  /**
   * Different grid element types:
   * 0 => Receiver
   * 1 => Emitter
   */
  @Input() grid_element_type: number = 0;
  @Output() sendTWAEmojiClass: EventEmitter<string> = new EventEmitter<string>();
  pixle_emoji_default: string = WHITE_QUESTIONMARK;
  pixle_tile_lives: number = 3;
  pixle_tile_solved: boolean = false;
  twa_emoji_class_front_face: string = this.pixle_emoji_default;
  twa_emoji_class_back_face: string = this.pixle_emoji_default;
  @ViewChild('component_grid_element') private component_grid_element!: ElementRef;
  @ViewChild('user_interactive') private user_interactive!: ElementRef;
  private do_flip_class: any = 'do-flip';
  private selected_class: any = 'selected';

  constructor(@Inject(WINDOW) private readonly window: Window) {
    super()
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
    // Check which type this grid element has
    switch (this.grid_element_type) {
      case 1:
        // Emit signal to outer component --> send twa class of the emoji
        this.component_grid_element.nativeElement.addEventListener('click', () => {
          this.sendTWAEmojiClass.emit(this.twa_emoji_class_front_face);
        }, false);
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
          if (!element.classList.contains(this.do_flip_class)) {
            // Reset backface of grid element
            this.showCorrectAnswer(true);
            if (this.pixle_tile_lives > 0) {
              HelperFunctionsService.unlockElement(element);
            }
          }
        }, false);
        break;
    }
  }

  /**
   * Select this emoji and element
   */
  public selectThisEmoji(): void {
    if (this.grid_element_type !== 1) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    this.removeClassFromHTMLElement(element, this.selected_class);
  }

  /**
   * Unselect this emoji and element
   */
  public unselectThisEmoji(): void {
    if (this.grid_element_type !== 1) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    this.addClassToHTMLElement(element, this.selected_class);
  }

  /**
   * After clicking on this component frontend element: reveal / change the icon currently held by the player
   *
   * @param twa_emoji_class
   */
  public revealOnClick(twa_emoji_class: string = ''): void {
    if (this.grid_element_type !== 0 || (this.pixle_tile_solved || this.pixle_tile_lives <= 0)) return;
    this.setElementIcon(twa_emoji_class);
  }

  /**
   * Flip grid element
   */
  public doFlip(): void {
    if (this.grid_element_type !== 0) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    // Show correct answer before flipping the grid element
    this.showCorrectAnswer();
    this.removeClassFromHTMLElement(element, this.do_flip_class);
    HelperFunctionsService.lockElement(element);
  }

  /**
   * Reverse flipped grid element
   */
  public undoFlip(): void {
    if (this.grid_element_type !== 0) return;
    let element: HTMLElement = this.user_interactive.nativeElement;
    this.addClassToHTMLElement(element, this.do_flip_class);
    if (!this.pixle_tile_solved) {
      this.setElementIcon(this.pixle_emoji_default);
    }
    // Second part is executed in an event listener
    // The listener is set right at the beginning of this components lifespan
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
   * @param twa_emoji_class
   * @private
   */
  private setElementIcon(twa_emoji_class: string = ''): void {
    if (twa_emoji_class === '' || (twa_emoji_class !== '' && this.twa_emoji_class_front_face === twa_emoji_class)) return;
    this.twa_emoji_class_front_face = twa_emoji_class;
  }

  /**
   * Show the correct answer
   *
   * @param hide
   * @private
   */
  private showCorrectAnswer(hide: boolean = false): void {
    if (this.grid_element_type !== 0) return;
    this.twa_emoji_class_back_face = hide ? this.pixle_emoji_default : this.pixle_emoji;
  }
}
