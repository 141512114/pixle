import { Component, DOCUMENT, inject } from '@angular/core';
import * as CookieService from '@abstract/composables/cookies';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
})
export class ThemeSwitcherComponent {
  readonly themes: string[] = ['Neo', 'Vibe', 'Pop', 'Volcano', 'Cold', 'Troll'];
  private readonly document = inject(DOCUMENT);

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
