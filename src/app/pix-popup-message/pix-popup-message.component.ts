import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {IPopUp} from '../interface/popup-message.interface';

const DEFAULT_POPUP: IPopUp = {
  headline: 'Hmm..., this isn\'t supposed to be shown already...',
  subline: '',
  message_body: 'Did you try something??'
};

@Component({
  selector: 'app-pix-popup-message',
  templateUrl: './pix-popup-message.component.html',
  styleUrls: ['../../assets/stylesheets/css/minified/pix-popup-message.component.min.css']
})
export class PixPopupMessageComponent {
  @ViewChild('match_closing_message') match_closing_message!: ElementRef;
  @Input() message: IPopUp = DEFAULT_POPUP;

  /**
   * Open pop up
   */
  public openPopUp(msg_object: IPopUp = DEFAULT_POPUP): void {
    this.message = msg_object;
    this.match_closing_message.nativeElement.classList.remove('close');
  }
}
