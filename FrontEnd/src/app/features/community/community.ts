import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

interface FeedItem {
  id: string;
  author: string;
  authorTitle: string;
  avatar: string;
  isAvatarImage: boolean;
  timeAgo: string;
  category: 'OFICIAL' | 'COMUNIDAD';
  categoryClass: string;
  content: string;
  image?: string;
  likes: number;
  commentsCount: number;
  likedByUser?: boolean;
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './community.html',
  styleUrl: './community.css',
})
export class CommunityComponent {
  activeSection = signal<'news' | 'ranking'>('news');
  selectedPeriod = signal<string>('month');
  newsFilter = signal<'Todos' | 'Oficial'>('Todos');

  get filteredFeedItems() {
    if (this.newsFilter() === 'Todos') return this.feedItems();
    return this.feedItems().filter(item => item.category === 'OFICIAL');
  }

  // Reported Critical Places
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

  // OTB Leaderboard
  otbLeaders = signal<OtbLeader[]>([
    { rank: 1, name: 'OTB Recoleta', totalWaste: '1,240 kg', isTrendingUp: true },
    { rank: 2, name: 'OTB Cala Cala', totalWaste: '980 kg', isTrendingUp: true },
    { rank: 3, name: 'OTB Tupuraya', totalWaste: '750 kg', isTrendingUp: false }
  ]);

  // Social/Official Feed Items
  feedItems = signal<FeedItem[]>([
    {
      id: 'feed-1',
      author: 'Alcaldía de Cochabamba',
      authorTitle: 'Gobierno Autónomo Municipal',
      avatar: 'account_balance',
      isAvatarImage: false,
      timeAgo: 'HACE 2 HORAS',
      category: 'OFICIAL',
      categoryClass: 'feed-official',
      content: '¡Nuevos contenedores de reciclaje diferenciado en el centro histórico! Estamos instalando 50 puntos nuevos para facilitar la separación de residuos sólidos, orgánicos y plásticos.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPxFlzeJeliHO2Hu9QUSrpbInHOWhFQABqu4mi1JPMHEMF0kaMvJ10VDF8RorIRk-kekqGjrdcYJ-fhzPtk2WvtMlmDVZmcBBM-6s_Ni71MHKBYALDe_aYV3frm0qhDT2NTiUVSCB1XSVA78Jixk2EzjFo7VUoDrOEmINbdmK51xnta3_GpVAPfveywI3NG4tSksvX-8I4haDbiJmWOC5E3R8QJrsAIFuR9blapz8eOTnEXwMABx5dTZZ7scR7ufyJrWTWoOb68HdC',
      likes: 342,
      commentsCount: 48
    },
    {
      id: 'feed-2',
      author: 'Dra. Maria Elena',
      authorTitle: 'Líder Recoleta',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbDPpuCd_9BUls4tM9pcvlTOrE35jq28uMG9tlQLnty0lQob9mu8HB7nW2GkK2rxfz8bJVBI7tdz39ok3k5QZUokqSjo_7na6Hlj4n7TkFkjoBbR1meBB0LjcicTdtUe3L5zv1jhyuQHRCUw0HdB0ICyG56qo2nA0ver0lvswLOVuhhLkLn2TeYc4pQJgXS5iFsq8gfQ4f-wLUsWaOhlQOEqnkdBE_xmjWWSn5UQ7eEg2LVDdydykHHNMA-jOma12ZzSxKRe1_r2jS',
      isAvatarImage: true,
      timeAgo: 'HACE 5 HORAS',
      category: 'COMUNIDAD',
      categoryClass: 'feed-community',
      content: 'Tips de Reciclaje: Composta Casera. ¿Sabías que el 40% de nuestra basura diaria es orgánica? Aquí te dejo 3 pasos simples para empezar tu propia compostera urbana sin olores:\n1. Usa un balde con tapa y pequeños orificios laterales.\n2. Alterna capas "verdes" (restos de verdura) con "marrones" (cartón seco).\n3. Revuelve una vez por semana para airear.',
      likes: 1200,
      commentsCount: 156,
      likedByUser: true
    }
  ]);

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

  setSection(section: 'news' | 'ranking'): void {
    this.activeSection.set(section);
  }

  setNewsFilter(filter: 'Todos' | 'Oficial'): void {
    this.newsFilter.set(filter);
  }

  setPeriod(period: string): void {
    this.selectedPeriod.set(period);
  }

  likePost(item: FeedItem): void {
    if (item.likedByUser) {
      item.likes--;
      item.likedByUser = false;
    } else {
      item.likes++;
      item.likedByUser = true;
    }
  }

  createPost(): void {
    const text = prompt('¿Qué está ocurriendo en tu OTB de Cochabamba? Escribe tu reporte ecológico:');
    if (!text) return;

    const newItem: FeedItem = {
      id: `feed-${Date.now()}`,
      author: 'Mateo Velasco (Tú)',
      authorTitle: 'Guardián del Valle',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvK5VHACcfVfCv1FZrzbl5bpyT1ST9hFMJvtCHaQjdDD-ErUzFXPBa196IH-JiLE0j-bBQHt4U3wv9YHCVJBgfgF8B4TQrvb44XxLEyfiM0VySvCik-HtUkhz5_Dtr3ME7opLs-ASO4mZp6bJYBaiQ7snc5EoE98nn7qJU_lvao0Uq22zisAnypzAO3A_XUZ1BMGA561jVRk91tG6t6F0Lf0HhdE7mJO0GffKD4U-3gHtg9FDcugYK7-31R_fjUxQ1kQQBUhuHF343',
      isAvatarImage: true,
      timeAgo: 'HACE UN MOMENTO',
      category: 'COMUNIDAD',
      categoryClass: 'feed-community',
      content: text,
      likes: 1,
      commentsCount: 0,
      likedByUser: true
    };

    this.feedItems.update(items => [newItem, ...items]);
    alert('¡Tu publicación ha sido compartida con la comunidad ecológica de Cochabamba!');
  }

  inviteFriends(): void {
    alert('Enlace de invitación copiado en el portapapeles. ¡Invita a tus vecinos de Cochabamba a EcoLlajta!');
  }
}
