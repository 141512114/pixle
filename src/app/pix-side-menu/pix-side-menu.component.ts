import {Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {STYLESHEETS_PATH} from '../app.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-pix-side-menu',
  templateUrl: './pix-side-menu.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-side-menu.component.css']
})
export class PixSideMenuComponent {
  @ViewChild('side_menu') private side_menu!: ElementRef;
  @Output() public sendThemeData: EventEmitter<string> = new EventEmitter<string>();

  active: boolean = false;

  /**
   * Open the side menu
   */
  public openSideMenu(): void {
    let side_menu_element: HTMLElement = this.side_menu.nativeElement;
    if (side_menu_element.classList.contains('close')) {
      side_menu_element.classList.remove('close');
      this.active = true;
    }
  }

  /**
   * Close the side menu
   */
  public closeSideMenu(): void {
    let side_menu_element: HTMLElement = this.side_menu.nativeElement;
    if (!side_menu_element.classList.contains('close')) {
      side_menu_element.classList.add('close');
      this.active = false;
    }
  }
}
