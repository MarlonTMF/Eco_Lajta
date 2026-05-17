import { Component, inject, computed, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpCommunityRepository } from '../../infrastructure/repositories/http-community.repository';
import { NewsFeedItemDTO } from '../../application/dtos/community.dto';

interface ReportedPlace {
  id: string;
  title: string;
  location: string;
  description: string;
  status: 'Reportado' | 'En Revisión' | 'Resuelto';
  image: string;
  statusClass: string;
}

interface OtbLeader {
  rank: number;
  name: string;
  totalWaste: string;
  isTrendingUp: boolean;
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './community.html',
  styleUrl: './community.css',
})
export class CommunityComponent {
  private communityRepo = inject(HttpCommunityRepository);

  activeSection  = signal<'news' | 'ranking'>('news');
  selectedPeriod = signal<string>('month');

  // Llamadas automáticas al backend con resource()
  feedResource        = resource({ loader: () => this.communityRepo.getNewsFeed() });
  leaderboardResource = resource({ loader: () => this.communityRepo.getLeaderboard() });

  // Datos reactivos conectados al HTML
  feedItems   = computed(() => this.feedResource.value() ?? []);
  leaderboard = computed(() => this.leaderboardResource.value() ?? []);

  isLoadingFeed        = computed(() => this.feedResource.isLoading());
  isLoadingLeaderboard = computed(() => this.leaderboardResource.isLoading());
  errorFeed            = computed(() => this.feedResource.error() ? 'No se pudo cargar el feed.' : null);
  errorLeaderboard     = computed(() => this.leaderboardResource.error() ? 'No se pudo cargar el ranking.' : null);

  // Lugares reportados estáticos (hasta que el backend los exponga)
  reportedPlaces = signal<ReportedPlace[]>([
    {
      id: 'report-1',
      title: 'Acumulación de basura',
      location: 'Av. América & Villarroel',
      description: 'Gran cantidad de desechos plásticos acumulados en la acera norte desde hace 3 días.',
      status: 'Reportado',
      statusClass: 'status-reported',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPxFlzeJeliHO2Hu9QUSrpbInHOWhFQABqu4mi1JPMHEMF0kaMvJ10VDF8RorIRk-kekqGjrdcYJ-fhzPtk2WvtMlmDVZmcBBM-6s_Ni71MHKBYALDe_aYV3frm0qhDT2NTiUVSCB1XSVA78Jixk2EzjFo7VUoDrOEmINbdmK51xnta3_GpVAPfveywI3NG4tSksvX-8I4haDbiJmWOC5E3R8QJrsAIFuR9blapz8eOTnEXwMABx5dTZZ7scR7ufyJrWTWoOb68HdC'
    },
    {
      id: 'report-2',
      title: 'Parque Descuidado',
      location: 'Parque Fidel Anze',
      description: 'Maleza alta y bancos dañados en el sector infantil. Se requiere mantenimiento urgente.',
      status: 'En Revisión',
      statusClass: 'status-review',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeVAiugut6VqNT0HWPZKlVL3fZ1oRJW-Zxw1b4SGAnUaXezNIjF6_2to9PDqWaewwca1J5Ui0D3BvTuwjgAACoPGcmX8fz1VrkbhK4diB98oy_UtLjyzyqj2BJbsefA0YouQjNQ_B1HKlvNNiDwqV4AAxKSOd3ZzwWhh9hgtAlhenpUjl685cDVs0mv--GDbRSTh495HtHdFlwna4CJRPjxwOGv35dB7BwKSWnTbuYS932CtoGhEX0OFY7EjovjnDupegHMA9pBEZ7'
    }
  ]);

  otbLeaders = signal<OtbLeader[]>([
    { rank: 1, name: 'OTB Recoleta',  totalWaste: '1,240 kg', isTrendingUp: true  },
    { rank: 2, name: 'OTB Cala Cala', totalWaste: '980 kg',   isTrendingUp: true  },
    { rank: 3, name: 'OTB Tupuraya',  totalWaste: '750 kg',   isTrendingUp: false },
  ]);

  setSection(section: 'news' | 'ranking'): void {
    this.activeSection.set(section);
  }

  setPeriod(period: string): void {
    this.selectedPeriod.set(period);
  }

  cargarFeed(): void {
    this.feedResource.reload();
  }

  cargarLeaderboard(): void {
    this.leaderboardResource.reload();
  }

  likePost(item: NewsFeedItemDTO): void {
    // Optimistic update — no modifica el signal directamente (readonly desde resource)
    // El backend real manejaría esto con un endpoint PATCH /feed/:id/like
  }

  createPost(): void {
    const text = prompt('¿Qué está ocurriendo en tu OTB? Escribe tu reporte ecológico:');
    if (!text) return;
    alert('¡Tu publicación ha sido compartida con la comunidad ecológica de Cochabamba!');
  }

  inviteFriends(): void {
    alert('Enlace de invitación copiado. ¡Invita a tus vecinos a EcoLlajta!');
  }
}
