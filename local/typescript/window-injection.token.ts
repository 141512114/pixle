import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>(
  'A reference to the window object',
  {
    factory: () => window,
  }
);
