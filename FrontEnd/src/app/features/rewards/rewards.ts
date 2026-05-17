import { Component, OnInit, signal, computed } from '@angular/core';
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
export class RewardsComponent implements OnInit {
  userBalance = signal<number>(0);
  ecoHeroProgress = signal<number>(0);
  rewards = signal<RewardDTO[]>([]);
  isLoading = signal<boolean>(true);
  errorMsg = signal<string | null>(null);

  transactions = signal<TransactionItem[]>([
    {
      id: 'tx-1',
      title: 'Reciclaje de PET',
      location: 'Centro de acopio Sur',
      category: 'Reciclaje',
      date: '24 Oct, 2026',
      amount: 45,
      isPositive: true,
      icon: 'recycling',
    },
    {
      id: 'tx-2',
      title: 'Canje EMAPA',
      location: 'Canje de beneficios',
      category: 'Recompensa',
      date: '22 Oct, 2026',
      amount: 200,
      isPositive: false,
      icon: 'shopping_cart',
    },
    {
      id: 'tx-3',
      title: 'Entrega de compost',
      location: 'Residuos orgánicos',
      category: 'Reciclaje',
      date: '20 Oct, 2026',
      amount: 120,
      isPositive: true,
      icon: 'compost',
    },
  ]);

  constructor(
    private router: Router,
    private rewardsRepo: HttpRewardsRepository
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    this.errorMsg.set(null);
    try {
      const [rewardsList, balance] = await Promise.all([
        this.rewardsRepo.getRewards(),
        this.rewardsRepo.getUserBalance(),
      ]);
      this.rewards.set(rewardsList);
      this.userBalance.set(balance.dirtyPoints);
      // Progreso eco-héroe: cada 3000 DP = un nivel; mostramos % dentro del nivel actual
      this.ecoHeroProgress.set(Math.min(100, Math.round((balance.dirtyPoints % 3000) / 30)));
    } catch {
      this.errorMsg.set('No se pudo cargar la información. Por favor, intenta de nuevo más tarde.');
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Devuelve cuántos Dirty Points le faltan al usuario para canjear un premio. 0 si puede canjearlo. */
  deficit(reward: RewardDTO): number {
    return Math.max(0, reward.costo - this.userBalance());
  }

  canRedeem(reward: RewardDTO): boolean {
    return this.userBalance() >= reward.costo;
  }

  redeemReward(reward: RewardDTO): void {
    if (!this.canRedeem(reward)) return;
    this.router.navigate(['/rewards/confirm', reward.id]);
  }
}
