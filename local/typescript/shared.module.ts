import { NgModule } from '@angular/core';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';
import { PopupMessageComponent } from './popup-message/popup-message.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  exports: [SideMenuComponent, PopupMessageComponent],
  imports: [CommonModule, RouterModule],
  declarations: [
    SideMenuComponent,
    ThemeSwitcherComponent,
    PopupMessageComponent,
  ],
})
export class SharedModule {}
