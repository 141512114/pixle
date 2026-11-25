import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import {AppComponent} from './app/app.component';
import {routes} from './app/app-routing.module';

bootstrapApplication(AppComponent, {
  providers: [
    // The router must be provided here (root injector). Importing RouterModule.forRoot
    // into a standalone component creates a second router and breaks navigation (NG04007).
    provideRouter(routes),
  ],
}).catch(err => console.error(err));
