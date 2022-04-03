import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

export const STYLESHEETS_PATH: string = '../../stylesheets/css/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../stylesheets/css/app.component.min.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('app_root') private app_root!: ElementRef;

  ngAfterViewInit() {
    let vh = window.innerHeight * 0.01;
    this.app_root.nativeElement.style.setProperty('--vh', `${vh}px`);
    // Calculate viewport height --> alternative to css vh unit
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      this.app_root.nativeElement.style.setProperty('--vh', `${vh}px`);
    });
  }

  /**
   * Receive and set the theme
   *
   * @param theme_name
   */
  public receiveThemeData(theme_name: string): void {
    this.app_root.nativeElement.dataset['theme'] = theme_name;
  }
}
