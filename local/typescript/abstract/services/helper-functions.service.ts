import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionsService {
  public static cookie_consent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
    if ((element == undefined || null) || (element.classList.contains('locked'))) return;
    element.classList.add('locked');
  }

  /**
   * Unlock element
   *
   * @param element
   */
  public static unlockElement(element: HTMLElement): void {
    if ((element == undefined || null) || (!element.classList.contains('locked'))) return;
    element.classList.remove('locked');
  }

  /**
   * Format a given date and remove the hours, minutes and seconds
   * Only keep the day, month and year
   *
   * @param date
   * @return Formatted date
   */
  public static formatDate(date: Date) {
    return [
      date.getFullYear(),
      HelperFunctionsService.padTo2Digits(date.getMonth() + 1),
      HelperFunctionsService.padTo2Digits(date.getDate()),
    ].join('-');
  }

  /**
   * Check if the local storage of the browser is available
   *
   * @return Availability of the local storage (boolean)
   */
  public static isLocalStorageAvailable() {
    try {
      localStorage.setItem('check', 'availability');
      localStorage.removeItem('check');
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if the session storage of the browser is available
   *
   * @return Availability of the session storage (boolean)
   */
  public static isSessionStorageAvailable() {
    try {
      sessionStorage.setItem('check', 'availability');
      sessionStorage.removeItem('check');
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Create a cookie item
   * Make sure the user has given his consent to the usage of cookies
   *
   * @param item
   * @param value
   */
  public static createCookie(item: string, value: string): void {
    if (item === '' || value === '') return;
    if (HelperFunctionsService.cookie_consent.value && HelperFunctionsService.isLocalStorageAvailable()) {
      localStorage.setItem(item, value);
    } else {
      HelperFunctionsService.createSessionCookie(item, value);
    }
  }

  /**
   * Delete a cookie item from the local storage
   *
   * @param item
   */
  public static deleteCookie(item: string): void {
    if (item === '') return;
    if (HelperFunctionsService.isLocalStorageAvailable() && localStorage.getItem(item) != null) {
      localStorage.removeItem(item);
    }
  }

  /**
   * Get a cookie item
   *
   * @param item
   */
  public static getCookie(item: string): string | null {
    if (HelperFunctionsService.cookie_consent.value) {
      return HelperFunctionsService.getRawCookie(item);
    } else {
      return HelperFunctionsService.getSessionCookie(item);
    }
  }

  /**
   * Get a cookie item (raw, cookie consent is not required)
   *
   * @param item
   */
  public static getRawCookie(item: string): string | null {
    if (HelperFunctionsService.isLocalStorageAvailable() && localStorage.getItem(item) != null) {
      return localStorage.getItem(item);
    } else {
      return HelperFunctionsService.getSessionCookie(item);
    }
  }

  /**
   * Create a session cookie item only
   *
   * @param item
   * @param value
   */
  public static createSessionCookie(item: string, value: string): void {
    if (item === '' || value === '') return;
    if (HelperFunctionsService.isSessionStorageAvailable()) {
      sessionStorage.setItem(item, value);
    }
  }

  /**
   * Get a session cookie item
   *
   * @param item
   */
  public static getSessionCookie(item: string): string | null {
    if (HelperFunctionsService.isSessionStorageAvailable() && sessionStorage.getItem(item) != null) {
      return sessionStorage.getItem(item);
    }
    return null;
  }

  /**
   * Browser support tool
   * The event listener 'transitionend' as many variations across all browsers
   * This tool checks them all and chooses which one works / fits best
   */
  public static transitionEndEventName(): any {
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

  /**
   * Add event listener to a specified element.
   * This function helps to support other browsers.
   *
   * @param element
   * @param event
   * @param callback
   */
  public static addEventListenerToElement(element: any, event: any, callback: any): void {
    if (typeof element.addEventListener != undefined) {
      element.addEventListener(event, callback, false);
    } else if (typeof element.attachEvent != undefined) {
      element.attachEvent('on' + event, callback);
    } else {
      element['on' + event] = callback;
    }
  }

  /**
   * Add a zero to any number below 10
   *
   * @param num
   * @return Modified number as a string
   * @private
   */
  private static padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
}
