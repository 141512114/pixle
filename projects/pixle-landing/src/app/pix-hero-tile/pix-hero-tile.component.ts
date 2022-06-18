import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {STYLESHEETS_PATH} from '../app.component';
import {WHITE_QUESTIONMARK} from '../../../../../local/typescript/emoji.database';
import {AbstractHtmlElement} from '../../../../../local/typescript/abstract/abstract.html-element';

@Component({
  selector: 'app-pix-hero-tile',
  templateUrl: './pix-hero-tile.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-hero-tile.component.min.css']
})
export class PixHeroTileComponent extends AbstractHtmlElement implements OnInit, AfterViewInit {
  @Input() pixle_emoji: number = -1;
  pixle_emoji_text: string = '';
  pixle_emoji_codepoint: number = -1;
  pixle_emoji_default: number = WHITE_QUESTIONMARK;
  pixle_front_face_emoji: string = '';
  pixle_tile_timer: any = -1;
  @ViewChild('tile_content_wrapper') private tile_content_wrapper!: ElementRef;
  @ViewChild('display_emoji') private display_emoji!: ElementRef;
  private do_flip_class: any = 'do-flip';

  constructor() {
    super()
  }

  ngOnInit(): void {
    this.pixle_front_face_emoji = String.fromCodePoint(this.pixle_emoji_default);
  }

  ngAfterViewInit(): void {
    this.setElementIcon(this.pixle_emoji, true);
    ['mouseenter', 'touchstart'].forEach(event => {
      this.tile_content_wrapper.nativeElement.addEventListener(event, () => {
        this.doFlip();
        clearTimeout(this.pixle_tile_timer);
      }, false);
    });
    ['mouseleave', 'touchend', 'touchcancel'].forEach(event => {
      this.tile_content_wrapper.nativeElement.addEventListener(event, () => {
        this.pixle_tile_timer = setTimeout(() => {
          this.undoFlip();
        }, 350);
      }, false);
    });
  }

  /**
   * Flip grid element
   */
  public doFlip(): void {
    let element: HTMLElement = this.tile_content_wrapper.nativeElement;
    this.removeClassFromHTMLElement(element, this.do_flip_class);
  }

  /**
   * Reverse flipped grid element
   */
  public undoFlip(): void {
    let element: HTMLElement = this.tile_content_wrapper.nativeElement;
    this.addClassToHTMLElement(element, this.do_flip_class);
  }

  /**
   * Change the grid elements icon
   *
   * @param emoji_codepoint
   * @param update
   * @private
   */
  private setElementIcon(emoji_codepoint: number = -1, update: boolean = false): void {
    if (emoji_codepoint === -1 || (emoji_codepoint !== -1 && this.pixle_emoji_codepoint === emoji_codepoint)) return;
    this.pixle_emoji_text = String.fromCodePoint(emoji_codepoint);
    this.pixle_emoji_codepoint = emoji_codepoint;
    if (!update) return;
    this.updateElementViewIcon();
  }

  /**
   * Update the icon shown to the player
   *
   * @private
   */
  private updateElementViewIcon(): void {
    if (this.display_emoji == undefined) return;
    let icon_element = this.display_emoji.nativeElement.querySelector('.emoji');
    icon_element.textContent = this.pixle_emoji_text;
  }
}
