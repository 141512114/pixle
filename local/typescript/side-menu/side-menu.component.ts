import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {AbstractHtmlElement} from '../abstract/abstract.html-element';
import {HelperFunctionsService} from '../abstract/services/helper-functions.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['../../stylesheets/css/side-menu.component.min.css']
})
export class SideMenuComponent extends AbstractHtmlElement {
  active: boolean = false;
  @ViewChild('side_menu') public side_menu!: ElementRef;

  public clearAllCookies(): void {
    HelperFunctionsService.deleteCookie('cookie_consent');
    HelperFunctionsService.deleteCookie('last_theme');
  }
}
