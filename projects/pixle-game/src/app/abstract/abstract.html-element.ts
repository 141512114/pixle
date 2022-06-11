/**
 * An abstraction of a html element
 * Contains methods of general usage
 */
export class AbstractHtmlElement {
  /**
   * Open the popup message
   *
   * @param html_element
   * @param class_name
   */
  public addClassToHTMLElement(html_element: HTMLElement, class_name: any = 'close'): void {
    if (!html_element.classList.contains(class_name)) return;
    html_element.classList.remove(class_name);
  }

  /**
   * Close the popup message
   *
   * @param html_element
   * @param class_name
   */
  public removeClassFromHTMLElement(html_element: HTMLElement, class_name: any = 'close'): void {
    if (html_element.classList.contains(class_name)) return;
    html_element.classList.add(class_name);
  }
}
