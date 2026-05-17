import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './community.html',
  styleUrl: './community.css',
})
export class CommunityComponent {
  selectedPeriod = signal<string>('month');

  podium = [
    {
      rank: 2,
      name: 'Sofía M.',
      points: 9820,
      avatar: 'https://i.pravatar.cc/100?img=5',
      badge: 'ZONA NORTE',
      color: '#C0C0C0',
      borderClass: 'border-silver'
    },
    {
      rank: 1,
      name: 'Alejandro V.',
      points: 12450,
      avatar: 'https://i.pravatar.cc/100?img=8',
      badge: 'GUARDIÁN DEL VALLE',
      color: '#FFD700',
      borderClass: 'border-gold',
      isCrown: true
    },
    {
      rank: 3,
      name: 'Renato G.',
      points: 8540,
      avatar: 'https://i.pravatar.cc/100?img=12',
      badge: 'ZONA SUR',
      color: '#CD7F32',
      borderClass: 'border-bronze'
    }
  ];

  leaderboard = [
    {
      rank: 4,
      name: 'Mónica Quiroga',
      zone: 'Zona Norte',
      points: 7210,
      growth: '+12%',
      initials: 'MQ',
      avatar: 'https://i.pravatar.cc/40?img=3'
    },
    {
      rank: 5,
      name: 'Diego Flores',
      zone: 'Zona Central',
      points: 6430,
      growth: '+8%',
      initials: 'DF',
      avatar: 'https://i.pravatar.cc/40?img=14'
    },
    {
      rank: 6,
      name: 'Marcelo R. (Tú)',
      zone: 'Cala Cala',
      points: 5920,
      growth: '+24%',
      initials: 'MR',
      isCurrentUser: true
    },
    {
      rank: 7,
      name: 'Lucía Benitez',
      zone: 'Tupuraya',
      points: 5400,
      growth: '+15%',
      initials: 'LB',
      avatar: 'https://i.pravatar.cc/40?img=22'
    }
  ];

  setPeriod(period: string): void {
    this.selectedPeriod.set(period);
  }

  inviteFriends(): void {
    alert('Enlace de invitación copiado en el portapapeles. ¡Invita a tus vecinos de Cochabamba a EcoLlajta!');
  }
}
