import {
  AfterViewInit,
  Component,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import * as CookieService from '@abstract/composables/cookies';
import { applyTheme } from '@typescript/theme';
import {
  faGear,
  faXmark,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { SideMenuComponent } from '@typescript/side-menu/side-menu.component';
import { PIXLE_LINKS } from '@typescript/pixle-links';
import { IPopUp } from '@interface/popup-message.interface';
import { PopupMessageComponent } from '@typescript/popup-message/popup-message.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterOutlet } from '@angular/router';
import { WINDOW } from '@typescript/window-injection.token';
import { getPixleCountdown } from './pixle-countdown';

// Storage notice: describes exactly what is stored (see local/typescript/abstract/composables/cookies.ts)
const COOKIE_NOTIF_MSG: IPopUp = {
  headline: 'Saving your settings',
  message_body:
    "Pixle doesn't use cookies or tracking. If you agree, it keeps your theme and this choice " +
    "in your browser's storage. If you decline, they are forgotten as soon as you close the tab.",
};

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    SideMenuComponent,
    PopupMessageComponent,
    FontAwesomeModule,
  ],
  // Host listener: removed automatically when the component is destroyed
  host: { '(window:scroll)': 'updateNavbarVisibility()' },
})
export class AppComponent implements OnInit, AfterViewInit {
  readonly cookie_consent = toSignal(CookieService.cookie_consent, {
    requireSync: true,
  });
  readonly links = PIXLE_LINKS;
  readonly iconOpenSideMenu: IconDefinition = faGear;
  readonly iconCloseSideMenu: IconDefinition = faXmark;
  private readonly sideMenuComponent = viewChild.required(SideMenuComponent);
  private readonly cookie_alert =
    viewChild.required<PopupMessageComponent>('cookie_alert');
  private readonly cookie_alert_html =
    viewChild.required<ElementRef<HTMLElement>>('cookie_alert_html');
  private readonly toggle_side_menu_btn =
    viewChild.required<ElementRef<HTMLElement>>('toggle_side_menu_btn');
  readonly countdown = signal(getPixleCountdown());
  // The navbar appears once the player has scrolled past the welcome section
  readonly navbar_visible = signal<boolean>(false);
  private readonly document = inject(DOCUMENT);
  private readonly window = inject(WINDOW);

  constructor() {
    const timer = this.window.setInterval(
      () => this.countdown.set(getPixleCountdown()),
      1000,
    );
    inject(DestroyRef).onDestroy(() => this.window.clearInterval(timer));
  }

  public updateNavbarVisibility(): void {
    const welcome = this.document.getElementById('welcome');
    if (welcome == null) return;
    this.navbar_visible.set(
      this.window.scrollY > welcome.offsetTop + welcome.offsetHeight,
    );
  }

  ngOnInit() {
    // Check if the consent to cookie usage has been given
    const cookieConsentGiven = CookieService.getRawCookie('cookie_consent');
    let cookie_consent_bool = false;

    if (cookieConsentGiven) {
      cookie_consent_bool = this.parseCookieConsent(cookieConsentGiven);
    }

    // Notify cookie consent status via service
    CookieService.cookie_consent.next(cookie_consent_bool);

    // Get the stored theme data, if available, and "restore" the previous settings
    const previous_theme: string | null = CookieService.getCookie('last_theme');
    if (previous_theme != null) {
      applyTheme(this.document, previous_theme);
    }
  }

  ngAfterViewInit() {
    if (!this.cookie_consent()) this.sendCookieAlert(COOKIE_NOTIF_MSG);
  }

  /**
   * Receive the emitted event which tells the game component if a popup has been closed
   *
   * @param paket
   */
  public receivePopupHasBeenClosed(paket: boolean = false): void {
    this.closeCookieAlert();
    CookieService.cookie_consent.next(paket);
    CookieService.createCookie('cookie_consent', String(paket));
  }

  /**
   * Open and show the user the cookie alert
   *
   * @param msg_object
   */
  public sendCookieAlert(msg_object: IPopUp): void {
    const popupMsg: PopupMessageComponent = this.cookie_alert();
    popupMsg.writeNewMessage(msg_object);
    popupMsg.openPopup();
    this.openCookieAlert();
  }

  // noinspection DuplicatedCode
  /**
   * Toggle (open or close) the side menu
   */
  public toggleSideMenu(): void {
    const sideMenuComponent = this.sideMenuComponent();
    const active = !sideMenuComponent.active;
    sideMenuComponent.side_menu().nativeElement.classList.toggle('close', !active);
    this.toggle_side_menu_btn().nativeElement.classList.toggle('toggle', active);
    sideMenuComponent.active = active;
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

  /**
   * Open the cookie alert on the landing page
   *
   * @private
   */
  private openCookieAlert(): void {
    const element = this.cookie_alert_html().nativeElement;
    if (!element.classList.contains('close')) return;
    element.classList.remove('close');
  }

  /**
   * Close the cookie alert on the landing page
   *
   * @private
   */
  private closeCookieAlert(): void {
    const element = this.cookie_alert_html().nativeElement;
    if (element.classList.contains('close')) return;
    element.classList.add('close');
  }
}
