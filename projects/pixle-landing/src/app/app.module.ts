import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PixLandingComponent} from './pix-landing/pix-landing.component';
import {SharedModule} from '../../../../local/typescript/shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    PixLandingComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    CommonModule,
    AppRoutingModule,
    SharedModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
