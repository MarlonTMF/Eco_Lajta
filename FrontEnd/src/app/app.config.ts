import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { MockMissionRepository } from './infrastructure/repositories/mock-mission.repository';
import { MISSION_REPOSITORY_TOKEN } from './infrastructure/tokens/injection-tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: MISSION_REPOSITORY_TOKEN, useClass: MockMissionRepository }
  ]
};
