import { InjectionToken } from '@angular/core';
import { IMissionRepository } from '../../domain/repositories/mission.repository';

export const MISSION_REPOSITORY_TOKEN = new InjectionToken<IMissionRepository>('IMissionRepository');
