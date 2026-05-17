import { InjectionToken } from '@angular/core';
import { IMissionRepository } from '../../domain/repositories/mission.repository';
import { IRewardRepository } from '../../domain/repositories/reward.repository';
import { MapPointRepository } from '../../domain/repositories/map-point.repository';


export const MISSION_REPOSITORY_TOKEN = new InjectionToken<IMissionRepository>('IMissionRepository');
export const REWARD_REPOSITORY_TOKEN  = new InjectionToken<IRewardRepository>('IRewardRepository');
export const MAP_POINT_REPOSITORY_TOKEN = new InjectionToken<MapPointRepository>('MapPointRepository');