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
import { HelperFunctionsService } from '@abstract/services/helper-functions.service';
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
import {
  CODEPOINT_GREENSQUARE,
  CODEPOINT_ORANGESQUARE,
  CODEPOINT_REDSQUARE,
  CODEPOINT_YELLOWSQUARE,
} from '@typescript/emoji.database';

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
  private current_date: Date = new Date();
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
    HelperFunctionsService.cookie_consent.subscribe((value) => {
      this.cookie_consent = value;
    });
  }

  /**
   * Start the game
   * Show the pixle at the beginning for a set duration
   * Hide it, if the timer is over
   *
   * @private
   */
  private startGame(): void {
    this.countdown_start = setTimeout(() => {
      GameManager.initGame();
      if (
        HelperFunctionsService.getSessionCookie('lock_grid') === '1' &&
        HelperFunctionsService.getSessionCookie('pixle_id') ===
          GameManager.pixle_id.toString()
      )
        return;
      // Undo flip --> Grid will be flipped over
      this.pixGridComponent.flipWholePixle(true);
      HelperFunctionsService.createSessionCookie('lock_grid', '1');
      HelperFunctionsService.createSessionCookie(
        'pixle_id',
        GameManager.pixle_id.toString(),
      );
    }, UNDO_FLIP_TIME);
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
    this.startGame();
    GameManager.game_reloaded = false;
  }

  ngOnInit(): void {
    // Check if a cookie has been created to skip the cookie notification
    let cookie_consent_given: string | null =
      HelperFunctionsService.getRawCookie('cookie_consent');
    let cookie_consent_bool: boolean =
      cookie_consent_given === null
        ? false
        : JSON.parse(cookie_consent_given.toLowerCase());
    this.cookie_popup_is_closed = cookie_consent_bool;
    HelperFunctionsService.cookie_consent.next(cookie_consent_bool);
    // Get the stored theme data, if available, and "restore" the previous settings
    let previous_theme: string | null =
      HelperFunctionsService.getCookie('last_theme');
    if (previous_theme != null) {
      this.document.body.dataset['theme'] = previous_theme;
    }
    GameManager.generatePixle();

    HelperFunctionsService.addEventListenerToElement(
      this.window,
      'load',
      () => {
        if (!this.cookie_consent && !this.cookie_popup_is_closed) return;
        this.initGame();
      },
    );
  }

  ngAfterViewInit() {
    // If the consent has not been given to the usage of cookies --> show alert
    if (!this.cookie_consent && !this.cookie_popup_is_closed) {
      this.sendMatchMessage(COOKIE_NOTIF_MSG, this.cookie_alert);
      return;
    }
    if (GameManager.game_reloaded) {
      this.initGame();
    }
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
    let absolute_path: string = decodeURI(this.location.path());
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // Reload component --> redirect to same url but do not reuse old one
    GameManager.game_reloaded = await this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => {
        this.window.clearTimeout(this.countdown_start);
        this.router.navigated = false;
        GameManager.resetGame();
        // Reload the game component
        return this.router.navigate([absolute_path]);
      });
  }

  /**
   * Receive the emitted event which tells the game component if a popup has been closed
   *
   * @param paket
   */
  public receivePopupHasBeenClosed(paket: boolean = false): void {
    HelperFunctionsService.cookie_consent.next(paket);
    this.cookie_popup_is_closed = this.cookie_alert.popup_is_closed;
    HelperFunctionsService.createCookie('cookie_consent', String(paket));
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
    let popup_msg: PopupMessageComponent = popup_element;
    popup_msg.writeNewMessage(msg_object);
    popup_msg.openPopup();
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

    let temp_pix_grid_comps: PixGridElementComponent[] =
      this.pixGridComponent.pixle_emoji_input.toArray();
    let total_count: number = 0,
      failed_count: number = 0;
    // Check every pixle tile if its valid --> emoji at the exact same position as in the original pixle
    for (let i: number = 0; i < GameManager.pixle_image_height; i++) {
      let solved_tiles_count: number = 0;
      for (let j: number = 0; j < GameManager.pixle_image_width; j++) {
        let current_column: number = GameManager.pixle_image_width * i + j;
        let one_pixle_tile: PixGridElementComponent =
          temp_pix_grid_comps[current_column];
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
      let tile_amount: number =
        GameManager.pixle_image_width * GameManager.pixle_image_height;
      if (total_count >= tile_amount) {
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
    let pixle_title: string = 'Pixle';
    let pixle_details: string =
      GameManager.pixle_id +
      '/' +
      GameManager.pixle_image_width +
      '/' +
      GameManager.pixle_image_height;
    let share_result: string[] = this.generatePixleStatusMap();
    let pixle_status_map: string = '';
    for (let i = 0; i < share_result.length; i++) {
      let one_pixle_tile: string = pixle_status_map + share_result[i];
      if ((i + 1) % GameManager.pixle_image_width === 0) {
        pixle_status_map = one_pixle_tile + '\n';
      } else {
        pixle_status_map = one_pixle_tile;
      }
    }
    this.pixle_share_result =
      pixle_title + '\n\n' + pixle_status_map + '\n\n' + pixle_details;
  }

  /**
   * Generate a status map after solving a pixle or just finishing a match
   * The status map displays the lives left on each tile of a pixle
   *
   * @return {string[]} Generated message
   * @private
   */
  private generatePixleStatusMap(): string[] {
    let grid_elements_array: PixGridElementComponent[] =
      this.pixGridComponent.pixle_emoji_input.toArray();
    let pixle_status_map: string[] = [];
    for (let i: number = 0; i < grid_elements_array.length; i++) {
      switch (grid_elements_array[i].pixle_tile_lives) {
        case 0:
          pixle_status_map.push(String.fromCodePoint(CODEPOINT_REDSQUARE));
          break;
        case 1:
          pixle_status_map.push(String.fromCodePoint(CODEPOINT_ORANGESQUARE));
          break;
        case 2:
          pixle_status_map.push(String.fromCodePoint(CODEPOINT_YELLOWSQUARE));
          break;
        case 3:
        default:
          pixle_status_map.push(String.fromCodePoint(CODEPOINT_GREENSQUARE));
          break;
      }
    }
    return pixle_status_map;
  }

  protected readonly GameManager = GameManager;
}
