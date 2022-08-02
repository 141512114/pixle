import {Component} from '@angular/core';
import {STYLESHEETS_PATH} from '../app.component';

const SUPPORT_EMAIL: string = 'support@nani-games.net';

@Component({
  selector: 'app-pix-home',
  templateUrl: './pix-home.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-home.component.min.css']
})
export class PixHomeComponent {
  support_email: string = SUPPORT_EMAIL;
}
