import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {PixGridComponent} from './pix-grid/pix-grid.component';
import {PixGameComponent} from './pix-game/pix-game.component';
import {PixGridElementComponent} from './pix-grid-element/pix-grid-element.component';
import {PixPopupMessageComponent} from './pix-popup-message/pix-popup-message.component';
import {AppRoutingModule} from './app-routing.module';
import {ThemeSwitcherComponent} from './theme-switcher/theme-switcher.component';
import {PixSideMenuComponent} from './pix-side-menu/pix-side-menu.component';
import {PixGridUiComponent} from './pix-grid-ui/pix-grid-ui.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    PixGridComponent,
    PixGameComponent,
    PixGridElementComponent,
    PixPopupMessageComponent,
    ThemeSwitcherComponent,
    PixSideMenuComponent,
    PixGridUiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
