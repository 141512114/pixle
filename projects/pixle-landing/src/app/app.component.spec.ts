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

  it('renders the countdown to the next pixle', async () => {
    const fixture = await renderAt('/home');
    const countdown: HTMLElement =
      fixture.nativeElement.querySelector('#pixle-countdown');
    const time = ['hours', 'minutes', 'seconds'].map(
      (unit) => countdown.querySelector(`span.${unit}`)!.textContent,
    );
    expect(time.every((value) => /^\d{2}$/.test(value ?? ''))).toBe(true);
    expect(time).not.toEqual(['99', '99', '99']);
  });

  it('shows the navbar only after scrolling past the welcome section', async () => {
    const fixture = await renderAt('/home');
    const navbar: HTMLElement = fixture.nativeElement.querySelector('#main-navbar');
    expect(navbar.classList).toContain('do-not-show');

    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
    expect(navbar.classList).not.toContain('do-not-show');

    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    await fixture.whenStable();
    expect(navbar.classList).toContain('do-not-show');
  });

  it('scrolls to the how-to guide', async () => {
    const fixture = await renderAt('/home');
    const guide: HTMLElement = fixture.nativeElement.querySelector('#how-to-play');
    guide.scrollIntoView = vi.fn();

    fixture.nativeElement
      .querySelector('button[aria-label="Click to visit the how-to guide"]')
      .click();

    expect(guide.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('redirects unknown urls to /home', async () => {
    const fixture = await renderAt('/does-not-exist');
    expect(TestBed.inject(Router).url).toBe('/home');
    expect(fixture.nativeElement.querySelector('app-pix-home')).not.toBeNull();
  });
});
