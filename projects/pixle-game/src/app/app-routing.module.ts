import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PixGameComponent} from './pix-game/pix-game.component';

const routes: Routes = [
  {path: '', redirectTo: '/game', pathMatch: 'full'},
  {path: '**', redirectTo: '/game'},
  {path: 'game', component: PixGameComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {
}
