import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {STYLESHEETS_PATH} from '../app.component';

@Component({
  selector: 'app-pix-side-menu',
  templateUrl: './pix-side-menu.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-side-menu.component.css']
})
export class PixSideMenuComponent {
  @ViewChild('side_menu') private side_menu!: ElementRef;
  @Output() public sendThemeData: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Receive and set the theme
   *
   * @param theme_name
   */
  public receiveThemeData(theme_name: string): void {
    this.sendThemeData.emit(theme_name);
  }

  /**
   * Open the side menu
   */
  public openSideMenu(): void {
    let side_menu_element: HTMLElement = this.side_menu.nativeElement;
    if (side_menu_element.classList.contains('close')) {
      side_menu_element.classList.remove('close');
    }
  }

  /**
   * Close the side menu
   */
  public closeSideMenu(): void {
    let side_menu_element: HTMLElement = this.side_menu.nativeElement;
    if (!side_menu_element.classList.contains('close')) {
      side_menu_element.classList.add('close');
    }
  }
}
