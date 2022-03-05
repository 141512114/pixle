import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {PixGridComponent} from './pix-grid/pix-grid.component';
import {PixGameComponent} from './pix-game/pix-game.component';
import {PixGridElementComponent} from './pix-grid-element/pix-grid-element.component';
import {PixPopupMessageComponent} from './pix-popup-message/pix-popup-message.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    PixGridComponent,
    PixGameComponent,
    PixGridElementComponent,
    PixPopupMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
