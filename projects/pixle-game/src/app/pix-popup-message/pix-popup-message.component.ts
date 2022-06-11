import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {IPopUp} from '../interface/popup-message.interface';
import {STYLESHEETS_PATH} from '../app.component';
import {AbstractHtmlElement} from '../abstract/abstract.html-element';

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
export class PixPopupMessageComponent extends AbstractHtmlElement implements AfterViewInit {
  @ViewChild('msg_container') public msg_container!: ElementRef;
  @ViewChild('msg_headline') private msg_headline!: ElementRef;
  @ViewChild('msg_description') private msg_description!: ElementRef;

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
    if (msg_object == null || undefined) return;
    this.msg_headline.nativeElement.innerHTML = msg_object.headline;
    this.msg_description.nativeElement.innerHTML = msg_object.message_body;
  }
}
