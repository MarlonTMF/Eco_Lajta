import { environment } from '../../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { MapPoint } from '../../domain/entities/map-point.entity';
import { MapPointRepository } from '../../domain/repositories/map-point.repository';

interface EventApiItem {
  id: number;
  title: string;
  description: string;
  locationName: string;
  startsAt: string;
  endsAt: string;
  pointsReward: number;
  latitude: number;
  longitude: number;
}

interface ApiResponse {
  success: boolean;
  value: EventApiItem[];
}

@Injectable({ providedIn: 'root' })
export class HttpMapPointRepository implements MapPointRepository {
  private http = inject(HttpClient);
  private url = environment.apiUrl + '/events';

  getActivePoints(): Observable<MapPoint[]> {
    return this.http.get<ApiResponse>(this.url).pipe(
      map(res => (res.value ?? [])
        .filter(e => e.latitude && e.longitude)
        .map(e => this.toMapPoint(e))
      )
    );
  }

  private toMapPoint(e: EventApiItem): MapPoint {
    const now = new Date();
    const start = new Date(e.startsAt);
    const end = new Date(e.endsAt);
    const isActive = end >= now;
    const type = this.resolveType(e.title + ' ' + e.description);

    return {
      id: String(e.id),
      type,
      title: e.title,
      location: e.locationName ?? 'Cochabamba',
      rewardText: `+${e.pointsReward}`,
      rewardLabel: 'Puntos',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80',
      hoursOrDate: start.toLocaleDateString('es-BO', {
        day: 'numeric', month: 'short',
        hour: '2-digit', minute: '2-digit'
      }),
      statusText: isActive ? 'Activo' : 'Finalizado',
      statusClass: isActive ? 'text-accent' : '',
      capacityOrSeverity: isActive ? 'En curso' : 'Finalizado',
      description: e.description,
      lat: e.latitude,
      lng: e.longitude,
      icon: this.resolveIcon(type),
      photos: [],
    };
  }

  private resolveType(text: string): 'recycling' | 'mission' | 'reported' {
    const t = text.toLowerCase();
    if (t.includes('recicl') || t.includes('electr') || t.includes('residuo')) return 'recycling';
    if (t.includes('report') || t.includes('denuncia')) return 'reported';
    return 'mission';
  }

  private resolveIcon(type: 'recycling' | 'mission' | 'reported'): string {
    return type === 'recycling' ? 'recycling' : type === 'reported' ? 'report' : 'groups';
  }
}