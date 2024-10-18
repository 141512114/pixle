import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { WHITE_QUESTIONMARK } from '@typescript/emoji.database';
import { HelperFunctionsService } from '@abstract/services/helper-functions.service';
import { WINDOW } from '@typescript/window-injection.token';
import { GameManager } from '../pix-game/game.manager';
import { AbstractHtmlElement } from '@abstract/abstract.html-element';

@Component({
  selector: 'app-pix-grid-element',
  templateUrl: './pix-grid-element.component.html',
  styleUrls: ['./pix-grid-element.component.scss'],
})
export class PixGridElementComponent
  extends AbstractHtmlElement
  implements OnInit, AfterViewInit
{
  @Input() pixle_emoji: string = ''; // <-- stores the correct answer
  /**
   * Different grid element types:
   * 0 => Receiver
   * 1 => Emitter
   */
  @Input() grid_element_type: number = 0;
  @Output() sendTWAEmojiClass: EventEmitter<string> =
    new EventEmitter<string>();
  pixle_emoji_default: string = WHITE_QUESTIONMARK;
  pixle_tile_lives: number = 3;
  pixle_tile_solved: boolean = false;
  twa_emoji_class_front_face: string = this.pixle_emoji_default;
  twa_emoji_class_back_face: string = this.pixle_emoji_default;
  @ViewChild('component_grid_element')
  private component_grid_element!: ElementRef;
  @ViewChild('user_interactive') private user_interactive!: ElementRef;
  private do_flip_class: any = 'do-flip';
  private selected_class: any = 'selected';

  constructor(@Inject(WINDOW) private readonly window: Window) {
    super();
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
        ['click', 'touchstart'].forEach((event) => {
          HelperFunctionsService.addEventListenerToElement(
            this.component_grid_element.nativeElement,
            event,
            () => {
              this.sendTWAEmojiClass.emit(this.twa_emoji_class_front_face);
            },
          );
        });
        break;
      case 0:
      default:
        // On click: change emoji
        ['click', 'touchstart'].forEach((event) => {
          HelperFunctionsService.addEventListenerToElement(
            this.component_grid_element.nativeElement,
            event,
            () => {
              this.revealOnClick(GameManager.chosen_emoji);
            },
          );
        });
        // If any transition on this element ends --> call this event
        let transitionEnd = HelperFunctionsService.transitionEndEventName();
        HelperFunctionsService.addEventListenerToElement(
          this.component_grid_element.nativeElement,
          transitionEnd,
          () => {
            if (GameManager.pixle_solved || this.pixle_tile_solved) return;
            let element: HTMLElement = this.user_interactive.nativeElement;
            if (!element.classList.contains(this.do_flip_class)) {
              // Reset backface of grid element
              this.showCorrectAnswer(false);
              if (!GameManager.game_started) return;
              HelperFunctionsService.unlockElement(element);
            }
          },
        );
        break;
    }
  }

  /**
   * Select this emoji and element
   */
  public selectThisEmoji(): void {
    if (this.grid_element_type !== 1) return;
    const element = this.user_interactive.nativeElement as HTMLElement;
    this.addClassToHTMLElement(element, this.selected_class);
  }

  /**
   * Unselect this emoji and element
   */
  public unselectThisEmoji(): void {
    if (this.grid_element_type !== 1) return;
    const element = this.user_interactive.nativeElement as HTMLElement;
    this.removeClassFromHTMLElement(element, this.selected_class);
  }

  /**
   * After clicking on this component frontend element: reveal / change the icon currently held by the player
   *
   * @param twa_emoji_class
   */
  public revealOnClick(twa_emoji_class: string = ''): void {
    if (
      this.grid_element_type !== 0 ||
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
    if (this.grid_element_type !== 0) return;
    const element = this.user_interactive.nativeElement as HTMLElement;
    // Show correct answer before flipping the grid element
    this.showCorrectAnswer();
    this.addClassToHTMLElement(element, this.do_flip_class);
    HelperFunctionsService.lockElement(element);
  }

  /**
   * Reverse flipped grid element
   */
  public undoFlip(): void {
    if (this.grid_element_type !== 0 || this.pixle_tile_solved) return;
    const element = this.user_interactive.nativeElement as HTMLElement;
    this.removeClassFromHTMLElement(element, this.do_flip_class);
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
      this.grid_element_type !== 0 ||
      this.pixle_tile_solved ||
      this.pixle_tile_lives <= 0
    )
      return;
    const gridNativeElement = this.user_interactive
      .nativeElement as HTMLElement;
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
    if (
      twa_emoji_class === '' ||
      (twa_emoji_class !== '' &&
        this.twa_emoji_class_front_face === twa_emoji_class)
    )
      return;
    this.twa_emoji_class_front_face = twa_emoji_class;
  }

  /**
   * Show the correct answer
   *
   * @param show
   * @private
   */
  private showCorrectAnswer(show: boolean = true): void {
    if (this.grid_element_type !== 0) return;
    this.twa_emoji_class_back_face = show
      ? this.pixle_emoji
      : this.pixle_emoji_default;
  }
}
