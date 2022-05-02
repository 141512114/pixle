import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {IPopUp} from '../interface/popup-message.interface';
import {STYLESHEETS_PATH} from '../app.component';

const DEFAULT_MSG: IPopUp = {
  headline: 'Hmm..., this isn\'t supposed to be shown already...',
  subline: '',
  message_body: 'Did you try something??'
};

@Component({
  selector: 'app-pix-popup-message',
  templateUrl: './pix-popup-message.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-popup-message.component.min.css']
})
export class PixPopupMessageComponent implements AfterViewInit {
  @ViewChild('msg_container') msg_container!: ElementRef;
  @ViewChild('msg_headline') msg_headline!: ElementRef;
  @ViewChild('msg_description') msg_description!: ElementRef;

  message: IPopUp = DEFAULT_MSG;

  ngAfterViewInit(): void {
    // Write default message
    this.writeNewMessage(this.message);
  }

  /**
   * Open the popup message
   *
   * @param msg_object
   */
  public openPopUp(msg_object: IPopUp): void {
    this.writeNewMessage(msg_object);
    let message_element: HTMLElement = this.msg_container.nativeElement;
    if (!message_element.classList.contains('close')) return;
    message_element.classList.remove('close');
  }

  /**
   * Close the popup message
   */
  public closePopUp(): void {
    let message_element: HTMLElement = this.msg_container.nativeElement;
    if (message_element.classList.contains('close')) return;
    message_element.classList.add('close');
  }

  /**
   * Writes a new message on the popup panel
   *
   * @param msg_object
   * @private
   */
  private writeNewMessage(msg_object: IPopUp): void {
    if (msg_object == null || undefined) return;
    this.msg_headline.nativeElement.innerHTML = msg_object.headline;
    this.msg_description.nativeElement.innerHTML = msg_object.message_body;
  }
}
