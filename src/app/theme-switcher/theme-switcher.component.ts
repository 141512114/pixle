import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['../../stylesheets/css/theme-switcher.component.min.css']
})
export class ThemeSwitcherComponent {
  @Output() public sendThemeData: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Change theme of the game
   *
   * @param theme_name
   */
  public changeTheme(theme_name: string): void {
    this.sendThemeData.emit(theme_name);
  }
}
