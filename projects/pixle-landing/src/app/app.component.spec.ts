import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

describe('AppComponent (landing)', () => {
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: appConfig.providers,
    }).compileComponents();
  });

  async function renderAt(url: string) {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl(url);
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('redirects / to /home and renders the home page', async () => {
    const fixture = await renderAt('/');
    expect(TestBed.inject(Router).url).toBe('/home');
    expect(fixture.nativeElement.querySelector('app-pix-home')).not.toBeNull();
  });

  it('redirects unknown urls to /home', async () => {
    const fixture = await renderAt('/does-not-exist');
    expect(TestBed.inject(Router).url).toBe('/home');
    expect(fixture.nativeElement.querySelector('app-pix-home')).not.toBeNull();
  });
});
