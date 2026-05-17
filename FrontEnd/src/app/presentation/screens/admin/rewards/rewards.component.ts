import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { REWARD_REPOSITORY_TOKEN } from '../../../../infrastructure/tokens/injection-tokens';
import { RewardEntity, RewardCategory } from '../../../../domain/entities/reward.entity';

@Component({
  standalone: true,
  selector: 'app-admin-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdminRewardsComponent implements OnInit {
  private rewardRepo = inject(REWARD_REPOSITORY_TOKEN);

  rewards = signal<RewardEntity[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  // Modal State Signal
  isCreateModalOpen = signal<boolean>(false);

  // Form Fields
  newRewardTitle = signal<string>('');
  newRewardProvider = signal<string>('');
  newRewardCost = signal<number>(100);
  newRewardCategory = signal<string>('Alimentos');
  newRewardDescription = signal<string>('');
  newRewardImageUrl = signal<string>('');
  newRewardIcon = signal<string>('eco');
  newRewardIsAvailable = signal<boolean>(true);

  ngOnInit(): void {
    this.loadRewards();
  }

  loadRewards(): void {
    this.isLoading.set(true);
    this.rewardRepo.getRewards().subscribe({
      next: (items) => {
        this.rewards.set(items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[AdminRewards] Load error:', err);
        this.errorMessage.set('Error al cargar las recompensas.');
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.isCreateModalOpen.set(true);
    this.newRewardTitle.set('');
    this.newRewardProvider.set('');
    this.newRewardCost.set(100);
    this.newRewardCategory.set('Alimentos');
    this.newRewardDescription.set('');
    this.newRewardImageUrl.set('');
    this.newRewardIcon.set('eco');
    this.newRewardIsAvailable.set(true);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
  }

  createReward(): void {
    const title = this.newRewardTitle().trim();
    const provider = this.newRewardProvider().trim();
    const cost = this.newRewardCost();
    const category = this.newRewardCategory() as RewardCategory;
    const description = this.newRewardDescription().trim();
    let imageUrl = this.newRewardImageUrl().trim();
    const icon = this.newRewardIcon().trim();
    const isAvailable = this.newRewardIsAvailable();

    if (!title || !provider || !description) {
      alert('Por favor, completa los campos obligatorios (Título, Proveedor y Descripción).');
      return;
    }

    if (!imageUrl) {
      if (category === 'Alimentos') {
        imageUrl = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=400';
      } else if (category === 'Impuestos') {
        imageUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400';
      } else if (category === 'Finanzas') {
        imageUrl = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400';
      } else {
        imageUrl = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400';
      }
    }

    const newReward = new RewardEntity(
      'reward-' + Date.now(),
      title,
      description,
      cost,
      imageUrl,
      icon,
      category,
      provider,
      isAvailable
    );

    this.rewards.update(items => [newReward, ...items]);
    this.closeCreateModal();
  }

  deleteReward(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta recompensa de la lista?')) {
      this.rewards.update(items => items.filter(item => item.id !== id));
    }
  }

  toggleAvailability(reward: RewardEntity): void {
    this.rewards.update(items => items.map(item => {
      if (item.id === reward.id) {
        // Create new entity instance with inverted isAvailable
        return new RewardEntity(
          item.id,
          item.title,
          item.description,
          item.costDp,
          item.imageUrl,
          item.icon,
          item.category,
          item.provider,
          !item.isAvailable
        );
      }
      return item;
    }));
  }
}
