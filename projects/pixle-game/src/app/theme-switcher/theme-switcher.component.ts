import {Component, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {HelperFunctionsService} from '../abstract/services/helper-functions.service';

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
    if (HelperFunctionsService.isLocalStorageAvailable()) {
      // Save the selected theme also to the local storage (cache?)
      localStorage.setItem('last_theme', theme_name);
    } else {
      sessionStorage.setItem('last_theme', theme_name);
    }
  }
}
