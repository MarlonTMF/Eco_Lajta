import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpRewardsRepository } from '../../../infrastructure/repositories/http-rewards.repository';
import { RewardDTO } from '../../../application/dtos/rewards.dto';

@Component({
  selector: 'app-redeem-confirm',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './redeem-confirm.html',
  styleUrl: './redeem-confirm.css',
})
export class RedeemConfirmComponent implements OnInit {
  private route       = inject(ActivatedRoute);
  private router      = inject(Router);
  private rewardsRepo = inject(HttpRewardsRepository);

  rewardId       = signal<string>('');
  reward         = signal<RewardDTO | null>(null);
  currentBalance = signal<number>(0);
  finalBalance   = computed(() => this.currentBalance() - (this.reward()?.cost ?? 0));
  isLoading      = signal<boolean>(true);
  isRedeeming    = signal<boolean>(false);
  isSubmitting   = this.isRedeeming; // alias usado por el HTML
  errorMsg       = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.rewardId.set(id);
    this.isLoading.set(true);

    try {
      const [balanceData, catalog] = await Promise.all([
        this.rewardsRepo.getUserBalance(),
        this.rewardsRepo.getRewards(),
      ]);
      this.currentBalance.set(balanceData.balance);
      const found = catalog.find(r => r.id === id) ?? catalog[0] ?? null;
      this.reward.set(found);
    } catch {
      this.errorMsg.set('No se pudo cargar la información del premio.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async confirmRedeem(): Promise<void> {
    const activeReward = this.reward();
    if (!activeReward || this.isRedeeming()) return;

    this.isRedeeming.set(true);
    this.errorMsg.set(null);

    try {
      const result = await this.rewardsRepo.redeemReward(activeReward.id);
      if (result.success) {
        // Pasar el ticketId al siguiente componente via Router state
        this.router.navigate(['/rewards/ticket', activeReward.id], {
          state: { ticketId: result.ticketId, nombrePremio: activeReward.title }
        });
      } else {
        this.errorMsg.set(result.message ?? 'El canje no pudo procesarse.');
      }
    } catch {
      this.errorMsg.set('Error al procesar el canje. Por favor, intenta más tarde.');
    } finally {
      this.isRedeeming.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/rewards']);
  }
}
