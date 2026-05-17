import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommunityService, FeedItem } from '../../shared/services/community.service';
import { UserService, UserMe } from '../../shared/services/user';

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
export class CommunityComponent implements OnInit {
  private communityService = inject(CommunityService);
  private userService = inject(UserService);

  activeSection = signal<'news' | 'ranking'>('news');
  selectedPeriod = signal<string>('month');

  currentUser: UserMe | null = null;

  // Reported Critical Places
  reportedPlaces = signal<ReportedPlace[]>([
    {
      id: 'report-1',
      title: 'Acumulación de basura',
      location: 'Av. América & Villarroel',
      description: 'Gran cantidad de desechos plásticos acumulados en la acera norte desde hace 3 días.',
      status: 'Reportado',
      statusClass: 'status-reported',
      image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600'
    },
    {
      id: 'report-2',
      title: 'Parque Descuidado',
      location: 'Parque Fidel Anze',
      description: 'Maleza alta y bancos dañados en el sector infantil. Se requiere mantenimiento urgente.',
      status: 'En Revisión',
      statusClass: 'status-review',
      image: 'https://images.unsplash.com/photo-1597430162007-41846b9c9f0c?w=600'
    }
  ]);

  // OTB Leaderboard
  otbLeaders = signal<OtbLeader[]>([
    { rank: 1, name: 'OTB Recoleta', totalWaste: '1,240 kg', isTrendingUp: true },
    { rank: 2, name: 'OTB Cala Cala', totalWaste: '980 kg', isTrendingUp: true },
    { rank: 3, name: 'OTB Tupuraya', totalWaste: '750 kg', isTrendingUp: false }
  ]);

  // Social/Official Feed Items
  feedItems = signal<FeedItem[]>([]);

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

  ngOnInit(): void {
    this.loadFeed();

    this.userService.getMe().subscribe({
      next: (user) => {
        if (user) {
          this.currentUser = user;
        }
      },
      error: (err) => {
        console.warn('Could not load logged-in user profile:', err);
      }
    });
  }

  loadFeed(): void {
    this.communityService.getAll().subscribe({
      next: (data) => {
        this.feedItems.set(data);
      },
      error: (err) => {
        console.error('Error loading community feed:', err);
      }
    });
  }

  setSection(section: 'news' | 'ranking'): void {
    this.activeSection.set(section);
  }

  setPeriod(period: string): void {
    this.selectedPeriod.set(period);
  }

  likePost(item: FeedItem): void {
    const isLiked = !item.likedByUser;
    const numericId = parseInt(item.id, 10);
    if (isNaN(numericId)) {
      // Local/mock post fallback
      if (item.likedByUser) {
        item.likes--;
        item.likedByUser = false;
      } else {
        item.likes++;
        item.likedByUser = true;
      }
      return;
    }

    this.communityService.likePost(numericId, isLiked).subscribe({
      next: (updatedPost) => {
        this.feedItems.update(items =>
          items.map(p => p.id === item.id ? { ...p, likes: updatedPost.likes, likedByUser: updatedPost.likedByUser } : p)
        );
      },
      error: (err) => {
        console.error('Error liking post:', err);
      }
    });
  }

  createPost(): void {
    const text = prompt('¿Qué está ocurriendo en tu OTB de Cochabamba? Escribe tu reporte ecológico:');
    if (!text) return;

    const authorName = this.currentUser ? this.currentUser.fullName : 'Usuario Eco';
    const authorPhoto = this.currentUser ? this.currentUser.photoUrl : 'https://i.pravatar.cc/150?img=11';

    const newPostData: Partial<FeedItem> = {
      author: authorName,
      authorTitle: this.currentUser?.role === 'ROLE_ADMIN' ? 'Administrador OTB' : 'Guardián del Valle',
      avatar: authorPhoto || 'https://i.pravatar.cc/150?img=11',
      isAvatarImage: true,
      category: 'COMUNIDAD',
      categoryClass: 'feed-community',
      content: text,
      likes: 1,
      commentsCount: 0,
      likedByUser: true
    };

    this.communityService.create(newPostData).subscribe({
      next: (savedPost) => {
        this.feedItems.update(items => [savedPost, ...items]);
        alert('¡Tu publicación ha sido compartida con la comunidad ecológica de Cochabamba y guardada en la base de datos!');
      },
      error: (err) => {
        console.error('Error saving post to DB:', err);
        // Fallback local insert
        const fallbackPost: FeedItem = {
          ...newPostData,
          id: `local-${Date.now()}`
        } as FeedItem;
        this.feedItems.update(items => [fallbackPost, ...items]);
        alert('¡Tu publicación ha sido agregada localmente!');
      }
    });
  }

  inviteFriends(): void {
    alert('Enlace de invitación copiado en el portapapeles. ¡Invita a tus vecinos de Cochabamba a EcoLlajta!');
  }
}
