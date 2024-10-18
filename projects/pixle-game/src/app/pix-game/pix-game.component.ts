import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT, Location } from '@angular/common';
import { WINDOW } from '@typescript/window-injection.token';
import * as CookieService from '@abstract/composables/cookies';
import { GameManager } from './game.manager';
import { PopupMessageComponent } from '@typescript/popup-message/popup-message.component';
import { IPopUp } from '@interface/popup-message.interface';
import {
  FAILED_PIXLE_MSG,
  MISSING_PIXLE_MSG,
  SUCCESS_PIXLE_MSG,
} from './popup.messages';
import { PixGridUiComponent } from '../pix-grid-ui/pix-grid-ui.component';
import { PixGridComponent } from '../pix-grid/pix-grid.component';
import { PixGridElementComponent } from '../pix-grid-element/pix-grid-element.component';

// Cookie notification
const COOKIE_NOTIF_MSG: IPopUp = {
  headline: 'Cookie alert!',
  subline: '',
  message_body:
    'We are required to inform you about the usage of cookies on our web application. These are required' +
    ' and used to store information about the current match and applied game settings. Closing this notification means you agree with the usage of cookies.',
};

// Timer
const UNDO_FLIP_TIME: number = 1575;

@Component({
  selector: 'app-pix-game',
  templateUrl: './pix-game.component.html',
  styleUrls: ['./pix-game.component.scss'],
})
export class PixGameComponent implements OnInit, AfterViewInit {
  pixle_share_result: string = '';
  validating: boolean = false;
  cookie_consent: boolean = false;
  cookie_popup_is_closed: boolean = true;
  private countdown_start: any;
  @ViewChild('match_status') private match_status_msg!: PopupMessageComponent;
  @ViewChild('cookie_alert') private cookie_alert!: PopupMessageComponent;
  @ViewChild(PixGridComponent) private pixGridComponent!: PixGridComponent;
  @ViewChild(PixGridUiComponent)
  private pixGridUiComponent!: PixGridUiComponent;

  constructor(
    private router: Router,
    private location: Location,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private readonly window: Window,
  ) {
    CookieService.cookie_consent.subscribe((value) => {
      this.cookie_consent = value;
    });
  }

  /**
   * Initialize the game
   *
   * @private
   */
  private initGame(): void {
    // Check if a pixle image is available
    if (GameManager.pixle_image.length <= 0) {
      this.sendMatchMessage(MISSING_PIXLE_MSG);
      return;
    }

    /*
     * Start the game
     * Show the pixle at the beginning for a set duration
     * Hide it, if the timer is over
     */
    this.countdown_start = setTimeout(() => {
      GameManager.initGame();
      if (
        CookieService.getSessionCookie('lock_grid') === '1' &&
        CookieService.getSessionCookie('pixle_id') ===
          GameManager.pixle_id.toString()
      )
        return;
      // Undo flip --> Grid will be flipped over
      this.pixGridComponent.flipWholePixle(true);
      CookieService.createSessionCookie('lock_grid', '1');
      CookieService.createSessionCookie(
        'pixle_id',
        GameManager.pixle_id.toString(),
      );
    }, UNDO_FLIP_TIME);

    GameManager.game_reloaded = false;
  }

  ngOnInit(): void {
    // Check if a cookie has been created to skip the cookie notification
    const cookieConsentGiven: string | null =
      CookieService.getRawCookie('cookie_consent');
    let cookie_consent_bool = false;

    if (cookieConsentGiven) {
      cookie_consent_bool = this.parseCookieConsent(cookieConsentGiven);
    }
    this.cookie_popup_is_closed = cookie_consent_bool;

    // Notify cookie consent status via service
    CookieService.cookie_consent.next(cookie_consent_bool);

    // Get the stored theme data, if available, and "restore" the previous settings
    const previousTheme: string | null = CookieService.getCookie('last_theme');
    if (previousTheme != null) {
      this.document.body.dataset['theme'] = previousTheme;
    }
    GameManager.generatePixle();
  }

  ngAfterViewInit() {
    // If the consent has not been given to the usage of cookies --> show alert
    if (!this.cookie_consent && !this.cookie_popup_is_closed) {
      this.sendMatchMessage(COOKIE_NOTIF_MSG, this.cookie_alert);
      return;
    }
    this.initGame();
  }

  /**
   * Receive validation request from the ui
   */
  public receiveValidationRequest(): void {
    if (this.validating) return;
    this.validatePixle();
  }

