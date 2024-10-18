import {
  ViewChild,
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '@typescript/window-injection.token';
import { HelperFunctionsService } from '@abstract/services/helper-functions.service';
import {
  faGear,
  faQuestionCircle,
  faXmark,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { SideMenuComponent } from '@typescript/side-menu/side-menu.component';

export const SUPPORT_EMAIL: string = 'support@nani-games.net';

const COOLDOWN_TOUCH: number = 75;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  iconOpenSideMenu: IconDefinition = faGear;
  iconCloseSideMenu: IconDefinition = faXmark;
  iconHelpGuide: IconDefinition = faQuestionCircle;
  isTouchTimer: any;
  @ViewChild(SideMenuComponent) private sideMenuComponent!: SideMenuComponent;
  @ViewChild('toggle_side_menu_btn') private toggle_side_menu_btn!: ElementRef;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private readonly window: Window,
  ) {
    this.addViewportHeightProperty();
  }

  ngOnInit() {
    // Add several event listeners, which help detect touch input
    HelperFunctionsService.addEventListenerToElement(
      this.window,
      'touchstart',
      () => {
        this.addTouchClass();
      },
    );
    ['mouseover', 'touchend', 'touchcancel'].forEach((event) => {
      HelperFunctionsService.addEventListenerToElement(
        this.window,
        event,
        () => {
          this.removeTouchClass();
        },
      );
    });
  }

  ngAfterViewInit() {
    // Calculate viewport height --> alternative to css vh unit
    HelperFunctionsService.addEventListenerToElement(
      this.window,
      'resize',
      () => {
        this.addViewportHeightProperty();
      },
    );
  }

  // noinspection DuplicatedCode
  /**
   * Toggle (open or close) the side menu
   */
  public toggleSideMenu(): void {
    const sideMenuElement = this.sideMenuComponent.side_menu
      .nativeElement as HTMLElement;
    const toggleSideMenuElement = this.toggle_side_menu_btn
      .nativeElement as HTMLElement;
    const showClass: string = 'toggle';

    if (this.sideMenuComponent.active) {
      this.sideMenuComponent.addClassToHTMLElement(sideMenuElement, 'close');
      if (toggleSideMenuElement.classList.contains(showClass)) {
        toggleSideMenuElement.classList.remove(showClass);
      }
    } else {
      this.sideMenuComponent.removeClassFromHTMLElement(
        sideMenuElement,
        'close',
      );
      if (!toggleSideMenuElement.classList.contains(showClass)) {
        toggleSideMenuElement.classList.add(showClass);
      }
    }
    this.sideMenuComponent.active = !this.sideMenuComponent.active;
  }

  /**
   * Add a css property / variable which will "replace" the css unit vh
   * Using this variable is much more reliable and mobile-friendly
   *
   * @private
   */
  private addViewportHeightProperty(): void {
    const vh: number = this.window.innerHeight * 0.01;
    this.document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  /**
   * Determine if device is touch-capable
   * true - device is touch-capable
   * false - device is not touch-capable
   * null - unable to determine touch capability
   *
   * @return {null|boolean}
   */
  private hasTouch(): boolean | null {
    if (typeof this.window.matchMedia !== 'undefined') {
      return this.window.matchMedia('(hover: none)').matches;
    }
    return null;
  }

  /**
   * Add a touch indicator class to the body element
   *
   * @private
   */
  private addTouchClass(): void {
    this.window.clearTimeout(this.isTouchTimer);
    const bodyElement = this.document.body as HTMLElement;
    if (
      this.hasTouch() === false ||
      null ||
      bodyElement.classList.contains('startTouch')
    )
      return;
    bodyElement.classList.add('startTouch');
  }

  /**
   * Remove the touch indicator class from the body element
   *
   * @private
   */
  private removeTouchClass(): void {
    this.isTouchTimer = setTimeout(() => {
      const bodyElement = this.document.body as HTMLElement;
      if (!bodyElement.classList.contains('startTouch')) return;
      bodyElement.classList.remove('startTouch');
    }, COOLDOWN_TOUCH);
  }
}
