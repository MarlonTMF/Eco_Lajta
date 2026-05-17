import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface FeedItem {
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

export interface Result<T> {
  success: boolean;
  value: T;
}

const FALLBACK_FEED: FeedItem[] = [
  {
    id: '1',
    author: 'Alcaldía de Cochabamba',
    authorTitle: 'Gobierno Autónomo Municipal',
    avatar: 'account_balance',
    isAvatarImage: false,
    timeAgo: 'HACE 2 HORAS',
    category: 'OFICIAL',
    categoryClass: 'feed-official',
    content: '¡Nuevos contenedores de reciclaje diferenciado en el centro histórico! Estamos instalando 50 puntos nuevos para facilitar la separación de residuos sólidos, orgánicos y plásticos.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    likes: 342,
    commentsCount: 48,
    likedByUser: false
  },
  {
    id: '2',
    author: 'Dra. Maria Elena',
    authorTitle: 'Líder Recoleta',
    avatar: 'https://i.pravatar.cc/150?img=47',
    isAvatarImage: true,
    timeAgo: 'HACE 5 HORAS',
    category: 'COMUNIDAD',
    categoryClass: 'feed-community',
    content: 'Tips de Reciclaje: Composta Casera. ¿Sabías que el 40% de nuestra basura diaria es orgánica? Aquí te dejo 3 pasos simples para empezar tu propia compostera urbana sin olores:\n1. Usa un balde con tapa y pequeños orificios laterales.\n2. Alterna capas "verdes" (restos de verdura) con "marrones" (cartón seco).\n3. Revuelve una vez por semana para airear.',
    likes: 1200,
    commentsCount: 156,
    likedByUser: true
  }
];

@Injectable({ providedIn: 'root' })
export class CommunityService {
  private apiUrl = 'http://localhost:8080/api/community';

  constructor(private http: HttpClient) {}

  getAll(): Observable<FeedItem[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        if (!res) return FALLBACK_FEED;
        let list: FeedItem[] = [];
        if (res.value !== undefined) list = res.value;
        else if (res.data !== undefined) list = res.data;
        else if (Array.isArray(res)) list = res;

        // Ensure string IDs for frontend compatibility
        return list.map(item => ({
          ...item,
          id: String(item.id)
        }));
      }),
      catchError(err => {
        console.warn('[CommunityService] Fallback to mock feed due to error:', err);
        return of(FALLBACK_FEED);
      })
    );
  }

  create(post: Partial<FeedItem>): Observable<FeedItem> {
    return this.http.post<any>(this.apiUrl, post).pipe(
      map(res => {
        const item = (res && res.value) ? res.value : res;
        return {
          ...item,
          id: String(item.id)
        };
      })
    );
  }

  likePost(id: number, liked: boolean): Observable<FeedItem> {
    return this.http.post<any>(`${this.apiUrl}/like?id=${id}&liked=${liked}`, {}).pipe(
      map(res => {
        const item = (res && res.value) ? res.value : res;
        return {
          ...item,
          id: String(item.id)
        };
      })
    );
  }
}
