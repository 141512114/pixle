import {bootstrapApplication} from '@angular/platform-browser';
import {provideClientHydration} from '@angular/platform-browser';

import {AppComponent} from './app/app.component';
import {environment} from '../../pixle-game/src/environments/environment';
import {enableProdMode} from '@angular/core';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(),
  ],
}).catch(err => console.error(err));
