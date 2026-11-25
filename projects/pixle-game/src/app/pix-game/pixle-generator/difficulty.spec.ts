import { DIFFICULTY_SETTINGS, levelForDate } from './difficulty';

describe('difficulty', () => {
  it('maps Monday..Sunday to 1..7', () => {
    // 2026-11-23 is a Monday
    for (let d = 0; d < 7; d++) {
      expect(levelForDate(new Date(2026, 10, 23 + d, 12))).toBe(d + 1);
    }
  });

  it('only levels 6 and 7 restrict the base size', () =>
    expect(
      Object.entries(DIFFICULTY_SETTINGS)
        .filter(([, s]) => s.minBaseSize > 0)
        .map(([level]) => level),
    ).toEqual(['6', '7']));
});
