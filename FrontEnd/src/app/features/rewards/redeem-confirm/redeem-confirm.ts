import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpRewardsRepository } from '../../../infrastructure/repositories/http-rewards.repository';
import { RewardDTO, BalanceDTO } from '../../../application/dtos/rewards.dto';

@Component({
  selector: 'app-redeem-confirm',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './redeem-confirm.html',
  styleUrl: './redeem-confirm.css',
})
export class RedeemConfirmComponent implements OnInit {
  rewardId = signal<string>('');
  reward = signal<RewardDTO | null>(null);
  currentBalance = signal<number>(0);
  finalBalance = signal<number>(0);

  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  errorMsg = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rewardsRepo: HttpRewardsRepository
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.rewardId.set(id);
    this.isLoading.set(true);
    this.errorMsg.set(null);

    try {
      const [rewardsList, balance] = await Promise.all([
        this.rewardsRepo.getRewards(),
        this.rewardsRepo.getUserBalance(),
      ]);

      this.currentBalance.set(balance.dirtyPoints);

      const found = rewardsList.find(r => r.id === id) ?? rewardsList[0];
      this.reward.set(found ?? null);

      if (found) {
        this.finalBalance.set(balance.dirtyPoints - found.costo);
      }
    } catch {
      this.errorMsg.set('No se pudo cargar la información del premio. Intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async confirmRedeem(): Promise<void> {
    const activeReward = this.reward();
    if (!activeReward || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMsg.set(null);

    try {
      const result = await this.rewardsRepo.redeemReward(activeReward.id);
      if (result.exitoso) {
        // Guardamos el resultado en sessionStorage para mostrarlo en el ticket
        sessionStorage.setItem('redeemResult', JSON.stringify(result));
        this.router.navigate(['/rewards/ticket', activeReward.id]);
      } else {
        this.errorMsg.set('El canje no pudo procesarse. Verifica tu saldo e intenta de nuevo.');
      }
    } catch {
      this.errorMsg.set('Error al procesar el canje. Por favor, intenta más tarde.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/rewards']);
  }
}
