import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PixLandingComponent} from './pix-landing/pix-landing.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: PixLandingComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'})
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
