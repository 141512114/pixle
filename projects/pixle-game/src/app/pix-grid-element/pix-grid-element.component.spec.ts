import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixGridElementComponent } from './pix-grid-element.component';
import { GameManager } from '../pix-game/game.manager';

describe('PixGridElementComponent', () => {
  let component: PixGridElementComponent;
  let fixture: ComponentFixture<PixGridElementComponent>;

  async function create(type: number, emoji: string) {
    fixture = TestBed.createComponent(PixGridElementComponent);
    fixture.componentRef.setInput('grid_element_type', type);
    fixture.componentRef.setInput('pixle_emoji', emoji);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  function face(name: 'front-face' | 'back-face'): string | undefined {
    const element: HTMLElement = fixture.nativeElement;
    return element.querySelector(`.${name} i`)?.className;
  }

  afterEach(() => {
    GameManager.resetGame();
  });

  it('shows a question mark on a receiver tile', async () => {
    await create(0, 'twa-red-heart');
    expect(face('front-face')).toContain('twa-white-question-mark');
  });

  // Regression: without zone.js, changes made from native event listeners
  // and timers must still reach the DOM
  it('renders the chosen emoji when the tile is clicked', async () => {
    await create(0, 'twa-red-heart');
    GameManager.chosen_emoji = 'twa-blue-heart';

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('.component-pix-grid-element')!
      .click();
    await fixture.whenStable();

    expect(face('front-face')).toContain('twa-blue-heart');
  });

  it('can be reached and used with the keyboard', async () => {
    await create(0, 'twa-red-heart');
    GameManager.chosen_emoji = 'twa-blue-heart';
    const tile = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '.component-pix-grid-element',
    )!;

    expect(tile.tabIndex).toBe(0);
    expect(tile.getAttribute('role')).toBe('button');
    expect(tile.getAttribute('aria-label')).toBe('Tile: white question mark');

    tile.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await fixture.whenStable();

    expect(face('front-face')).toContain('twa-blue-heart');
    expect(tile.getAttribute('aria-label')).toBe('Tile: blue heart');
  });

  it('selects its emoji with the space key on an emitter tile', async () => {
    await create(1, 'twa-red-heart');
    const emitted: string[] = [];
    component.sendTWAEmojiClass.subscribe((value) => emitted.push(value));
    const tile = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '.component-pix-grid-element',
    )!;

    const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
    tile.dispatchEvent(space);

    expect(emitted).toEqual(['twa-red-heart']);
    // Space must not scroll the page
    expect(space.defaultPrevented).toBe(true);
    expect(tile.getAttribute('aria-label')).toBe('Choose red heart');
  });

  it('reveals the correct answer when flipped', async () => {
    await create(0, 'twa-red-heart');

    component.doFlip();
    await fixture.whenStable();

    expect(face('back-face')).toContain('twa-red-heart');
  });

  it('shows its emoji and emits it on an emitter tile', async () => {
    await create(1, 'twa-red-heart');
    const emitted: string[] = [];
    component.sendTWAEmojiClass.subscribe((value) => emitted.push(value));

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('.component-pix-grid-element')!
      .click();

    expect(face('front-face')).toContain('twa-red-heart');
    expect(face('back-face')).toBeUndefined();
    expect(emitted).toEqual(['twa-red-heart']);
  });
});
