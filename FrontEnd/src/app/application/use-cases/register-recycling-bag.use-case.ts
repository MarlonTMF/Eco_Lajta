import { inject, Injectable } from '@angular/core';
import { RECYCLING_REPOSITORY_TOKEN } from '../../infrastructure/tokens/injection-tokens';
import { RegisterBagRequestDto, PickupConfirmationDto } from '../dtos/recycling.dto';

@Injectable({ providedIn: 'root' })
export class RegisterRecyclingBagUseCase {
    private repo = inject(RECYCLING_REPOSITORY_TOKEN);

    async execute(data: RegisterBagRequestDto): Promise<PickupConfirmationDto> {
        return await this.repo.registerPickup(data);
    }
}