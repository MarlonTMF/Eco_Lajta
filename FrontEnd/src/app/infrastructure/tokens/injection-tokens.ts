import { InjectionToken } from '@angular/core';
import { IMissionRepository } from '../../domain/repositories/mission.repository';
import { ICitizenRepository } from '../../domain/repositories/citizen.repository';
import { IRecyclingRepository } from '../../domain/repositories/recycling.repository';

export const MISSION_REPOSITORY_TOKEN = new InjectionToken<IMissionRepository>('IMissionRepository');
export const CITIZEN_REPOSITORY_TOKEN = new InjectionToken<ICitizenRepository>('ICitizenRepository');
export const RECYCLING_REPOSITORY_TOKEN = new InjectionToken<IRecyclingRepository>('IRecyclingRepository');