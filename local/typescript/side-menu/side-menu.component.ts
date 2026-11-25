import {
  Component,
  ElementRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractHtmlElement } from '@abstract/abstract.html-element';
import * as CookieService from '@abstract/composables/cookies';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  imports: [ThemeSwitcherComponent],
})
export class SideMenuComponent extends AbstractHtmlElement {
  active: boolean = false;
  public readonly side_menu =
    viewChild.required<ElementRef<HTMLElement>>('side_menu');

  public clearAllCookies(): void {
    CookieService.deleteCookie('cookie_consent');
    CookieService.deleteCookie('last_theme');
  }
}
