import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {WINDOW} from './window-injection.token';
import {PixSideMenuComponent} from './pix-side-menu/pix-side-menu.component';

export const STYLESHEETS_PATH: string = '../../stylesheets/css/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../stylesheets/css/app.component.min.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild(PixSideMenuComponent) private pixSideMenuComponent!: PixSideMenuComponent;

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private readonly window: Window) {
    this.addViewportHeightProperty();
  }

  ngAfterViewInit() {
    // Calculate viewport height --> alternative to css vh unit
    this.window.addEventListener('resize', () => {
      this.addViewportHeightProperty();
    });
  }

  /**
   * Open the side menu
   */
  public openSideMenu(): void {
    this.pixSideMenuComponent.openSideMenu();
  }

  /**
   * Add a css property / variable which will "replace" the css unit vh
   * Using this variable is much more reliable and mobile-friendly
   *
   * @private
   */
  private addViewportHeightProperty(): void {
    let vh = this.window.innerHeight * 0.01;
    this.document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
