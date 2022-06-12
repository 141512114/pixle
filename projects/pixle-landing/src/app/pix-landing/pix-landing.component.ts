import {Component, OnInit} from '@angular/core';
import {STYLESHEETS_PATH} from '../app.component';

@Component({
  selector: 'app-pix-landing',
  templateUrl: './pix-landing.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-landing.component.min.css']
})
export class PixLandingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
