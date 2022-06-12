import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {AbstractHtmlElement} from '../abstract/abstract.html-element';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['../../stylesheets/css/side-menu.component.min.css']
})
export class SideMenuComponent extends AbstractHtmlElement {
  active: boolean = false;
  @ViewChild('side_menu') public side_menu!: ElementRef;
}
