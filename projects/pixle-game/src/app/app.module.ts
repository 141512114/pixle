import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';

import {AppComponent} from './app.component';
import {PixGridComponent} from './pix-grid/pix-grid.component';
import {PixGameComponent} from './pix-game/pix-game.component';
import {PixGridElementComponent} from './pix-grid-element/pix-grid-element.component';
import {AppRoutingModule} from './app-routing.module';
import {PixGridUiComponent} from './pix-grid-ui/pix-grid-ui.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {SharedModule} from '@typescript/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    PixGridComponent,
    PixGameComponent,
    PixGridElementComponent,
    PixGridUiComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FontAwesomeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
