import { BehaviorSubject } from 'rxjs';

export const cookie_consent: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);

/**
 * Check if the local storage of the browser is available
 *
 * @return Availability of the local storage (boolean)
 */
export function isLocalStorageAvailable() {
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
export function isSessionStorageAvailable() {
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
export function createCookie(item: string, value: string): void {
  if (item === '' || value === '') return;
  if (cookie_consent.value && isLocalStorageAvailable()) {
    localStorage.setItem(item, value);
  } else {
    createSessionCookie(item, value);
  }
}

/**
 * Delete a cookie item from the local storage
 *
 * @param item
 */
export function deleteCookie(item: string): void {
  if (item === '') return;
  if (isLocalStorageAvailable() && localStorage.getItem(item) != null) {
    localStorage.removeItem(item);
  }
}

/**
 * Get a cookie item
 *
 * @param item
 */
export function getCookie(item: string): string | null {
  if (cookie_consent.value) {
    return getRawCookie(item);
  } else {
    return getSessionCookie(item);
  }
}

/**
 * Get a cookie item (raw, cookie consent is not required)
 *
 * @param item
 */
export function getRawCookie(item: string): string | null {
  if (isLocalStorageAvailable() && localStorage.getItem(item) != null) {
    return localStorage.getItem(item);
  } else {
    return getSessionCookie(item);
  }
}

/**
 * Create a session cookie item only
 *
 * @param item
 * @param value
 */
export function createSessionCookie(item: string, value: string): void {
  if (item === '' || value === '') return;
  if (isSessionStorageAvailable()) {
    sessionStorage.setItem(item, value);
  }
}

/**
 * Get a session cookie item
 *
 * @param item
 */
export function getSessionCookie(item: string): string | null {
  if (isSessionStorageAvailable() && sessionStorage.getItem(item) != null) {
    return sessionStorage.getItem(item);
  }
  return null;
}
