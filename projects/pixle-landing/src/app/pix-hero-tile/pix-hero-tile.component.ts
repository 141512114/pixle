import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { WHITE_QUESTIONMARK } from '@typescript/emoji.database';

// Delay before a tile turns back after the pointer has left it
const UNDO_FLIP_DELAY: number = 350;

@Component({
  selector: 'app-pix-hero-tile',
  templateUrl: './pix-hero-tile.component.html',
  styleUrls: ['./pix-hero-tile.component.scss'],
})
export class PixHeroTileComponent {
  readonly pixle_emoji = input<string>('');
  readonly pixle_emoji_default: string = WHITE_QUESTIONMARK;
  readonly flipped = signal<boolean>(false);
  private undo_flip_timer: number = -1;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.undo_flip_timer));
  }

  /**
   * Flip the tile and reveal its emoji
   */
  public doFlip(): void {
    clearTimeout(this.undo_flip_timer);
    this.flipped.set(true);
  }

  /**
   * Turn the tile back after a short delay
   */
  public undoFlip(): void {
    this.undo_flip_timer = window.setTimeout(
      () => this.flipped.set(false),
      UNDO_FLIP_DELAY,
    );
  }
}
