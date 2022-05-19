import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionsService {
  /**
   * Convert any two-dimensional array into a one-dimensional array
   *
   * @param array
   */
  public static twoDimensionalArrayToOneDimensional(array: number[][]): number[] {
    // Make sure a pixle tile array was assigned
    if (array.length <= 0) return [];
    let pixle_convert: number[] = [];
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
   */
  public static generateRandomInteger(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Makes an array of numbers which helps to use *ngFor as a normal for loop
   *
   * @param i
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
}
