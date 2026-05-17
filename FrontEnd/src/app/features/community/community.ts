import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpCommunityRepository } from '../../infrastructure/repositories/http-community.repository';
import { LeaderboardEntryDTO, NewsFeedItemDTO } from '../../application/dtos/community.dto';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './community.html',
  styleUrl: './community.css',
})
export class CommunityComponent implements OnInit {
  activeSection = signal<'news' | 'ranking'>('news');
  selectedPeriod = signal<string>('month');

  leaderboard = signal<LeaderboardEntryDTO[]>([]);
  feedItems = signal<NewsFeedItemDTO[]>([]);

  isLoadingLeaderboard = signal<boolean>(false);
  isLoadingFeed = signal<boolean>(false);
  errorLeaderboard = signal<string | null>(null);
  errorFeed = signal<string | null>(null);

  // ID del usuario autenticado actual (obtenido del localStorage)
  currentUserId = signal<string | null>(null);

  constructor(private communityRepo: HttpCommunityRepository) {}

  ngOnInit(): void {
    // Identificar usuario actual desde el token almacenado
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUserId.set(payload.sub ?? payload.userId ?? null);
      } catch {
        this.currentUserId.set(null);
      }
    }
    this.cargarLeaderboard();
    this.cargarFeed();
  }

  async cargarLeaderboard(): Promise<void> {
    this.isLoadingLeaderboard.set(true);
    this.errorLeaderboard.set(null);
    try {
      const data = await this.communityRepo.getLeaderboard();
      this.leaderboard.set(data);
    } catch {
      this.errorLeaderboard.set('No se pudo cargar el ranking. Intenta de nuevo.');
    } finally {
      this.isLoadingLeaderboard.set(false);
    }
  }

  async cargarFeed(): Promise<void> {
    this.isLoadingFeed.set(true);
    this.errorFeed.set(null);
    try {
      const data = await this.communityRepo.getNewsFeed();
      this.feedItems.set(data);
    } catch {
      this.errorFeed.set('No se pudo cargar el feed. Intenta de nuevo.');
    } finally {
      this.isLoadingFeed.set(false);
    }
  }

  /** Calcula el tiempo relativo en español a partir de una fecha ISO 8601 */
  tiempoRelativo(fechaIso: string): string {
    const ahora = Date.now();
    const fecha = new Date(fechaIso).getTime();
    const diff = Math.max(0, ahora - fecha); // ms

    const segundos = Math.floor(diff / 1000);
    const minutos  = Math.floor(segundos / 60);
    const horas    = Math.floor(minutos / 60);
    const dias     = Math.floor(horas / 24);
    const semanas  = Math.floor(dias / 7);

    if (segundos < 60)  return 'hace un momento';
    if (minutos < 60)   return `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    if (horas < 24)     return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    if (dias < 7)       return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    return `hace ${semanas} ${semanas === 1 ? 'semana' : 'semanas'}`;
  }

  /** Ícono del tipo de noticia en el feed */
  iconoPorTipo(tipo: 'logro' | 'canje' | 'desafio'): string {
    const iconos: Record<string, string> = {
      logro:   'emoji_events',
      canje:   'redeem',
      desafio: 'flag',
    };
    return iconos[tipo] ?? 'notifications';
  }

  esUsuarioActual(userId: string): boolean {
    return this.currentUserId() !== null && this.currentUserId() === userId;
  }

  setSection(section: 'news' | 'ranking'): void {
    this.activeSection.set(section);
  }

  setPeriod(period: string): void {
    this.selectedPeriod.set(period);
    // Al cambiar el período, se recargaría el leaderboard con el filtro correspondiente
    this.cargarLeaderboard();
  }
}
