import { Injectable } from '@angular/core';
import { PIXLE_ICONS } from '@typescript/emoji.database';

@Injectable({
  providedIn: 'root',
})
export class HelperFunctionsService {
  /**
   * Convert any two-dimensional array into a one-dimensional array
   *
   * @param array
   * @return Converted two-dimensional array
   */
  public static twoDimensionalArrayToOneDimensional(array: any[][]): any[] {
    // Make sure a pixle tile array was assigned
    if (array.length <= 0) return [];
    let pixle_convert: any[] = [];
    for (let i: number = 0; i < array.length; i++) {
      for (let j: number = 0; j < array[0].length; j++) {
        pixle_convert.push(array[i][j]);
      }
    }
    return pixle_convert;
  }

  /**
   * Generate a random integer between two limiter values --> min and max
   * The parameter min is by default 0
   *
   * @param max
   * @param min
   * @return Random integer
   */
  public static generateRandomInteger(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Get the list of emojis used in the pixle
   *
   * @return {boolean} Operation successful
   * @private
   */
  public static getEmojiList(pixle_tiles: string[][]): string[] {
    if (pixle_tiles.length <= 0) return [];
    let pixle_convert: string[] =
      HelperFunctionsService.twoDimensionalArrayToOneDimensional(pixle_tiles);
    let temp_twa_emoji_classes: string[] = [];
    for (let i: number = 0; i < pixle_convert.length; i++) {
      for (let j: number = pixle_convert.length - 1; j > 0; j--) {
        // Make absolutely sure that both picked entries are the exact same (or not)
        if (pixle_convert[j] === pixle_convert[i]) {
          let twa_emoji_class: string = pixle_convert[i];
          // Check if there already exists this exact emoji code point in the temporary array
          if (temp_twa_emoji_classes.includes(twa_emoji_class)) break;
          temp_twa_emoji_classes.push(twa_emoji_class);
        }
      }
    }

    return temp_twa_emoji_classes;
  }

  /**
   * Get the emoji by its id --> search it in the emoji collection
   * Return an array of codepoints
   *
   * @param emoji_ids
   * @return {string[]} Array of strings --> twa emoji classes
   */
  public static getEmojisFromListById(emoji_ids: number[] = []): string[] {
    let temp_twa_emoji_classes: string[] = [];
    for (let i: number = 0; i < emoji_ids.length; i++) {
      let twa_emoji_class: string = PIXLE_ICONS[emoji_ids[i]];
      temp_twa_emoji_classes.push(twa_emoji_class);
    }
    return temp_twa_emoji_classes;
  }

  /**
   * Makes an array of numbers which helps to use *ngFor as a normal for loop
   *
   * @param i
   * @return Array of numbers
   */
  public static makeForLoopCount(i: number): number[] {
    let ceil: number = Math.ceil(i);
    let number_list: number[] = [];
    for (let i = 0; i < ceil; i++) {
      number_list.push(i);
    }
    return number_list;
  }

  /**
   * Lock element
   *
   * @param element
   */
  public static lockElement(element: HTMLElement): void {
    if (element == undefined || null || element.classList.contains('locked'))
      return;
    element.classList.add('locked');
  }

  /**
   * Unlock element
   *
   * @param element
   */
  public static unlockElement(element: HTMLElement): void {
    if (element == undefined || null || !element.classList.contains('locked'))
      return;
    element.classList.remove('locked');
  }

  /**
   * Browser support tool
   * The event listener 'transitionend' as many variations across all browsers
   * This tool checks them all and chooses which one works / fits best
   */
  public static transitionEndEventName(): any {
    let el: HTMLElement = document.createElement('div');
    let transitions: any = {
      transition: 'transitionend',
      OTransition: 'otransitionend', // oTransitionEnd in very old Opera
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd',
    };
    let i: any;
    for (i in transitions) {
      if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
        return transitions[i];
      }
    }
  }

  /**
   * Add event listener to a specified element.
   * This function helps to support other browsers.
   *
   * @param element
   * @param event
   * @param callback
   */
  public static addEventListenerToElement(
    element: any,
    event: any,
    callback: any,
  ): void {
    if (typeof element.addEventListener != undefined) {
      element.addEventListener(event, callback, false);
    } else if (typeof element.attachEvent != undefined) {
      element.attachEvent('on' + event, callback);
    } else {
      element['on' + event] = callback;
    }
  }

  /**
   * Clamp any value to a minimum and maximum value
   *
   * @param value
   * @param min
   * @param max
   */
  public static clampValue(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}
