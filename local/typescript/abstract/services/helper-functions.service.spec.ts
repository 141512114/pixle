import { HelperFunctionsService } from './helper-functions.service';

describe('HelperFunctionsService', () => {
  describe('getEmojiList', () => {
    it('returns every distinct emoji in order of first appearance', () => {
      expect(
        HelperFunctionsService.getEmojiList([
          ['a', 'b'],
          ['b', 'c'],
        ]),
      ).toEqual(['a', 'b', 'c']);
    });

    it('keeps an emoji that only occurs once in the top-left tile', () => {
      expect(
        HelperFunctionsService.getEmojiList([
          ['unique', 'b'],
          ['b', 'b'],
        ]),
      ).toEqual(['unique', 'b']);
    });

    it('returns an empty list for an empty grid', () => {
      expect(HelperFunctionsService.getEmojiList([])).toEqual([]);
    });
  });

  describe('lockElement / unlockElement', () => {
    it('toggles the locked class and ignores missing elements', () => {
      const element = document.createElement('div');

      HelperFunctionsService.lockElement(element);
      expect(element.classList.contains('locked')).toBe(true);

      HelperFunctionsService.unlockElement(element);
      expect(element.classList.contains('locked')).toBe(false);

      expect(() =>
        HelperFunctionsService.lockElement(null as unknown as HTMLElement),
      ).not.toThrow();
    });
  });
});
