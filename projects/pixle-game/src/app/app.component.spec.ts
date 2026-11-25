import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { PixGameComponent } from './pix-game/pix-game.component';

describe('AppComponent (game)', () => {
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: appConfig.providers,
    }).compileComponents();
  });

  async function navigate(
    fixture: ReturnType<typeof TestBed.createComponent<AppComponent>>,
    url: string,
  ) {
    await TestBed.inject(Router).navigateByUrl(url);
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function gameComponent(
    fixture: ReturnType<typeof TestBed.createComponent<AppComponent>>,
  ): PixGameComponent | undefined {
    return fixture.debugElement.query(By.directive(PixGameComponent))
      ?.componentInstance;
  }

  it('redirects / to /game and renders the game', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await navigate(fixture, '/');

    expect(TestBed.inject(Router).url).toBe('/game');
    expect(gameComponent(fixture)).toBeDefined();
  });

  it('recreates the game component when a match is restarted', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await navigate(fixture, '/game');
    const before = gameComponent(fixture);

    // Same navigation sequence as PixGameComponent.receiveReloadRequest()
    await navigate(fixture, '/');
    await navigate(fixture, '/game');
    const after = gameComponent(fixture);

    expect(before).toBeDefined();
    expect(after).toBeDefined();
    expect(after).not.toBe(before);
  });
});
