import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@typescript/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PixHomeComponent } from './pix-home/pix-home.component';
import { PixHeroTileComponent } from './pix-hero-tile/pix-hero-tile.component';
import { PixHeroGridComponent } from './pix-hero-grid/pix-hero-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    PixHomeComponent,
    PixHeroGridComponent,
    PixHeroTileComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
  ],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
