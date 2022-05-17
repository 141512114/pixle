import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: []
})
export class ThemeSwitcherComponent {
  @Output() public sendThemeData: EventEmitter<string> = new EventEmitter<string>();

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  /**
   * Change theme of the game
   *
   * @param theme_name
   */
  public changeTheme(theme_name: string): void {
    this.document.body.dataset['theme'] = theme_name;
    // Save the selected theme also to the local storage (cache?)
    localStorage.setItem('last_theme', theme_name);
  }
}
