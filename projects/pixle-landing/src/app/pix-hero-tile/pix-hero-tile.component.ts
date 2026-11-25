import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { WHITE_QUESTIONMARK } from '@typescript/emoji.database';
import { AbstractHtmlElement } from '@abstract/abstract.html-element';
import { HelperFunctionsService } from '@abstract/services/helper-functions.service';

@Component({
  selector: 'app-pix-hero-tile',
  templateUrl: './pix-hero-tile.component.html',
  styleUrls: ['./pix-hero-tile.component.scss'],
})
export class PixHeroTileComponent
  extends AbstractHtmlElement
  implements OnInit, AfterViewInit
{
  readonly pixle_emoji = input<string>('');
  pixle_twa_emoji_class: string = '';
  readonly pixle_emoji_default: string = WHITE_QUESTIONMARK;
  // Signal, because it is set after the view has been initialized (zoneless)
  readonly twa_emoji_class_back_face = signal<string>(WHITE_QUESTIONMARK);
  pixle_tile_timer: number = -1;
  private readonly tile_content_wrapper =
    viewChild.required<ElementRef<HTMLElement>>('tile_content_wrapper');
  private do_flip_class: any = 'do-flip';

  constructor() {
    super();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setElementIcon(this.pixle_emoji(), true);
    ['mouseenter', 'touchstart'].forEach((event) => {
      HelperFunctionsService.addEventListenerToElement(
        this.tile_content_wrapper().nativeElement,
        event,
        () => {
          this.doFlip();
          clearTimeout(this.pixle_tile_timer);
        },
      );
    });
    ['mouseleave', 'touchend', 'touchcancel'].forEach((event) => {
      HelperFunctionsService.addEventListenerToElement(
        this.tile_content_wrapper().nativeElement,
        event,
        () => {
          this.pixle_tile_timer = window.setTimeout(() => {
            this.undoFlip();
          }, 350);
        },
      );
    });
  }

  /**
   * Flip grid element
   */
  public doFlip(): void {
    const element = this.tile_content_wrapper().nativeElement as HTMLElement;
    this.addClassToHTMLElement(element, this.do_flip_class);
  }

  /**
   * Reverse flipped grid element
   */
  public undoFlip(): void {
    const element = this.tile_content_wrapper().nativeElement as HTMLElement;
    this.removeClassFromHTMLElement(element, this.do_flip_class);
  }

  /**
   * Change the grid elements icon
   *
   * @param twa_emoji_class
   * @param update
   * @private
   */
  private setElementIcon(
    twa_emoji_class: string = '',
    update: boolean = false,
  ): void {
    if (
      twa_emoji_class === '' ||
      (twa_emoji_class !== '' && this.pixle_twa_emoji_class === twa_emoji_class)
    )
      return;
    this.pixle_twa_emoji_class = twa_emoji_class;
    if (!update) return;
    this.twa_emoji_class_back_face.set(this.pixle_twa_emoji_class);
  }
}
