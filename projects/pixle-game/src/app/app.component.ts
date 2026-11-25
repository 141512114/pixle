import {
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { WINDOW } from '@typescript/window-injection.token';
import {
  faGear,
  faQuestionCircle,
  faXmark,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { SideMenuComponent } from '@typescript/side-menu/side-menu.component';
import { PIXLE_LINKS } from '@typescript/pixle-links';
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
export class AppComponent {
  readonly links = PIXLE_LINKS;
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
    // Detect touch input. Native listeners: they only toggle a body class, so no change
    // detection is needed; the root component lives as long as the page.
    const passive = { passive: true };
    this.window.addEventListener('touchstart', () => this.addTouchClass(), passive);
    for (const event of ['mouseover', 'touchend', 'touchcancel']) {
      this.window.addEventListener(event, () => this.removeTouchClass(), passive);
    }
  }

  // noinspection DuplicatedCode
  /**
   * Toggle (open or close) the side menu
   */
  public toggleSideMenu(): void {
    const sideMenuComponent = this.sideMenuComponent();
    const active = !sideMenuComponent.active;
    sideMenuComponent.side_menu().nativeElement.classList.toggle('close', !active);
    this.toggle_side_menu_btn().nativeElement.classList.toggle('toggle', active);
    sideMenuComponent.active = active;
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
   */
  private addTouchClass(): void {
    this.window.clearTimeout(this.isTouchTimer);
    if (this.hasTouch() === false) return;
    this.document.body.classList.add('startTouch');
  }

  /**
   * Remove the touch indicator class from the body element
   */
  private removeTouchClass(): void {
    this.isTouchTimer = this.window.setTimeout(() => {
      this.document.body.classList.remove('startTouch');
    }, COOLDOWN_TOUCH);
  }
}
