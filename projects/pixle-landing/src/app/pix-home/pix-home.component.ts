import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixHeroGridComponent } from '../pix-hero-grid/pix-hero-grid.component';

const SUPPORT_EMAIL: string = 'support@nani-games.net';

@Component({
  selector: 'app-pix-home',
  templateUrl: './pix-home.component.html',
  styleUrls: ['./pix-home.component.scss'],
  standalone: true,
  imports: [CommonModule, PixHeroGridComponent],
})
export class PixHomeComponent {
  support_email: string = SUPPORT_EMAIL;
}
