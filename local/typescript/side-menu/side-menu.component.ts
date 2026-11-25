import {
  Component,
  ElementRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractHtmlElement } from '@abstract/abstract.html-element';
import * as CookieService from '@abstract/composables/cookies';
import { PIXLE_LINKS, PIXLE_REPOSITORY_URL } from '@typescript/pixle-links';
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
  readonly links = PIXLE_LINKS;
  readonly repository_url = PIXLE_REPOSITORY_URL;
  public readonly side_menu =
    viewChild.required<ElementRef<HTMLElement>>('side_menu');

  public clearAllCookies(): void {
    CookieService.deleteCookie('cookie_consent');
    CookieService.deleteCookie('last_theme');
  }
}
