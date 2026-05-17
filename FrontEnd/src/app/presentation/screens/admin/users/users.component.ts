import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface CitizenEntity {
  id: string;
  name: string;
  email: string;
  ci: string;
  zone: string;
  ecoTokenBalance: number;
  status: 'Active' | 'Suspended';
  avatarUrl: string;
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
  // State Signals
  citizens = signal<CitizenEntity[]>([
    {
      id: 'cit-1',
      name: 'Alejandra Vargas',
      email: 'a.vargas@email.com',
      ci: '7928341 SC',
      zone: 'Cala Cala',
      ecoTokenBalance: 1240,
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80'
    },
    {
      id: 'cit-2',
      name: 'Ricardo Mendez',
      email: 'r.mendez@city.bo',
      ci: '5482910 CB',
      zone: 'La Chimba',
      ecoTokenBalance: 850,
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80'
    },
    {
      id: 'cit-3',
      name: 'Sofia Rojas',
      email: 's.rojas@mail.com',
      ci: '9201833 BN',
      zone: 'Quillacollo',
      ecoTokenBalance: 2100,
      status: 'Suspended',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80'
    },
    {
      id: 'cit-4',
      name: 'Lucia Claros',
      email: 'l.claros@provider.bo',
      ci: '8172645 CB',
      zone: 'Sacaba',
      ecoTokenBalance: 315,
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'
    },
    {
      id: 'cit-5',
      name: 'Mateo Velasco',
      email: 'm.velasco@gmail.com',
      ci: '6129847 CB',
      zone: 'Cala Cala',
      ecoTokenBalance: 2450,
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80'
    },
    {
      id: 'cit-6',
      name: 'Carlos Espinoza',
      email: 'c.espinoza@hotmail.com',
      ci: '4839201 CB',
      zone: 'La Chimba',
      ecoTokenBalance: 150,
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80'
    }
  ]);

  otbs = signal<OtbCommitment[]>([
    { rank: 1, name: 'Cala Cala', region: 'Zona Norte', participationPercent: 92, icon: 'park', iconColor: 'var(--primary)' },
    { rank: 2, name: 'La Chimba', region: 'Zona Central', participationPercent: 78, icon: 'waves', iconColor: '#00639a' },
    { rank: 3, name: 'Quillacollo', region: 'Zona Oeste', participationPercent: 65, icon: 'landscape', iconColor: '#704d40' },
    { rank: 4, name: 'Sacaba', region: 'Zona Este', participationPercent: 59, icon: 'apartment', iconColor: '#00436a' }
  ]);

  searchText = signal<string>('');
  selectedZone = signal<string>('All');

  // Computed signals for search and filters
  filteredCitizens = computed(() => {
    const query = this.searchText().toLowerCase().trim();
    const zone = this.selectedZone();

    return this.citizens().filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(query) ||
                            c.email.toLowerCase().includes(query) ||
                            c.ci.toLowerCase().includes(query);
      const matchesZone = zone === 'All' || c.zone === zone;

      return matchesSearch && matchesZone;
    });
  });

  // Zones for selector
  zones = computed(() => {
    const allZones = this.citizens().map(c => c.zone);
    return ['All', ...new Set(allZones)];
  });

  ngOnInit(): void {}

  toggleUserStatus(citizen: CitizenEntity): void {
    this.citizens.update(list => list.map(c => {
      if (c.id === citizen.id) {
        const newStatus = c.status === 'Active' ? 'Suspended' : 'Active';
        return { ...c, status: newStatus };
      }
      return c;
    }));
  }

  deleteUser(citizenId: string): void {
    if (confirm('¿Estás seguro de eliminar a este ciudadano del sistema?')) {
      this.citizens.update(list => list.filter(c => c.id !== citizenId));
    }
  }
}
