import { NgModule } from '@angular/core';
import {
  BrowserModule,
} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@typescript/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
  ],
})
export class AppModule {}
