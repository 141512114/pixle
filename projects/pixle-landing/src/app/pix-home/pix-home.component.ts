import { Component } from '@angular/core';

const SUPPORT_EMAIL: string = 'support@nani-games.net';

@Component({
  selector: 'app-pix-home',
  templateUrl: './pix-home.component.html',
  styleUrls: ['./pix-home.component.scss'],
})
export class PixHomeComponent {
  support_email: string = SUPPORT_EMAIL;
}
