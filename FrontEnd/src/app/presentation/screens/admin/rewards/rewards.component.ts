import { environment } from '../../../../../environments/environment';
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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
  private http = inject(HttpClient);

  rewards = signal<RewardEntity[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  // Modal State Signal
  isCreateModalOpen = signal<boolean>(false);
  editingRewardId = signal<string | null>(null);
  isDragging = signal<boolean>(false);

  // Form Fields
  newRewardTitle = signal<string>('');
  newRewardProvider = signal<string>('');
  newRewardCost = signal<number>(100);
  newRewardCategory = signal<string>('Alimentos');
  newRewardDescription = signal<string>('');
  newRewardImageUrl = signal<string>('');
  newRewardIcon = signal<string>('eco');
  newRewardIsAvailable = signal<boolean>(true);
  selectedFile = signal<File | null>(null);

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
    this.editingRewardId.set(null);
    this.newRewardTitle.set('');
    this.newRewardProvider.set('');
    this.newRewardCost.set(100);
    this.newRewardCategory.set('Alimentos');
    this.newRewardDescription.set('');
    this.newRewardImageUrl.set('');
    this.newRewardIcon.set('eco');
    this.newRewardIsAvailable.set(true);
  }

  openEditModal(reward: RewardEntity): void {
    this.isCreateModalOpen.set(true);
    this.editingRewardId.set(reward.id);
    this.newRewardTitle.set(reward.title);
    this.newRewardProvider.set(reward.provider);
    this.newRewardCost.set(reward.costDp);
    this.newRewardCategory.set(reward.category);
    this.newRewardDescription.set(reward.description);
    this.newRewardImageUrl.set(reward.imageUrl);
    this.newRewardIcon.set(reward.icon);
    this.newRewardIsAvailable.set(reward.isAvailable);
  }

  closeCreateModal(): void {
    this.isCreateModalOpen.set(false);
    this.selectedFile.set(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectedFile.set(event.dataTransfer.files[0]);
    }
  }

  async createReward(): Promise<void> {
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

    if (this.selectedFile()) {
      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile() as Blob);
        const uploadRes = await firstValueFrom(this.http.post<{success: boolean, value: string}>(environment.apiUrl + '/upload', formData));
        if (uploadRes.success && uploadRes.value) {
          imageUrl = uploadRes.value;
        }
      } catch (err) {
        console.error('Failed to upload image', err);
      }
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

    const payload = {
      name: title,
      description: description,
      pointsCost: cost,
      stock: isAvailable ? 100 : 0,
      provider: provider,
      category: category,
      imageUrl: imageUrl,
      icon: icon
    };

    try {
      const editId = this.editingRewardId();
      if (editId) {
        const newEntity = await firstValueFrom(this.rewardRepo.updateReward(editId, payload));
        this.rewards.update(items => items.map(item => item.id === editId ? newEntity : item));
      } else {
        const newEntity = await firstValueFrom(this.rewardRepo.createReward(payload));
        this.rewards.update(items => [newEntity, ...items]);
      }
      this.closeCreateModal();
    } catch (e) {
      console.error('Failed to save reward', e);
      alert('Hubo un error al guardar la recompensa');
    }
  }

  async deleteReward(id: string): Promise<void> {
    if (confirm('¿Estás seguro de que deseas eliminar esta recompensa de la lista?')) {
      try {
        await firstValueFrom(this.rewardRepo.deleteReward(id));
        this.rewards.update(items => items.filter(item => item.id !== id));
      } catch (e) {
        console.error('Failed to delete reward', e);
        alert('No se pudo eliminar la recompensa');
      }
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
