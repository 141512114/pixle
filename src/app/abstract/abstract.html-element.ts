/**
 * An abstraction of a html element
 * Contains methods of general usage
 */
export class AbstractHtmlElement {
  /**
   * Open the popup message
   *
   * @param html_element
   */
  public openHTMLElement(html_element: HTMLElement): void {
    if (!html_element.classList.contains('close')) return;
    html_element.classList.remove('close');
  }

  /**
   * Close the popup message
   *
   * @param html_element
   */
  public closeHTMLElement(html_element: HTMLElement): void {
    if (html_element.classList.contains('close')) return;
    html_element.classList.add('close');
  }
}
