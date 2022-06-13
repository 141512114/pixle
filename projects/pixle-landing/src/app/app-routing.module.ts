import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PixHomeComponent} from './pix-home/pix-home.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: PixHomeComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'})
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {
}
