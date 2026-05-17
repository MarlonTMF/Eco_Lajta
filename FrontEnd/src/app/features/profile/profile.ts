import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent {
  // Mock data matching Mateo Velasco profile from second screenshot
  profile = {
    name: 'Mateo Velasco',
    role: 'GUARDIÁN DEL VALLE',
    totalRecycled: 428,
    balanceDirtyPoints: 2450,
    eventsCount: 24,
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    coverUrl: 'https://images.unsplash.com/photo-1518005020250-68a0d0d7a982?auto=format&fit=crop&q=80&w=1000'
  };

  achievements = [
    {
      title: 'Pionero Orgánico',
      level: 'Nivel 2',
      icon: 'recycling',
      bgClass: 'bg-green-soft',
      colorClass: 'color-green'
    },
    {
      title: 'Ciclista Urbano',
      level: 'Nivel 4',
      icon: 'directions_bike',
      bgClass: 'bg-blue-soft',
      colorClass: 'color-blue'
    },
    {
      title: 'Líder Regional',
      level: 'Bloqueado',
      icon: 'lock',
      bgClass: 'bg-gray-soft',
      colorClass: 'color-gray',
      locked: true
    }
  ];

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

  downloadCertificate(): void {
    alert('Descargando Certificado Verde de Mateo Velasco en formato PDF...');
  }
}
