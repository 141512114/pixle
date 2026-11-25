/**
 * Activate a theme (see local/stylesheets/mixins/_materials.scss) and let the browser UI follow it:
 * the theme-color meta tag gets the header color (palette color 3) of the theme.
 * Pages without a theme-color meta tag (the landing page) are left as they are.
 */
export function applyTheme(document: Document, theme: string): void {
  document.body.dataset['theme'] = theme;

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const headerColor = document.defaultView
    ?.getComputedStyle(document.body)
    .getPropertyValue('--default-theme-three')
    .trim();
  if (meta != null && headerColor) {
    meta.content = headerColor;
  }
}
