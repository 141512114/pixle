import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from '@typescript/shared.module';
import { PixGameComponent } from './pix-game/pix-game.component';
import { PixGridComponent } from './pix-grid/pix-grid.component';
import { PixGridElementComponent } from './pix-grid-element/pix-grid-element.component';
import { PixGridUiComponent } from './pix-grid-ui/pix-grid-ui.component';

@NgModule({
  declarations: [
    AppComponent,
    PixGameComponent,
    PixGridComponent,
    PixGridElementComponent,
    PixGridUiComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
