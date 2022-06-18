import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PixGameComponent} from './pix-game/pix-game.component';

const routes: Routes = [
  {path: '', redirectTo: '/game', pathMatch: 'full'},
  {path: '**', redirectTo: '/game'},
  {path: 'game', component: PixGameComponent},
  {path: 'imprint', redirectTo: 'projects/pixle-game/src/assets/important/imprint.html'}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {
}
