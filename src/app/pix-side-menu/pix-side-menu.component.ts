import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {STYLESHEETS_PATH} from '../app.component';
import {AbstractHtmlElement} from '../abstract/abstract.html-element';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-pix-side-menu',
  templateUrl: './pix-side-menu.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-side-menu.component.css']
})
export class PixSideMenuComponent extends AbstractHtmlElement {
  active: boolean = false;
  @ViewChild('side_menu') public side_menu!: ElementRef;
}
