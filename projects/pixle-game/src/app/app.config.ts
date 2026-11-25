import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  RouteReuseStrategy,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app.routes';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    // The router must be provided here (root injector). Importing RouterModule.forRoot
    // into a standalone component creates a second router and breaks navigation (NG04007).
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    // Recreates the game component when the player restarts a match (see PixGameComponent)
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
  ],
};
