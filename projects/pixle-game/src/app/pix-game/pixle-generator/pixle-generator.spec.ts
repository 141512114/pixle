import initPixleGenerator, { mutatePattern } from './pixle-generator';
import { isValidMutation, normalize } from './pattern-mutations';
import { levelForDate } from './difficulty';
import { MASTER_PATTERNS } from './pixle-pattern-list';
import { PIXLE_ICONS } from '@typescript/emoji.database';

describe('initPixleGenerator', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function pixleAt(date: Date) {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(date);
    return initPixleGenerator();
  }

  it('starts counting at 0 on 2024-10-18', () => {
    expect(pixleAt(new Date(2024, 9, 18, 12, 0)).id).toBe(0);
    expect(pixleAt(new Date(2024, 9, 19, 12, 0)).id).toBe(1);
  });

  it('generates the same pixle for the whole local day', () => {
    const morning = pixleAt(new Date(2026, 10, 25, 0, 0, 1));
    const night = pixleAt(new Date(2026, 10, 25, 23, 59, 59));

    expect(night.id).toBe(morning.id);
    expect(night.tiles).toEqual(morning.tiles);
  });

  it('changes id and puzzle together at local midnight', () => {
    const before = pixleAt(new Date(2026, 10, 25, 23, 59, 59));
    const after = pixleAt(new Date(2026, 10, 26, 0, 0, 1));

    expect(after.id).toBe(before.id + 1);
    expect(after.tiles).not.toEqual(before.tiles);
  });

  it('only uses existing icons', () => {
    const pixle = pixleAt(new Date(2026, 10, 25, 12, 0));
    for (const id of pixle.tiles.flat()) {
      expect(PIXLE_ICONS[id]).toBeDefined();
    }
  });

  it('stores the level of the weekday', () => {
    expect(pixleAt(new Date(2026, 10, 23, 12)).difficulty).toBe(1); // Monday
    expect(pixleAt(new Date(2026, 10, 29, 12)).difficulty).toBeGreaterThanOrEqual(1);
  });

  it('returns the original pattern on Mondays', () => {
    const shape = JSON.stringify(normalize(pixleAt(new Date(2026, 10, 23, 12)).tiles));
    expect(MASTER_PATTERNS.some((p) => JSON.stringify(normalize(p)) === shape)).toBe(true);
  });

  it('is deterministic per date', () => {
    expect(pixleAt(new Date(2026, 10, 29, 9))).toEqual(pixleAt(new Date(2026, 10, 29, 21)));
  });

  it('generates valid puzzles for three years', () => {
    const days = 3 * 365;
    let fallbacks = 0;
    for (let i = 0; i < days; i++) {
      const date = new Date(2024, 9, 18 + i, 12);
      const pixle = pixleAt(date);
      const expected = levelForDate(date);
      expect(pixle.difficulty).toBeLessThanOrEqual(expected);
      if (pixle.difficulty < expected) fallbacks++;
      expect(pixle.tiles.length).toBeLessThanOrEqual(5);
      expect(
        pixle.tiles.every((r) => r.length === pixle.tiles[0].length && r.length <= 5),
      ).toBe(true);
      for (const id of pixle.tiles.flat()) expect(PIXLE_ICONS[id]).toBeDefined();
      if (pixle.difficulty > 1) {
        expect(isValidMutation(normalize(pixle.tiles), pixle.difficulty)).toBe(true);
      }
    }
    console.info(`fallbacks: ${fallbacks} of ${days}`);
    expect(fallbacks).toBeLessThan(days * 0.05);
  });

  it('terminates with level 1 when nothing passes validation', () => {
    // a single tile: no mutation can ever produce two placeholders
    expect(mutatePattern(7, () => 0, [[[0]]])).toEqual({
      tiles: [[0]],
      level: 1,
    });
  });
});
