import { GameManager } from './game.manager';

describe('GameManager', () => {
  it('does not mention the difficulty in the share message', () => {
    GameManager.pixle_id = 412;
    GameManager.pixle_image_width = 5;
    GameManager.pixle_image_height = 5;
    expect(GameManager.generateShareMessage([]).split('\n').at(-1)).toBe('412/5/5');
  });
});
