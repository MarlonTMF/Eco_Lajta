export interface RegisterBagRequestDto {
    category: string;
    estimatedWeightKg: number;
}

export interface PickupConfirmationDto {
    pickupId: string;
    qrCodeData: string;
    estimatedPoints: number;
    status: string;
}