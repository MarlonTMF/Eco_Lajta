import { inject, Injectable } from '@angular/core';
import { CITIZEN_REPOSITORY_TOKEN } from '../../infrastructure/tokens/injection-tokens';
import { DashboardStatsDto } from '../dtos/citizen.dto';

@Injectable({ providedIn: 'root' })
export class GetDashboardStatsUseCase {
    private repo = inject(CITIZEN_REPOSITORY_TOKEN);

    async execute(): Promise<DashboardStatsDto> {
      return await this.repo.getDashboardStats();
    }
}