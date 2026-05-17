import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { HttpMissionRepository } from './infrastructure/repositories/http-mission.repository';
import { HttpRewardRepository } from './infrastructure/repositories/http-reward.repository';
import { MISSION_REPOSITORY_TOKEN, REWARD_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from './infrastructure/tokens/injection-tokens';
import { authInterceptor } from './shared/interceptors/auth-interceptor';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { MAP_POINT_REPOSITORY_TOKEN } from './infrastructure/tokens/injection-tokens';
import { HttpMapPointRepository } from './infrastructure/repositories/http-map-point.repository';
import { HttpUserRepository } from './infrastructure/repositories/http-user.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    { provide: MISSION_REPOSITORY_TOKEN, useClass: HttpMissionRepository },
    { provide: REWARD_REPOSITORY_TOKEN, useClass: HttpRewardRepository },
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
    },
    { provide: MAP_POINT_REPOSITORY_TOKEN, useClass: HttpMapPointRepository },
    { provide: USER_REPOSITORY_TOKEN, useClass: HttpUserRepository },
  ]
};