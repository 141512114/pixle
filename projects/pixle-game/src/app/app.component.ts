import {
  AfterViewInit,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { WINDOW } from '@typescript/window-injection.token';
import { HelperFunctionsService } from '@abstract/services/helper-functions.service';
import {
  faGear,
  faQuestionCircle,
  faXmark,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { SideMenuComponent } from '@typescript/side-menu/side-menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterOutlet } from '@angular/router';

export const SUPPORT_EMAIL: string = 'support@nani-games.net';

const COOLDOWN_TOUCH: number = 75;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, FontAwesomeModule, SideMenuComponent],
})
export class AppComponent implements OnInit, AfterViewInit {
  readonly iconOpenSideMenu: IconDefinition = faGear;
  readonly iconCloseSideMenu: IconDefinition = faXmark;
  readonly iconHelpGuide: IconDefinition = faQuestionCircle;
  isTouchTimer: number = -1;
  private readonly sideMenuComponent = viewChild.required(SideMenuComponent);
  private readonly toggle_side_menu_btn =
    viewChild.required<ElementRef<HTMLElement>>('toggle_side_menu_btn');
  private readonly document = inject(DOCUMENT);
  private readonly window = inject(WINDOW);

  constructor() {
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
    const sideMenuComponent = this.sideMenuComponent();
    const sideMenuElement = sideMenuComponent.side_menu().nativeElement;
    const toggleSideMenuElement = this.toggle_side_menu_btn().nativeElement;
    const showClass: string = 'toggle';

    if (sideMenuComponent.active) {
      sideMenuComponent.addClassToHTMLElement(sideMenuElement, 'close');
      if (toggleSideMenuElement.classList.contains(showClass)) {
        toggleSideMenuElement.classList.remove(showClass);
      }
    } else {
      sideMenuComponent.removeClassFromHTMLElement(sideMenuElement, 'close');
      if (!toggleSideMenuElement.classList.contains(showClass)) {
        toggleSideMenuElement.classList.add(showClass);
      }
    }
    sideMenuComponent.active = !sideMenuComponent.active;
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
    const bodyElement = this.document.body;
    if (
      this.hasTouch() === false ||
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
    this.isTouchTimer = this.window.setTimeout(() => {
      const bodyElement = this.document.body;
      if (!bodyElement.classList.contains('startTouch')) return;
      bodyElement.classList.remove('startTouch');
    }, COOLDOWN_TOUCH);
  }
}
