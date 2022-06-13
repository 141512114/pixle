import {Component, OnInit} from '@angular/core';
import {STYLESHEETS_PATH} from '../app.component';

@Component({
  selector: 'app-pix-home',
  templateUrl: './pix-home.component.html',
  styleUrls: [STYLESHEETS_PATH + 'pix-home.component.min.css']
})
export class PixHomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
