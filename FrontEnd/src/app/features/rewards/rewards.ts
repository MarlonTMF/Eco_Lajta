import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { REWARD_REPOSITORY_TOKEN } from '../../infrastructure/tokens/injection-tokens';
import { RewardEntity, TransactionEntity, UserWalletEntity } from '../../domain/entities/reward.entity';

type LoadingState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rewards.html',
  styleUrl: './rewards.css',
})
export class RewardsComponent implements OnInit {
  private rewardRepo = inject(REWARD_REPOSITORY_TOKEN);
  private router = inject(Router);

  // ── State Signals ────────────────────────────────────────────
  loadingState  = signal<LoadingState>('loading');
  wallet        = signal<UserWalletEntity | null>(null);
  rewards       = signal<RewardEntity[]>([]);
  errorMessage  = signal<string>('');

  // ── Computed ─────────────────────────────────────────────────
  userBalance    = computed(() => this.wallet()?.totalDp ?? 0);
  transactions   = computed(() => this.wallet()?.transactions ?? []);
  ecoHeroProgress = computed(() => this.wallet()?.progressPercent ?? 0);
  isLoading      = computed(() => this.loadingState() === 'loading');
  hasError       = computed(() => this.loadingState() === 'error');

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadingState.set('loading');

    // Load wallet and rewards in parallel
    let walletDone = false;
    let rewardsDone = false;
    let hasAnyError = false;

    const checkDone = () => {
      if (walletDone && rewardsDone) {
        this.loadingState.set(hasAnyError ? 'error' : 'success');
      }
    };

    this.rewardRepo.getWallet().subscribe({
      next: wallet => {
        this.wallet.set(wallet);
        walletDone = true;
        checkDone();
      },
      error: (err) => {
        console.error('[Rewards] Wallet error:', err);
        hasAnyError = true;
        walletDone = true;
        checkDone();
      }
    });

    this.rewardRepo.getRewards().subscribe({
      next: items => {
        this.rewards.set(items);
        rewardsDone = true;
        checkDone();
      },
      error: (err) => {
        console.error('[Rewards] Rewards error:', err);
        hasAnyError = true;
        rewardsDone = true;
        checkDone();
      }
    });
  }

  redeemReward(reward: RewardEntity): void {
    if (!this.wallet()?.canAfford(reward.costDp)) {
      alert(`Lo sentimos, necesitas ${reward.costDp} DP para este canje. ¡Sigue reciclando!`);
      return;
    }
    // Navigate to confirmation screen passing the reward id
    this.router.navigate(['/rewards/confirm', reward.id]);
  }
}
