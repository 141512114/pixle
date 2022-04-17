/**
 * This class acts as the manager for every pixle-solving game
 */
export class GameManager {
  public static pixle_solved: boolean = false;
  public static game_started: boolean = false;

  public static chosen_emoji: number = -1;

  /**
   * Initialize the game
   */
  public static initGame(): void {
    GameManager.pixle_solved = false;
    GameManager.game_started = true;
  }

  /**
   * Reset important variables
   * They need to be explicitly reset because of their static nature
   */
  public static resetGame(): void {
    GameManager.pixle_solved = false;
    GameManager.game_started = false;
  }
}
