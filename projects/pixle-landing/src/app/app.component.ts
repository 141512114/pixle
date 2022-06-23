import {Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HelperFunctionsService} from '../../../../local/typescript/abstract/services/helper-functions.service';
import {DOCUMENT} from '@angular/common';
import {IconDefinition} from '@fortawesome/free-brands-svg-icons';
import {faGear, faXmark} from '@fortawesome/free-solid-svg-icons';
import {SideMenuComponent} from '../../../../local/typescript/side-menu/side-menu.component';

export const STYLESHEETS_PATH: string = '../../stylesheets/css/';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../stylesheets/css/app.component.min.css']
})
export class AppComponent implements OnInit {
  iconOpenSideMenu: IconDefinition = faGear;
  iconCloseSideMenu: IconDefinition = faXmark;
  @ViewChild(SideMenuComponent) private sideMenuComponent!: SideMenuComponent;
  @ViewChild('toggle_side_menu_btn') private toggle_side_menu_btn!: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit() {
    // Get the stored theme data, if available, and "restore" the previous settings
    let previous_theme: string | null = null;
    if (HelperFunctionsService.isLocalStorageAvailable()) {
      previous_theme = localStorage.getItem('last_theme');
    } else {
      if (HelperFunctionsService.isSessionStorageAvailable()) {
        previous_theme = sessionStorage.getItem('last_theme');
      }
    }
    if (previous_theme != null) {
      this.document.body.dataset['theme'] = previous_theme;
    }
  }

  /**
   * Toggle (open or close) the side menu
   */
  public toggleSideMenu(): void {
    let side_menu_element: HTMLElement = this.sideMenuComponent.side_menu.nativeElement;
    let toggle_side_menu_element: HTMLElement = this.toggle_side_menu_btn.nativeElement;
    let show_class: string = 'toggle';

    if (this.sideMenuComponent.active) {
      this.sideMenuComponent.removeClassFromHTMLElement(side_menu_element);
      if (toggle_side_menu_element.classList.contains(show_class)) {
        toggle_side_menu_element.classList.remove(show_class);
      }
    } else {
      this.sideMenuComponent.addClassToHTMLElement(side_menu_element);
      if (!toggle_side_menu_element.classList.contains(show_class)) {
        toggle_side_menu_element.classList.add(show_class);
      }
    }
    this.sideMenuComponent.active = !this.sideMenuComponent.active;
  }
}
