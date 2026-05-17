import { Component, inject, computed, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpRewardsRepository } from '../../infrastructure/repositories/http-rewards.repository';
import { RewardDTO } from '../../application/dtos/rewards.dto';

interface TransactionItem {
  id: string;
  title: string;
  location: string;
  category: string;
  date: string;
  amount: number;
  isPositive: boolean;
  icon: string;
}

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rewards.html',
  styleUrl: './rewards.css',
})
export class RewardsComponent {
  private router      = inject(Router);
  private rewardsRepo = inject(HttpRewardsRepository);

  // Carga automática desde el backend
  balanceResource = resource({ loader: () => this.rewardsRepo.getUserBalance() });
  rewardsResource = resource({ loader: () => this.rewardsRepo.getRewards() });

  // Señales computadas
  userBalance    = computed(() => this.balanceResource.value()?.balance ?? 0);
  rewards        = computed(() => this.rewardsResource.value() ?? []);
  ecoHeroProgress = computed(() => Math.min(100, Math.round((this.userBalance() % 3000) / 30)));

  // Historial de transacciones (estático hasta que el backend lo exponga)
  transactions = signal<TransactionItem[]>([
    { id: 'tx-1', title: 'Reciclaje de PET',   location: 'Centro de acopio Sur',  category: 'Reciclaje',  date: '24 Oct, 2026', amount: 45,  isPositive: true,  icon: 'recycling'      },
    { id: 'tx-2', title: 'Canje EMAPA',         location: 'Canje de beneficios',   category: 'Recompensa', date: '22 Oct, 2026', amount: 200, isPositive: false, icon: 'shopping_cart'  },
    { id: 'tx-3', title: 'Entrega de compost',  location: 'Residuos orgánicos',    category: 'Reciclaje',  date: '20 Oct, 2026', amount: 120, isPositive: true,  icon: 'compost'        },
  ]);

  isLoading = computed(() => this.balanceResource.isLoading() || this.rewardsResource.isLoading());
  hasError  = computed(() => !!this.balanceResource.error() || !!this.rewardsResource.error());

  deficit(reward: RewardDTO): number {
    return Math.max(0, reward.cost - this.userBalance());
  }

  canRedeem(reward: RewardDTO): boolean {
    return this.userBalance() >= reward.cost;
  }

  redeemReward(reward: RewardDTO): void {
    if (!this.canRedeem(reward)) return;
    this.router.navigate(['/rewards/confirm', reward.id]);
  }
}
