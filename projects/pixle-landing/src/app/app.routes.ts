import { Routes } from '@angular/router';
import { PixHomeComponent } from './pix-home/pix-home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: PixHomeComponent },
  // The wildcard route must always be the last entry
  { path: '**', redirectTo: '/home' },
];
