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

// Cookie notification
const COOKIE_NOTIF_MSG: IPopUp = {
  headline: 'Cookie alert!',
  subline: '',
  message_body:
    'We are required to inform you about the usage of cookies on our website. These are required' +
    ' and used in order to save applied settings. Closing this notification means you agree with the usage of cookies.',
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
      this.document.body.dataset['theme'] = previous_theme;
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
    const sideMenuElement = sideMenuComponent.side_menu().nativeElement;
    const toggleSideMenuElement = this.toggle_side_menu_btn().nativeElement;
    const showClass: string = 'toggle';

    if (sideMenuComponent.active) {
      sideMenuComponent.addClassToHTMLElement(sideMenuElement, 'close');
      if (toggleSideMenuElement.classList.contains(showClass)) {
        toggleSideMenuElement.classList.remove(showClass);
      }
    } else {
      sideMenuComponent.removeClassFromHTMLElement(
        sideMenuElement,
        'close',
      );
      if (!toggleSideMenuElement.classList.contains(showClass)) {
        toggleSideMenuElement.classList.add(showClass);
      }
    }
    sideMenuComponent.active = !sideMenuComponent.active;
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
