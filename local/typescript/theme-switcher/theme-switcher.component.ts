import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as CookieService from '@abstract/composables/cookies';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: [],
})
export class ThemeSwitcherComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  /**
   * Change theme of the game
   *
   * @param theme_name
   */
  public changeTheme(theme_name: string): void {
    this.document.body.dataset['theme'] = theme_name;
    CookieService.createCookie('last_theme', theme_name);
  }
}
