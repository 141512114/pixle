import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractHtmlElement } from '@abstract/abstract.html-element';
import * as CookieService from '@abstract/composables/cookies';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent extends AbstractHtmlElement {
  active: boolean = false;
  @ViewChild('side_menu') public side_menu!: ElementRef;

  public clearAllCookies(): void {
    CookieService.deleteCookie('cookie_consent');
    CookieService.deleteCookie('last_theme');
  }
}
