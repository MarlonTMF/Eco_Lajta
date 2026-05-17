import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MapPoint } from '../../domain/entities/map-point.entity';
import { MapPointRepository } from '../../domain/repositories/map-point.repository';

@Injectable({ providedIn: 'root' })
export class HttpMapPointRepository implements MapPointRepository {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/map-points`;

  getActivePoints(): Observable<MapPoint[]> {
    return this.http.get<MapPoint[]>(this.url).pipe(
      map(points => points.map(this.normalize))
    );
  }

  /** Asegura defaults para campos opcionales / metadatos visuales por tipo */
  private normalize(p: MapPoint): MapPoint {
    const icon = p.icon ?? (p.type === 'recycling' ? 'recycling' : p.type === 'mission' ? 'groups' : 'report');
    return { ...p, icon, photos: p.photos ?? [] };
  }
}