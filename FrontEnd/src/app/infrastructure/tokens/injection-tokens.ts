import { InjectionToken } from '@angular/core';
import { IMissionRepository } from '../../domain/repositories/mission.repository';
import { IRewardRepository } from '../../domain/repositories/reward.repository';

export const MISSION_REPOSITORY_TOKEN = new InjectionToken<IMissionRepository>('IMissionRepository');
export const REWARD_REPOSITORY_TOKEN  = new InjectionToken<IRewardRepository>('IRewardRepository');
