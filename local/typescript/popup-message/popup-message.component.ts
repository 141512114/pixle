import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { IPopUp } from '@interface/popup-message.interface';
import { AbstractHtmlElement } from '@abstract/abstract.html-element';

const DEFAULT_MSG: IPopUp = {
  headline: "Hmm..., this isn't supposed to be shown already...",
  subline: '',
  message_body: 'Did you try something??',
};

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss'],
})
export class PopupMessageComponent
  extends AbstractHtmlElement
  implements AfterViewInit
{
  popup_is_closed: boolean = false;
  public readonly msg_container =
    viewChild.required<ElementRef<HTMLElement>>('msg_container');
  /*
    Popup types:
    0 => normal notification
    1 => agreement popup
   */
  readonly popup_type = input<number>(0);
  readonly sendPopupHasBeenClosed = output<boolean>();
  private readonly msg_headline =
    viewChild.required<ElementRef<HTMLElement>>('msg_headline');
  private readonly msg_description =
    viewChild.required<ElementRef<HTMLElement>>('msg_description');

  ngAfterViewInit(): void {
    // Write default message
    this.writeNewMessage(DEFAULT_MSG);
  }

  /**
   * Writes a new message on the popup panel
   *
   * @param msg_object
   */
  public writeNewMessage(msg_object: IPopUp): void {
    if (msg_object == null) return;
    this.msg_headline().nativeElement.innerHTML = msg_object.headline;
    this.msg_description().nativeElement.innerHTML = msg_object.message_body;
  }

  /**
   * Open the popup
   */
  public openPopup(): void {
    this.removeClassFromHTMLElement(this.msg_container().nativeElement, 'close');
    this.popup_is_closed = false;
  }

  /**
   * Close the popup
   *
   * @param output
   */
  public closePopup(output: boolean = true): void {
    this.addClassToHTMLElement(this.msg_container().nativeElement, 'close');
    this.popup_is_closed = true;
    this.sendPopupHasBeenClosed.emit(output);
  }
}
