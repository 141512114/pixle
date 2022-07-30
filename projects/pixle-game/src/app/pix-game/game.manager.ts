import {BehaviorSubject} from 'rxjs';

/**
 * This class acts as the manager for every pixle-solving game
 */
export class GameManager {
  public static cookie_consent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public static pixle_solved: boolean = false;
  public static game_started: boolean = false;

  public static chosen_emoji: string = '';

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
    GameManager.chosen_emoji = '';
    GameManager.pixle_solved = false;
    GameManager.game_started = false;
  }

  /**
   * Browser support tool
   * The event listener 'transitionend' as many variations across all browsers
   * This tool checks them all and chooses which one works / fits best
   */
  public static transitionEndEventName() {
    let el: HTMLElement = document.createElement('div');
    let transitions: any = {
      'transition': 'transitionend',
      'OTransition': 'otransitionend',  // oTransitionEnd in very old Opera
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };
    let i: any;
    for (i in transitions) {
      if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
        return transitions[i];
      }
    }
  }
}
