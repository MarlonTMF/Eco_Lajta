// application/use-cases/create-mission.use-case.ts
import { inject, Injectable } from '@angular/core';
import { MISSION_REPOSITORY_TOKEN } from '../../infrastructure/tokens/injection-tokens';
import { CreateMissionFormDto, MissionDto } from '../dtos/mission.dto';
import { mapMissionToDto }                  from '../mappers/mission.mapper';

@Injectable({ providedIn: 'root' })
export class CreateMissionUseCase {
  private repo = inject(MISSION_REPOSITORY_TOKEN);

  async execute(form: CreateMissionFormDto): Promise<MissionDto> {
    const entity = await this.repo.create({
      title:                  form.title,
      description:            form.description,
      rewardPoolDirtyPoints:  form.rewardPoolDirtyPoints,
      slotsTotal:             form.slotsTotal,
      district:               form.district,
      imageUrl:               form.imageUrl,
    });
    return mapMissionToDto(entity);
  }
}
