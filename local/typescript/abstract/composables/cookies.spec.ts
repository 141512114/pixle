import { cookie_consent, createCookie, deleteCookie, getCookie } from './cookies';

describe('cookies (browser storage)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => cookie_consent.next(false));

  it('keeps items for good once the player agreed', () => {
    cookie_consent.next(true);
    createCookie('last_theme', 'neo');
    expect(localStorage.getItem('last_theme')).toBe('neo');
    expect(sessionStorage.getItem('last_theme')).toBeNull();
  });

  it('keeps items only for the session without consent', () => {
    createCookie('last_theme', 'neo');
    expect(localStorage.getItem('last_theme')).toBeNull();
    expect(getCookie('last_theme')).toBe('neo');
  });

  it('deletes an item from both storages', () => {
    localStorage.setItem('last_theme', 'neo');
    sessionStorage.setItem('last_theme', 'pop');

    deleteCookie('last_theme');

    expect(localStorage.getItem('last_theme')).toBeNull();
    expect(sessionStorage.getItem('last_theme')).toBeNull();
  });
});
