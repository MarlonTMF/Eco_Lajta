import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { USER_REPOSITORY_TOKEN } from '../../../../infrastructure/tokens/injection-tokens';
import { AdminUserDTO, AdminUserUpdateDTO } from '../../../../domain/repositories/user.repository';

export interface CitizenEntity {
  id: string; // The backend uses numeric id, we map it to string for UI if needed, or keep number.
  name: string;
  email: string;
  ci: string;
  zone: string;
  ecoTokenBalance: number;
  status: 'Active' | 'Suspended';
  avatarUrl: string;
  rawRole: string;
}

export interface OtbCommitment {
  rank: number;
  name: string;
  region: string;
  participationPercent: number;
  icon: string;
  iconColor: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdminUsersComponent implements OnInit {
  private userRepo = inject(USER_REPOSITORY_TOKEN);

  // State Signals
  citizens = signal<CitizenEntity[]>([]);

  otbs = signal<OtbCommitment[]>([
    { rank: 1, name: 'Cala Cala', region: 'Zona Norte', participationPercent: 92, icon: 'park', iconColor: 'var(--primary)' },
    { rank: 2, name: 'La Chimba', region: 'Zona Central', participationPercent: 78, icon: 'waves', iconColor: '#00639a' },
    { rank: 3, name: 'Quillacollo', region: 'Zona Oeste', participationPercent: 65, icon: 'landscape', iconColor: '#704d40' },
    { rank: 4, name: 'Sacaba', region: 'Zona Este', participationPercent: 59, icon: 'apartment', iconColor: '#00436a' }
  ]);

  searchText = signal<string>('');
  selectedZone = signal<string>('All');

  // Edit Modal State
  isEditModalOpen = signal<boolean>(false);
  editingUserId = signal<string | null>(null);
  
  // Form fields
  editFullName = signal<string>('');
  editCi = signal<string>('');
  editZone = signal<string>('');
  editEcoTokenBalance = signal<number>(0);
  editStatus = signal<'Active'|'Suspended'>('Active');

  // Computed signals for search and filters
  filteredCitizens = computed(() => {
    const query = this.searchText().toLowerCase().trim();
    const zone = this.selectedZone();

    return this.citizens().filter(c => {
      const nameStr = c.name || '';
      const emailStr = c.email || '';
      const ciStr = c.ci || '';
      const matchesSearch = nameStr.toLowerCase().includes(query) ||
                            emailStr.toLowerCase().includes(query) ||
                            ciStr.toLowerCase().includes(query);
      const matchesZone = zone === 'All' || c.zone === zone;

      return matchesSearch && matchesZone;
    });
  });

  // Zones for selector
  zones = computed(() => {
    const allZones = this.citizens().map(c => c.zone).filter(z => !!z);
    return ['All', ...new Set(allZones)];
  });

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      const backendUsers = await this.userRepo.getAllUsers();
      const mapped: CitizenEntity[] = backendUsers.map(u => ({
        id: u.id.toString(),
        name: u.fullName || 'Sin Nombre',
        email: u.email,
        ci: u.ci || 'N/A',
        zone: u.zone || 'Sin Zona',
        ecoTokenBalance: u.pointsBalance || 0,
        status: u.isActive ? 'Active' : 'Suspended',
        avatarUrl: u.photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.fullName || 'U'),
        rawRole: u.role
      }));
      this.citizens.set(mapped);
    } catch (error) {
      console.error('Error loading users', error);
    }
  }

  async toggleUserStatus(citizen: CitizenEntity) {
    const newIsActive = citizen.status !== 'Active';
    try {
      await this.userRepo.updateUser(Number(citizen.id), { isActive: newIsActive });
      this.citizens.update(list => list.map(c => {
        if (c.id === citizen.id) {
          return { ...c, status: newIsActive ? 'Active' : 'Suspended' };
        }
        return c;
      }));
    } catch (error) {
      console.error('Error updating status', error);
      alert('Error al actualizar el estado.');
    }
  }

  openEditModal(citizen: CitizenEntity) {
    this.editingUserId.set(citizen.id);
    this.editFullName.set(citizen.name);
    this.editCi.set(citizen.ci);
    this.editZone.set(citizen.zone);
    this.editEcoTokenBalance.set(citizen.ecoTokenBalance);
    this.editStatus.set(citizen.status);
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.editingUserId.set(null);
  }

  async saveEditedUser() {
    const id = this.editingUserId();
    if (!id) return;
    
    try {
      const payload: AdminUserUpdateDTO = {
        fullName: this.editFullName(),
        ci: this.editCi(),
        zone: this.editZone(),
        pointsBalance: this.editEcoTokenBalance(),
        isActive: this.editStatus() === 'Active'
      };
      
      await this.userRepo.updateUser(Number(id), payload);
      await this.loadUsers(); // refresh from db
      this.closeEditModal();
    } catch (error) {
      console.error('Error saving user', error);
      alert('Error al guardar cambios del usuario.');
    }
  }

  async deleteUser(citizenId: string) {
    if (confirm('La eliminación dura no está habilitada. ¿Deseas suspender a este ciudadano en su lugar?')) {
      try {
        await this.userRepo.updateUser(Number(citizenId), { isActive: false });
        await this.loadUsers();
      } catch (e) {
        console.error(e);
      }
    }
  }
}
