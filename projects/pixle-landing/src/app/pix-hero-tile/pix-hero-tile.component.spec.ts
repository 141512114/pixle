import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixHeroTileComponent } from './pix-hero-tile.component';

describe('PixHeroTileComponent', () => {
  let fixture: ComponentFixture<PixHeroTileComponent>;
  let tile: HTMLElement;

  beforeEach(async () => {
    fixture = TestBed.createComponent(PixHeroTileComponent);
    fixture.componentRef.setInput('pixle_emoji', 'twa-red-heart');
    await fixture.whenStable();
    tile = (fixture.nativeElement as HTMLElement).querySelector('.flip-element')!;
  });

  afterEach(() => vi.useRealTimers());

  it('shows its emoji on the back face', () => {
    expect(tile.querySelector('.back-face i')!.className).toContain('twa-red-heart');
  });

  it('flips on hover and turns back shortly after the pointer leaves', () => {
    vi.useFakeTimers();

    tile.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(tile.classList).toContain('do-flip');

    tile.dispatchEvent(new Event('mouseleave'));
    vi.advanceTimersByTime(349);
    fixture.detectChanges();
    expect(tile.classList).toContain('do-flip');

    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    expect(tile.classList).not.toContain('do-flip');
  });

  it('stays flipped when the pointer comes back before it turns', () => {
    vi.useFakeTimers();

    tile.dispatchEvent(new Event('mouseenter'));
    tile.dispatchEvent(new Event('mouseleave'));
    tile.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    expect(tile.classList).toContain('do-flip');
  });
});
