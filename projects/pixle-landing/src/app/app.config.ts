import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // The router must be provided here (root injector). Importing RouterModule.forRoot
    // into a standalone component creates a second router and breaks navigation (NG04007).
    provideRouter(routes),
  ],
};
