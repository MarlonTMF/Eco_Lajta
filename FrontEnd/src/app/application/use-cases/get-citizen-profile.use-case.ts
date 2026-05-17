import { inject, Injectable } from '@angular/core';
import { CITIZEN_REPOSITORY_TOKEN } from '../../infrastructure/tokens/injection-tokens';
import { CitizenProfileDto } from '../dtos/citizen.dto';

@Injectable({ providedIn: 'root' })
export class GetCitizenProfileUseCase {
    private repo = inject(CITIZEN_REPOSITORY_TOKEN);

    async execute(): Promise<CitizenProfileDto> {
        return await this.repo.getProfile();
    }
}