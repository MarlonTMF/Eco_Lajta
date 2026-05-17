import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { MockMissionRepository } from './infrastructure/repositories/mock-mission.repository';
import { MISSION_REPOSITORY_TOKEN } from './infrastructure/tokens/injection-tokens';
import { authInterceptor } from './shared/interceptors/auth-interceptor';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: MISSION_REPOSITORY_TOKEN, useClass: MockMissionRepository },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('437570902163-ffqiv27cft6udu4l6k4i407vfhjh71io.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig
    }
  ]
};