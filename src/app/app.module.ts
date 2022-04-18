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
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
