// domain/entities/reward.entity.ts

export type RewardCategory = 'Alimentos' | 'Impuestos' | 'Finanzas' | 'Transporte' | 'Salud' | 'Educación' | 'Otro';
export type RedemptionStatus = 'pending' | 'approved' | 'rejected' | 'delivered';
export type TransactionType = 'earn' | 'redeem';

export class RewardEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly costDp: number,
    public readonly imageUrl: string,
    public readonly icon: string,
    public readonly category: RewardCategory,
    public readonly provider: string,
    public readonly isAvailable: boolean,
  ) {}
}

export class TransactionEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly location: string,
    public readonly category: string,
    public readonly date: string,
    public readonly amountDp: number,
    public readonly type: TransactionType,
    public readonly icon: string,
  ) {}

  get isPositive(): boolean {
    return this.type === 'earn';
  }
}

export class UserWalletEntity {
  constructor(
    public readonly userId: string,
    public readonly totalDp: number,
    public readonly ecoLevel: number,
    public readonly nextLevelDp: number,
    public readonly transactions: TransactionEntity[],
  ) {}

  get progressPercent(): number {
    return Math.min(100, Math.round((this.totalDp % this.nextLevelDp) / this.nextLevelDp * 100));
  }

  canAfford(cost: number): boolean {
    return this.totalDp >= cost;
  }
}
