import { applyTheme } from './theme';

describe('applyTheme', () => {
  let meta: HTMLMetaElement | null = null;

  afterEach(() => {
    meta?.remove();
    meta = null;
    delete document.body.dataset['theme'];
    document.body.style.removeProperty('--default-theme-three');
  });

  function addThemeColorMeta(content: string): HTMLMetaElement {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = content;
    document.head.appendChild(meta);
    return meta;
  }

  it('activates the theme on the body', () => {
    applyTheme(document, 'neo');
    expect(document.body.dataset['theme']).toBe('neo');
  });

  it("gives the theme-color meta tag the theme's header color", () => {
    const themeColor = addThemeColorMeta('#243756');
    // In the app this variable comes from the theme's stylesheet rule
    document.body.style.setProperty('--default-theme-three', '#553894');

    applyTheme(document, 'neo');

    expect(themeColor.content).toBe('#553894');
  });

  it('keeps the meta tag when no header color is available', () => {
    const themeColor = addThemeColorMeta('#243756');
    applyTheme(document, 'neo');
    expect(themeColor.content).toBe('#243756');
  });

  it('does nothing to pages without a theme-color meta tag', () => {
    expect(() => applyTheme(document, 'neo')).not.toThrow();
    expect(document.querySelector('meta[name="theme-color"]')).toBeNull();
  });
});
