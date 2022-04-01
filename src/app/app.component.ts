import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../stylesheets/css/app.component.min.css']
})
export class AppComponent {
  @ViewChild('app_root') private app_root!: ElementRef;

  title = 'pixle-game';

  /**
   * Receive and set the theme
   *
   * @param theme_name
   */
  public receiveThemeData(theme_name: string): void {
    this.app_root.nativeElement.dataset['theme'] = theme_name;
  }
}
