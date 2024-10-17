import {Component, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {HelperFunctionsService} from '@abstract/services/helper-functions.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: []
})
export class ThemeSwitcherComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  /**
   * Change theme of the game
   *
   * @param theme_name
   */
  public changeTheme(theme_name: string): void {
    this.document.body.dataset['theme'] = theme_name;
    HelperFunctionsService.createCookie('last_theme', theme_name);
  }
}
