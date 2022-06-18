import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../../local/typescript/shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PixHomeComponent} from './pix-home/pix-home.component';
import {PixHeroTileComponent} from './pix-hero-tile/pix-hero-tile.component';
import {PixHeroGridComponent} from './pix-hero-grid/pix-hero-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    PixHomeComponent,
    PixHeroGridComponent,
    PixHeroTileComponent
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
