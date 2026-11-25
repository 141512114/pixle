import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';
import {
  provideRouter,
  RouteReuseStrategy,
  withRouterConfig,
} from '@angular/router';
import { provideServiceWorker, SwUpdate } from '@angular/service-worker';
import { routes } from './app.routes';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    // The router must be provided here (root injector). Importing RouterModule.forRoot
    // into a standalone component creates a second router and breaks navigation (NG04007).
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    // Recreates the game component when the player restarts a match (see PixGameComponent)
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
    // PWA: offline support and installability (production builds only).
    // New versions are downloaded in the background and used on the next app start.
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    // If the cached version can no longer be served (e.g. files removed from the server
    // after a deploy), reload to get the current version instead of a broken app.
    provideAppInitializer(() => {
      const swUpdate = inject(SwUpdate);
      if (swUpdate.isEnabled) {
        swUpdate.unrecoverable.subscribe(() => document.location.reload());
      }
    }),
  ],
};
