// application/dtos/reward.dto.ts

/** Raw JSON shape coming from the Backend REST API */

export interface RewardDto {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  imageUrl: string;
  iconName: string;
  category: string;
  provider: string;
  available: boolean;
}

export interface TransactionDto {
  id: string;
  description: string;
  location: string;
  category: string;
  createdAt: string; // ISO date string
  points: number;    // positive = earn, negative = redeem
  icon: string;
}

export interface WalletDto {
  userId: string;
  totalPoints: number;
  ecoLevel: number;
  nextLevelPoints: number;
  transactions: TransactionDto[];
}

export interface RedeemResponseDto {
  redemptionId: string;
  newBalance: number;
}
