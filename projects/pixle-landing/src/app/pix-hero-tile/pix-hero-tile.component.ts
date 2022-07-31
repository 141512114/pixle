import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {STYLESHEETS_PATH} from '../app.component';
import {WHITE_QUESTIONMARK} from '@typescript/emoji.database';
import {AbstractHtmlElement} from '@abstract/abstract.html-element';
import {HelperFunctionsService} from '@abstract/services/helper-functions.service';

@Component({
  selector: 'app-pix-hero-tile',
  templateUrl: './pix-hero-tile.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-hero-tile.component.min.css']
})
export class PixHeroTileComponent extends AbstractHtmlElement implements OnInit, AfterViewInit {
  @Input() pixle_emoji: string = '';
  pixle_twa_emoji_class: string = '';
  pixle_emoji_default: string = WHITE_QUESTIONMARK;
  twa_emoji_class_back_face: string = this.pixle_emoji_default;
  pixle_tile_timer: any = -1;
  @ViewChild('tile_content_wrapper') private tile_content_wrapper!: ElementRef;
  @ViewChild('display_emoji') private display_emoji!: ElementRef;
  private do_flip_class: any = 'do-flip';

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.setElementIcon(this.pixle_emoji, true);
    ['mouseenter', 'touchstart'].forEach(event => {
      HelperFunctionsService.addEventListenerToElement(this.tile_content_wrapper.nativeElement, event, () => {
        this.doFlip();
        clearTimeout(this.pixle_tile_timer);
      });
    });
    ['mouseleave', 'touchend', 'touchcancel'].forEach(event => {
      HelperFunctionsService.addEventListenerToElement(this.tile_content_wrapper.nativeElement, event, () => {
        this.pixle_tile_timer = setTimeout(() => {
          this.undoFlip();
        }, 350);
      });
    });
  }

  /**
   * Flip grid element
   */
  public doFlip(): void {
    let element: HTMLElement = this.tile_content_wrapper.nativeElement;
    this.addClassToHTMLElement(element, this.do_flip_class);
  }

  /**
   * Reverse flipped grid element
   */
  public undoFlip(): void {
    let element: HTMLElement = this.tile_content_wrapper.nativeElement;
    this.removeClassFromHTMLElement(element, this.do_flip_class);
  }

  /**
   * Change the grid elements icon
   *
   * @param twa_emoji_class
   * @param update
   * @private
   */
  private setElementIcon(twa_emoji_class: string = '', update: boolean = false): void {
    if (twa_emoji_class === '' || (twa_emoji_class !== '' && this.pixle_twa_emoji_class === twa_emoji_class)) return;
    this.pixle_twa_emoji_class = twa_emoji_class;
    if (!update) return;
    this.twa_emoji_class_back_face = this.pixle_twa_emoji_class;
  }
}
