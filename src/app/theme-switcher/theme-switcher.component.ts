import {Component, ElementRef, EventEmitter, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['../../stylesheets/css/theme-switcher.component.min.css']
})
export class ThemeSwitcherComponent {
  @ViewChild('open_themes') private open_themes_button!: ElementRef;
  @ViewChildren('theme_item') private theme_items!: QueryList<ElementRef>;
  @Output() public sendThemeData: EventEmitter<string> = new EventEmitter<string>();

  show_themes: boolean = false;

  /**
   * Change theme of the game
   *
   * @param theme_name
   */
  public changeTheme(theme_name: string): void {
    this.sendThemeData.emit(theme_name);
  }

  /**
   * Toggle the themes' sidebar
   * !! Only on mobile !!
   */
  public toggleThemesSidebar(): void {
    this.show_themes = !this.show_themes;

    let select_class: string = 'selected';
    let toggle_button: HTMLElement = this.open_themes_button.nativeElement;
    if (!this.show_themes) {
      if (toggle_button.classList.contains(select_class)) {
        toggle_button.classList.remove(select_class);
      }
    } else {
      if (!toggle_button.classList.contains(select_class)) {
        toggle_button.classList.add(select_class);
      }
    }

    this.toggleThemeItems();
  }

  /**
   * Toggle the themes' sidebar items on or off
   *
   * @private
   */
  private toggleThemeItems(): void {
    let hide_theme_class: string = 'hide-theme';
    let theme_items_array: ElementRef[] = this.theme_items.toArray();
    for (let i = 0; i < theme_items_array.length; i++) {
      let current_item: HTMLElement = theme_items_array[i].nativeElement;
      if (this.show_themes) {
        if (current_item.classList.contains(hide_theme_class)) {
          current_item.classList.remove(hide_theme_class);
        }
      } else {
        if (!current_item.classList.contains(hide_theme_class)) {
          current_item.classList.add(hide_theme_class);
        }
      }
    }
  }
}
