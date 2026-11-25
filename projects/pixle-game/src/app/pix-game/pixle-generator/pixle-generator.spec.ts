import initPixleGenerator from './pixle-generator';
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
});
