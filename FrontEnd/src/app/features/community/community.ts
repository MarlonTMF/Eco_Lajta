import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommunityService, FeedItem } from '../../shared/services/community.service';
import { UserService, UserMe } from '../../shared/services/user';

interface ReportedPlace {
  id: string; title: string; location: string; description: string;
  status: 'Reportado' | 'En Revisión' | 'Resuelto'; image: string; statusClass: string;
}

interface Toast { message: string; type: 'success' | 'error'; id: number; }

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './community.html',
  styleUrl: './community.css',
})
export class CommunityComponent implements OnInit {
  private communityService = inject(CommunityService);
  private userService = inject(UserService);

  activeSection  = signal<'news' | 'ranking'>('news');
  selectedPeriod = signal<string>('month');
  currentUser: UserMe | null = null;

  // Modal state
  showModal    = signal(false);
  postText     = signal('');
  imagePreview = signal<string | null>(null);
  imageFile: File | null = null;
  isSubmitting = signal(false);

  // Toast
  toasts = signal<Toast[]>([]);
  private toastCounter = 0;

  feedItems = signal<FeedItem[]>([]);

  reportedPlaces = signal<ReportedPlace[]>([
    { id: 'report-1', title: 'Acumulación de basura', location: 'Av. América & Villarroel',
      description: 'Gran cantidad de desechos plásticos acumulados en la acera norte desde hace 3 días.',
      status: 'Reportado', statusClass: 'status-reported',
      image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600' },
    { id: 'report-2', title: 'Parque Descuidado', location: 'Parque Fidel Anze',
      description: 'Maleza alta y bancos dañados en el sector infantil.',
      status: 'En Revisión', statusClass: 'status-review',
      image: 'https://images.unsplash.com/photo-1597430162007-41846b9c9f0c?w=600' }
  ]);

  podium = [
    { rank: 2, name: 'Sofía M.',    points: 9820,  avatar: 'https://i.pravatar.cc/100?img=5',  badge: 'ZONA NORTE' },
    { rank: 1, name: 'Alejandro V.', points: 12450, avatar: 'https://i.pravatar.cc/100?img=8',  badge: 'GUARDIÁN DEL VALLE' },
    { rank: 3, name: 'Renato G.',   points: 8540,  avatar: 'https://i.pravatar.cc/100?img=12', badge: 'ZONA SUR' }
  ];

  leaderboard = [
    { rank: 4, name: 'Mónica Quiroga', zone: 'Zona Norte',    points: 7210, growth: '+12%', initials: 'MQ', avatar: 'https://i.pravatar.cc/40?img=3' },
    { rank: 5, name: 'Diego Flores',   zone: 'Zona Central',  points: 6430, growth: '+8%',  initials: 'DF', avatar: 'https://i.pravatar.cc/40?img=14' },
    { rank: 6, name: 'Marcelo R. (Tú)', zone: 'Cala Cala',   points: 5920, growth: '+24%', initials: 'MR', isCurrentUser: true },
    { rank: 7, name: 'Lucía Benitez',  zone: 'Tupuraya',      points: 5400, growth: '+15%', initials: 'LB', avatar: 'https://i.pravatar.cc/40?img=22' }
  ];

  ngOnInit(): void {
    this.loadFeed();
    this.userService.getMe().subscribe({
      next: u => { if (u) this.currentUser = u; },
      error: err => console.warn('Could not load user:', err)
    });
  }

  loadFeed(): void {
    this.communityService.getAll().subscribe({
      next: data => this.feedItems.set(data),
      error: err => console.error('Error loading feed:', err)
    });
  }

  // ── Modal ───────────────────────────────────
  openModal(): void { this.showModal.set(true); }

  closeModal(): void {
    this.showModal.set(false);
    this.postText.set('');
    this.imagePreview.set(null);
    this.imageFile = null;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.imageFile = file;
    const reader = new FileReader();
    reader.onload = e => this.imagePreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview.set(null);
    this.imageFile = null;
  }

  submitPost(): void {
    if (!this.postText().trim()) return;
    this.isSubmitting.set(true);

    const isValidUrl = (s: string | null | undefined) =>
      !!s && (s.startsWith('http://') || s.startsWith('https://'));

    const authorName  = this.currentUser?.fullName ?? 'Usuario Eco';
    const authorPhoto = isValidUrl(this.currentUser?.photoUrl)
      ? this.currentUser!.photoUrl!
      : null;

    const newPostData: Partial<FeedItem> = {
      author: authorName,
      authorTitle: this.currentUser?.role === 'ROLE_ADMIN' ? 'Administrador OTB' : 'Guardián del Valle',
      avatar: authorPhoto ?? 'eco',
      isAvatarImage: !!authorPhoto,
      category: 'COMUNIDAD',
      categoryClass: 'feed-community',
      content: this.postText().trim(),
      image: this.imagePreview() ?? undefined,
      likes: 0,
      commentsCount: 0,
      likedByUser: false,
    };

    this.communityService.create(newPostData).subscribe({
      next: saved => {
        this.feedItems.update(items => [saved, ...items]);
        this.isSubmitting.set(false);
        this.closeModal();
        this.showToast('¡Publicación compartida con la comunidad!', 'success');
      },
      error: () => {
        const fallback: FeedItem = { ...newPostData, id: `local-${Date.now()}` } as FeedItem;
        this.feedItems.update(items => [fallback, ...items]);
        this.isSubmitting.set(false);
        this.closeModal();
        this.showToast('Publicación agregada localmente.', 'success');
      }
    });
  }

  // ── Toast ───────────────────────────────────
  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    const id = ++this.toastCounter;
    this.toasts.update(t => [...t, { message, type, id }]);
    setTimeout(() => this.toasts.update(t => t.filter(x => x.id !== id)), 2800);
  }

  // ── Feed actions ────────────────────────────
  setSection(s: 'news' | 'ranking'): void { this.activeSection.set(s); }
  setPeriod(p: string): void { this.selectedPeriod.set(p); }
  inviteFriends(): void { this.showToast('Enlace copiado al portapapeles.', 'success'); }

  likePost(item: FeedItem): void {
    const isLiked  = !item.likedByUser;
    const numericId = parseInt(item.id, 10);

    if (isNaN(numericId)) {
      item.likedByUser ? item.likes-- : item.likes++;
      item.likedByUser = !item.likedByUser;
      return;
    }
    this.communityService.likePost(numericId, isLiked).subscribe({
      next: updated => this.feedItems.update(items =>
        items.map(p => p.id === item.id ? { ...p, likes: updated.likes, likedByUser: updated.likedByUser } : p)
      ),
      error: err => console.error('Error liking post:', err)
    });
  }
}