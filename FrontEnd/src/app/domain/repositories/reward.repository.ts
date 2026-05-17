// domain/repositories/reward.repository.ts
import { Observable } from 'rxjs';
import { RewardEntity, TransactionEntity, UserWalletEntity } from '../entities/reward.entity';

export interface IRewardRepository {
  /** GET /api/rewards — all available reward items */
  getRewards(): Observable<RewardEntity[]>;

  /** GET /api/rewards/wallet — user's DP balance + transaction history */
  getWallet(): Observable<UserWalletEntity>;

  /** POST /api/rewards/redeem — redeem a reward by ID */
  redeemReward(rewardId: string): Observable<{ redemptionId: string; newBalance: number }>;

  /** GET /api/rewards/transactions — user's transaction history */
  getTransactions(): Observable<TransactionEntity[]>;
}
