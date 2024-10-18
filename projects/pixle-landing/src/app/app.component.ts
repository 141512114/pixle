import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as CookieService from '@abstract/composables/cookies';
import { DOCUMENT } from '@angular/common';
import {
  faGear,
  faXmark,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { SideMenuComponent } from '@typescript/side-menu/side-menu.component';
import { IPopUp } from '@interface/popup-message.interface';
import { PopupMessageComponent } from '@typescript/popup-message/popup-message.component';

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
})
export class AppComponent implements OnInit, AfterViewInit {
  cookie_consent: boolean = false;
  iconOpenSideMenu: IconDefinition = faGear;
  iconCloseSideMenu: IconDefinition = faXmark;
  @ViewChild(SideMenuComponent) private sideMenuComponent!: SideMenuComponent;
  @ViewChild('cookie_alert') private cookie_alert!: PopupMessageComponent;
  @ViewChild('cookie_alert_html') private cookie_alert_html!: ElementRef;
  @ViewChild('toggle_side_menu_btn') private toggle_side_menu_btn!: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document) {
    CookieService.cookie_consent.subscribe((value) => {
      this.cookie_consent = value;
    });
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
    if (!this.cookie_consent) this.sendCookieAlert(COOKIE_NOTIF_MSG);
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
    const popupMsg: PopupMessageComponent = this.cookie_alert;
    popupMsg.writeNewMessage(msg_object);
    popupMsg.openPopup();
    this.openCookieAlert();
  }

  // noinspection DuplicatedCode
  /**
   * Toggle (open or close) the side menu
   */
  public toggleSideMenu(): void {
    const sideMenuElement = this.sideMenuComponent.side_menu
      .nativeElement as HTMLElement;
    const toggleSideMenuElement = this.toggle_side_menu_btn
      .nativeElement as HTMLElement;
    const showClass: string = 'toggle';

    if (this.sideMenuComponent.active) {
      this.sideMenuComponent.addClassToHTMLElement(sideMenuElement, 'close');
      if (toggleSideMenuElement.classList.contains(showClass)) {
        toggleSideMenuElement.classList.remove(showClass);
      }
    } else {
      this.sideMenuComponent.removeClassFromHTMLElement(
        sideMenuElement,
        'close',
      );
      if (!toggleSideMenuElement.classList.contains(showClass)) {
        toggleSideMenuElement.classList.add(showClass);
      }
    }
    this.sideMenuComponent.active = !this.sideMenuComponent.active;
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
    const element = this.cookie_alert_html.nativeElement as HTMLElement;
    if (!element.classList.contains('close')) return;
    element.classList.remove('close');
  }

  /**
   * Close the cookie alert on the landing page
   *
   * @private
   */
  private closeCookieAlert(): void {
    const element = this.cookie_alert_html.nativeElement as HTMLElement;
    if (element.classList.contains('close')) return;
    element.classList.add('close');
  }
}
