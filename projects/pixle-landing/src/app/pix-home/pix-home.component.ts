import { Component, DOCUMENT, inject } from '@angular/core';
import { PIXLE_LINKS } from '@typescript/pixle-links';
import { PixHeroGridComponent } from '../pix-hero-grid/pix-hero-grid.component';

const SUPPORT_EMAIL: string = 'support@nani-games.net';

@Component({
  selector: 'app-pix-home',
  templateUrl: './pix-home.component.html',
  styleUrls: ['./pix-home.component.scss'],
  imports: [PixHeroGridComponent],
})
export class PixHomeComponent {
  support_email: string = SUPPORT_EMAIL;
  readonly links = PIXLE_LINKS;
  private readonly document = inject(DOCUMENT);

  /**
   * Scroll to the how-to guide (the space for the navbar is reserved via scroll-margin-top)
   */
  public scrollToHowToGuide(): void {
    this.document
      .getElementById('how-to-play')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
