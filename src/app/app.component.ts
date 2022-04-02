import {Component, ElementRef, ViewChild} from '@angular/core';

export const STYLESHEETS_PATH: string = '../../stylesheets/css/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../stylesheets/css/app.component.min.css']
})
export class AppComponent {
  @ViewChild('app_root') private app_root!: ElementRef;

  /**
   * Receive and set the theme
   *
   * @param theme_name
   */
  public receiveThemeData(theme_name: string): void {
    this.app_root.nativeElement.dataset['theme'] = theme_name;
  }
}