  /**
   * Receive reload request
   */
  public async receiveReloadRequest(): Promise<void> {
    if (this.validating) return;
    const absolutePath: string = decodeURI(this.location.path());

    // Reload component --> redirect to same url but do not reuse old one
    GameManager.game_reloaded = await this.router
      .navigateByUrl('/', {
        skipLocationChange: false,
        state: { reload: Date.now() },
      })
      .then(() => {
        this.window.clearTimeout(this.countdown_start);
        GameManager.resetGame();
        this.router.navigateByUrl(absolutePath);
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }

  /**
   * Receive the emitted event which tells the game component if a popup has been closed
   *
   * @param paket
   */
  public receivePopupHasBeenClosed(paket: boolean = false): void {
    CookieService.cookie_consent.next(paket);
    this.cookie_popup_is_closed = this.cookie_alert.popup_is_closed;
    CookieService.createCookie('cookie_consent', String(paket));
    // Start the game
    this.initGame();
  }

  /**
   * Receive the current status of the ongoing match and evaluate the status number
   *
   * @param msg_object
   * @param popup_element
   */
  public sendMatchMessage(
    msg_object: IPopUp,
    popup_element: PopupMessageComponent = this.match_status_msg,
  ): void {
    const popupMsg: PopupMessageComponent = popup_element;
    popupMsg.writeNewMessage(msg_object);
    popupMsg.openPopup();
  }

  /**
   * Validate the pixle
   * Easy version: go through every tile and check its validity separately
   *
   * @private
   */
  private validatePixle(): void {
    if (
      !GameManager.game_started ||
      GameManager.pixle_solved ||
      this.validating
    )
      return;
    this.pixGridComponent.checkGridRowTimers();
    this.validating = true;

    const tempPixGridComps: PixGridElementComponent[] =
      this.pixGridComponent.pixle_emoji_input.toArray();
    let total_count: number = 0,
      failed_count: number = 0;
    // Check every pixle tile if its valid --> emoji at the exact same position as in the original pixle
    for (let i: number = 0; i < GameManager.pixle_image_height; i++) {
      let solved_tiles_count: number = 0;
      for (let j: number = 0; j < GameManager.pixle_image_width; j++) {
        const currentColumn: number = GameManager.pixle_image_width * i + j;
        let one_pixle_tile: PixGridElementComponent =
          tempPixGridComps[currentColumn];
        if (
          one_pixle_tile.twa_emoji_class_front_face !==
          GameManager.pixle_image[i][j]
        ) {
          one_pixle_tile.updateTileStatus(false);
          if (one_pixle_tile.pixle_tile_lives <= 0) {
            failed_count++;
          }
          continue;
        }
        one_pixle_tile.updateTileStatus(true);
        solved_tiles_count++;
      }
      total_count += solved_tiles_count;
    }
    // If any tile has reached its limits --> went out of lives --> game over
    if (failed_count > 0) {
      this.sendMatchMessage(FAILED_PIXLE_MSG);
      this.generateShareMessage();
      GameManager.resetGame();
    } else {
      // Player has won the game
      const tileAmount: number =
        GameManager.pixle_image_width * GameManager.pixle_image_height;
      if (total_count >= tileAmount) {
        GameManager.pixle_solved = true;
        GameManager.game_started = false;
        this.sendMatchMessage(SUCCESS_PIXLE_MSG);
        this.generateShareMessage();
      } else {
        // Player didn't win yet --> reset flip-state of some tiles
        this.window.setTimeout(() => {
          this.pixGridComponent.flipWholePixle(true);
          this.validating = false;
        }, UNDO_FLIP_TIME);
        return;
      }
    }
    this.pixGridUiComponent.switchUiElements();
    this.validating = false;
  }

  /**
   * Generate the share message
   *
   * @private
   */
  private generateShareMessage(): void {
    this.pixle_share_result = GameManager.generateShareMessage(
      this.pixGridComponent.pixle_emoji_input.toArray(),
    );
  }

  /**
   * Parse the value of the cookie consent storage item
   * Only boolean
   *
   * @param cookieConsent
   * @private
   */
  private parseCookieConsent(cookieConsent: string): boolean {
    try {
      // Parsing as boolean; if invalid, default to false
      return JSON.parse(cookieConsent.toLowerCase());
    } catch (error) {
      console.error('Error parsing cookie consent:', error);
      return false;
    }
  }

  protected readonly GameManager = GameManager;
}
