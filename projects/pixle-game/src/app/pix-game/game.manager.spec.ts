import { GameManager } from './game.manager';

describe('GameManager', () => {
  it('appends the difficulty to the details line', () => {
    GameManager.pixle_id = 412;
    GameManager.pixle_image_width = 5;
    GameManager.pixle_image_height = 5;
    GameManager.difficulty.set(5);
    expect(GameManager.generateShareMessage([]).split('\n').at(-1)).toBe('412/5/5 · ●●●●●○○');
  });

  it('sets the difficulty when generating a pixle', () => {
    GameManager.difficulty.set(0);
    GameManager.generatePixle();
    expect(GameManager.difficulty()).toBeGreaterThanOrEqual(1);
  });
});
