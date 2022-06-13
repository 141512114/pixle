import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PixHomeComponent} from './pix-home/pix-home.component';
import {SharedModule} from '../../../../local/typescript/shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    PixHomeComponent
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
