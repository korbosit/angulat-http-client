import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withDebugTracing,
  withRouterConfig,
} from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptorService } from './Services/auth-interceptor.sevice';
import { LoggingInterceptorService } from './Services/logging-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withDebugTracing(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ),
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptorService,
      multi: true,
    },
  ],
};
