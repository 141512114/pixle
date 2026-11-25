import { Routes } from '@angular/router';
import { PixGameComponent } from './pix-game/pix-game.component';

export const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: 'game', component: PixGameComponent },
  { path: '**', redirectTo: '/game' },
];
