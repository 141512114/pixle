import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {PixGridComponent} from './pix-grid/pix-grid.component';
import {PixGameComponent} from './pix-game/pix-game.component';
import {PixGridElementComponent} from './pix-grid-element/pix-grid-element.component';

@NgModule({
  declarations: [
    AppComponent,
    PixGridComponent,
    PixGameComponent,
    PixGridElementComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
