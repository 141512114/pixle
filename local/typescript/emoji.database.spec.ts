import { PIXLE_ICONS } from './emoji.database';

describe('emoji database', () => {
  it('contains every icon only once', () => {
    const duplicates = PIXLE_ICONS.filter(
      (icon, index) => PIXLE_ICONS.indexOf(icon) !== index,
    );
    expect(duplicates).toEqual([]);
  });
});
