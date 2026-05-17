import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../shared/services/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);

  // Mock data as initial state / robust fallback
  profile = {
    name: 'Mateo Velasco',
    role: 'GUARDIÁN DEL VALLE',
    totalRecycled: 428,
    balanceDirtyPoints: 2450,
    eventsCount: 24,
    avatarUrl: '',
    coverUrl: 'https://images.unsplash.com/photo-1518005020250-68a0d0d7a982?auto=format&fit=crop&q=80&w=1000'
  };



  recentActivities = [
    {
      type: 'recycling',
      title: 'Reciclaje de PET exitoso',
      description: 'Registraste 5.4kg de botellas plásticas en el Punto Verde del Prado.',
      reward: '+54 DP',
      time: 'Hace 2 horas',
      icon: 'check_circle',
      bgClass: 'bg-green-soft',
      colorClass: 'color-green'
    },
    {
      type: 'event',
      title: "Inscripción a 'Limpieza del Río Rocha'",
      description: 'Te has unido a 140 voluntarios para la jornada de este sábado.',
      time: 'Ayer, 15:45',
      icon: 'calendar_today',
      bgClass: 'bg-blue-soft',
      colorClass: 'color-blue'
    }
  ];

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (user) => {
        if (user) {
          this.profile.name = user.fullName;
          this.profile.avatarUrl = user.photoUrl || '';
          this.profile.balanceDirtyPoints = user.pointsBalance;
          if (user.role === 'ROLE_ADMIN') {
            this.profile.role = 'ADMINISTRADOR';
          }
        }
      },
      error: (err) => {
        console.warn('Error loading dynamic user profile, using mock fallback:', err);
      }
    });
  }

  downloadCertificate(): void {
    alert('Descargando Certificado Verde en formato PDF...');
  }
}
