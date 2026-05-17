import { RegisterBagRequestDto, PickupConfirmationDto } from '../../application/dtos/recycling.dto';

export interface IRecyclingRepository {
    registerPickup(data: RegisterBagRequestDto): Promise<PickupConfirmationDto>;
}