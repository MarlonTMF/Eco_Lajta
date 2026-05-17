// application/use-cases/get-mission-detail.use-case.ts
import { inject, Injectable } from '@angular/core';
import { MISSION_REPOSITORY_TOKEN } from '../../infrastructure/tokens/injection-tokens';
import { mapMissionToDto }          from '../mappers/mission.mapper';
import { MissionDto }               from '../dtos/mission.dto';

@Injectable({ providedIn: 'root' })
export class GetMissionDetailUseCase {
  private repo = inject(MISSION_REPOSITORY_TOKEN);

  async execute(id: string): Promise<MissionDto | null> {
    const mission = await this.repo.getById(id);
    return mission ? mapMissionToDto(mission) : null;
  }
}
