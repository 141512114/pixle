/**
 * An abstraction of a html element
 * Contains methods of general usage
 */
export class AbstractHtmlElement {
  /**
   * Add class from html element
   *
   * @param html_element
   * @param class_name
   */
  public addClassToHTMLElement(html_element: HTMLElement, class_name: any): void {
    if (html_element.classList.contains(class_name)) return;
    html_element.classList.add(class_name);
  }

  /**
   * Remove class from html element
   *
   * @param html_element
   * @param class_name
   */
  public removeClassFromHTMLElement(html_element: HTMLElement, class_name: any): void {
    if (!html_element.classList.contains(class_name)) return;
    html_element.classList.remove(class_name);
  }
}
