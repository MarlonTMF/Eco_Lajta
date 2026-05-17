import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RewardDTO, BalanceDTO, RedeemResultDTO } from '../../application/dtos/rewards.dto';

@Injectable({ providedIn: 'root' })
export class HttpRewardsRepository {
  private readonly base = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  getRewards(): Promise<RewardDTO[]> {
    return firstValueFrom(this.http.get<RewardDTO[]>(`${this.base}/rewards`));
  }

  getUserBalance(): Promise<BalanceDTO> {
    return firstValueFrom(this.http.get<BalanceDTO>(`${this.base}/rewards/balance`));
  }

  redeemReward(rewardId: string): Promise<RedeemResultDTO> {
    return firstValueFrom(
      this.http.post<RedeemResultDTO>(`${this.base}/rewards/redeem`, { rewardId })
    );
  }
}
