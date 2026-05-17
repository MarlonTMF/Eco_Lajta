// application/use-cases/get-missions.use-case.ts
import { inject, Injectable } from '@angular/core';
import { MISSION_REPOSITORY_TOKEN } from '../../infrastructure/tokens/injection-tokens';
import { mapMissionToDto }          from '../mappers/mission.mapper';
import { AdminMissionsPageDto }     from '../dtos/mission.dto';

@Injectable({ providedIn: 'root' })
export class GetMissionsUseCase {
  private repo = inject(MISSION_REPOSITORY_TOKEN);

  async execute(): Promise<AdminMissionsPageDto> {
    const missions = await this.repo.getAll();
    return {
      totalDirtyPointsDistributed: 142500,
      activeMissionsCount: missions.filter(m => m.isLive).length,
      activeVolunteers: 2480,
      qrVerificationRate: 94.2,
      missions: missions.map(mapMissionToDto),
      otbRankings: [
        { rank: 1, name: 'OTB Sarco',      members: 450, dirtyPointsDistributed: 12000, efficiencyPercent: 98 },
        { rank: 2, name: 'OTB Queru Queru',members: 320, dirtyPointsDistributed: 8500,  efficiencyPercent: 92 },
        { rank: 3, name: 'OTB San Miguel', members: 210, dirtyPointsDistributed: 5200,  efficiencyPercent: 85 },
      ],
    };
  }
}
