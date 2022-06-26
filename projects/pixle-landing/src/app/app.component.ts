import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HelperFunctionsService} from '../../../../local/typescript/abstract/services/helper-functions.service';
import {DOCUMENT} from '@angular/common';
import {IconDefinition} from '@fortawesome/free-brands-svg-icons';
import {faGear, faXmark} from '@fortawesome/free-solid-svg-icons';
import {SideMenuComponent} from '../../../../local/typescript/side-menu/side-menu.component';
import {IPopUp} from '../../../../local/typescript/interface/popup-message.interface';
import {PopupMessageComponent} from '../../../../local/typescript/popup-message/popup-message.component';

export const STYLESHEETS_PATH: string = '../../stylesheets/css/';

// Cookie notification
const COOKIE_NOTIF_MSG: IPopUp = {
  headline: 'Cookie alert!',
  subline: '',
  message_body: 'We are required to inform you about the usage of cookies on our website. These are required' +
    ' and used in order to save applied settings. Closing this notification means you agree with the usage of cookies.'
};

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../stylesheets/css/app.component.min.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  cookie_consent: boolean = false;
  cookie_popup_is_closed: boolean = false;
  iconOpenSideMenu: IconDefinition = faGear;
  iconCloseSideMenu: IconDefinition = faXmark;
  @ViewChild(SideMenuComponent) private sideMenuComponent!: SideMenuComponent;
  @ViewChild('cookie_alert') private cookie_alert!: PopupMessageComponent;
  @ViewChild('toggle_side_menu_btn') private toggle_side_menu_btn!: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit() {
    // Get the stored theme data, if available, and "restore" the previous settings
    let previous_theme: string | null = HelperFunctionsService.getCookie('last_theme');
    if (previous_theme != null) {
      this.document.body.dataset['theme'] = previous_theme;
    }
    // Check if the consent to the cookie usage has already been given
    if (HelperFunctionsService.getCookie('cookie_consent') === '1') {
      this.cookie_consent = true;
      HelperFunctionsService.cookie_consent = this.cookie_consent;
    }
  }

  ngAfterViewInit() {
    if (!this.cookie_consent) {
      this.sendMatchMessage(COOKIE_NOTIF_MSG);
    }
  }

  /**
   * Receive the emitted event which tells the game component if a popup has been closed
   *
   * @param paket
   */
  public receivePopupHasBeenClosed(paket: boolean = false): void {
    this.cookie_consent = paket;
    HelperFunctionsService.cookie_consent = paket;
    this.cookie_popup_is_closed = this.cookie_alert.popup_is_closed;
    HelperFunctionsService.createCookie('cookie_consent', '1');
  }

  /**
   * Receive the current status of the ongoing match and evaluate the status number
   *
   * @param msg_object
   */
  public sendMatchMessage(msg_object: IPopUp): void {
    let popup_msg: PopupMessageComponent = this.cookie_alert;
    popup_msg.writeNewMessage(msg_object);
    popup_msg.openPopup();
  }

  /**
   * Toggle (open or close) the side menu
   */
  public toggleSideMenu(): void {
    let side_menu_element: HTMLElement = this.sideMenuComponent.side_menu.nativeElement;
    let toggle_side_menu_element: HTMLElement = this.toggle_side_menu_btn.nativeElement;
    let show_class: string = 'toggle';

    if (this.sideMenuComponent.active) {
      this.sideMenuComponent.removeClassFromHTMLElement(side_menu_element);
      if (toggle_side_menu_element.classList.contains(show_class)) {
        toggle_side_menu_element.classList.remove(show_class);
      }
    } else {
      this.sideMenuComponent.addClassToHTMLElement(side_menu_element);
      if (!toggle_side_menu_element.classList.contains(show_class)) {
        toggle_side_menu_element.classList.add(show_class);
      }
    }
    this.sideMenuComponent.active = !this.sideMenuComponent.active;
  }
}
