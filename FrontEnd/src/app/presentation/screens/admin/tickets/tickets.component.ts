import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface ValidationTicket {
  id: string;
  citizenName: string;
  uid: string;
  rewardType: string;
  rewardSub: string;
  timestamp: string;
  timeAgo: string;
  status: 'Delivered' | 'Pending';
  avatarInitials: string;
  colorClass: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdminTicketsComponent implements OnInit {
  // State Signals
  manualCode = signal<string>('');
  isValidatingCamera = signal<boolean>(false);
  
  // Validation status: 'idle' | 'valid' | 'invalid'
  validationStatus = signal<'idle' | 'valid' | 'invalid'>('idle');
  validationResult = signal<{
    reward: string;
    missionId: string;
    citizen: string;
  } | null>(null);

  recentValidations = signal<ValidationTicket[]>([
    {
      id: 'val-1',
      citizenName: 'Alejandro Rivas',
      uid: '902188',
      rewardType: 'Compost Comunitario',
      rewardSub: 'Recompensa Nivel 2',
      timestamp: '17 May, 14:32',
      timeAgo: 'hace 2 min',
      status: 'Delivered',
      avatarInitials: 'AR',
      colorClass: '#ffdbcf'
    },
    {
      id: 'val-2',
      citizenName: 'Maria Poma',
      uid: '883201',
      rewardType: 'Crédito Pasaje de Bus',
      rewardSub: '10 Pasajes',
      timestamp: '17 May, 14:15',
      timeAgo: 'hace 19 min',
      status: 'Delivered',
      avatarInitials: 'MP',
      colorClass: '#cee5ff'
    },
    {
      id: 'val-3',
      citizenName: 'Carlos Choque',
      uid: '772156',
      rewardType: 'Kit de Semillas y Tierra',
      rewardSub: 'Huerto Urbano',
      timestamp: '17 May, 13:58',
      timeAgo: 'hace 36 min',
      status: 'Pending',
      avatarInitials: 'CC',
      colorClass: '#e1e3e1'
    },
    {
      id: 'val-4',
      citizenName: 'Sandra Luna',
      uid: '900223',
      rewardType: 'Créditos Reciclaje',
      rewardSub: '50 Créditos',
      timestamp: '17 May, 13:42',
      timeAgo: 'hace 52 min',
      status: 'Delivered',
      avatarInitials: 'SL',
      colorClass: '#ffdbcf'
    },
    {
      id: 'val-5',
      citizenName: 'Ricardo Vargas',
      uid: '881277',
      rewardType: 'Certificado de Adopción de Árbol',
      rewardSub: 'Especie Nativa',
      timestamp: '17 May, 13:20',
      timeAgo: 'hace 1 hora',
      status: 'Delivered',
      avatarInitials: 'RV',
      colorClass: '#cee5ff'
    }
  ]);

  ngOnInit(): void {}

  // Simulate scanning QR with camera
  scanQR(): void {
    this.isValidatingCamera.set(true);
    this.validationStatus.set('idle');

    setTimeout(() => {
      this.isValidatingCamera.set(false);
      this.validationStatus.set('valid');
      this.validationResult.set({
        reward: '25 Eco-Créditos + Pack Inicial de Reciclaje',
        missionId: '#7721-B-2026',
        citizen: 'Mateo Velasco (UID: 612984)'
      });

      // Add to recent list
      this.recentValidations.update(list => [
        {
          id: 'val-' + Date.now(),
          citizenName: 'Mateo Velasco',
          uid: '612984',
          rewardType: 'Pack Inicial de Reciclaje',
          rewardSub: '25 Eco-Créditos',
          timestamp: '17 May, Justo ahora',
          timeAgo: 'hace unos instantes',
          status: 'Delivered',
          avatarInitials: 'MV',
          colorClass: '#dcfce7'
        },
        ...list
      ]);
    }, 1500);
  }

  // Validate manually entered code
  validateManualCode(): void {
    const code = this.manualCode().trim().toUpperCase();
    if (!code) return;

    if (code.startsWith('SN-') || code.length > 5) {
      this.validationStatus.set('valid');
      this.validationResult.set({
        reward: '50 Eco-Créditos + Plantín de Kantuta',
        missionId: '#8932-E-2026',
        citizen: 'Alejandra Vargas (UID: 792834)'
      });

      // Add to recent list
      this.recentValidations.update(list => [
        {
          id: 'val-' + Date.now(),
          citizenName: 'Alejandra Vargas',
          uid: '792834',
          rewardType: 'Plantín de Kantuta',
          rewardSub: '50 Eco-Créditos',
          timestamp: '17 May, Justo ahora',
          timeAgo: 'hace unos instantes',
          status: 'Delivered',
          avatarInitials: 'AV',
          colorClass: '#ffdbcf'
        },
        ...list
      ]);
      this.manualCode.set('');
    } else {
      this.validationStatus.set('invalid');
      this.validationResult.set(null);
    }
  }

  resetValidation(): void {
    this.validationStatus.set('idle');
    this.validationResult.set(null);
  }
}
