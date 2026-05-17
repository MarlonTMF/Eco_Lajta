import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Mission {
  id: number;
  title: string;
  description: string;
  locationName: string;
  startsAt: string;
  endsAt: string;
  pointsReward: number;
  status: string;
  latitude: number;
  longitude: number;
}

export interface Result<T> {
  success: boolean;
  value: T;
}

export const FALLBACK_MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Limpieza de la Laguna Alalay",
    description: "Campaña comunitaria para la recolección de residuos y plásticos en el sector norte de la Laguna Alalay. Ayuda a preservar la biodiversidad de este importante espejo de agua.",
    locationName: "Laguna Alalay - Entrada Norte",
    startsAt: "2026-06-15T08:30:00",
    endsAt: "2026-06-15T12:00:00",
    pointsReward: 250,
    status: "published",
    latitude: -17.4093,
    longitude: -66.1431
  },
  {
    id: 2,
    title: "Reforestación San Pedro",
    description: "Plantación masiva de plantines nativos en las faldas del cerro de San Pedro para restaurar la cobertura boscosa y detener la erosión del suelo.",
    locationName: "Cerro San Pedro - Cochabamba",
    startsAt: "2026-06-20T08:00:00",
    endsAt: "2026-06-20T13:00:00",
    pointsReward: 300,
    status: "published",
    latitude: -17.3935,
    longitude: -66.1450
  },
  {
    id: 3,
    title: "Reciclaje Electrónico Plaza Principal",
    description: "Punto de recolección de electrodomésticos en desuso, celulares, pilas y material electrónico contaminante. Trae tu e-waste y canjéalo por puntos.",
    locationName: "Plaza Principal de Cochabamba",
    startsAt: "2026-07-02T09:00:00",
    endsAt: "2026-07-02T16:00:00",
    pointsReward: 150,
    status: "published",
    latitude: -17.3938,
    longitude: -66.1569
  }
];

@Injectable({ providedIn: 'root' })
export class MissionService {
  private apiUrl = environment.apiUrl + '/events';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mission[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        if (!res) return FALLBACK_MISSIONS;
        
        let list: Mission[] = [];
        if (res.value !== undefined) list = res.value;
        else if (res.data !== undefined) list = res.data;
        else if (Array.isArray(res)) list = res;

        return list.length > 0 ? list : FALLBACK_MISSIONS;
      }),
      catchError(err => {
        console.warn('[MissionService] Fallback to mock data due to error fetching missions:', err);
        return of(FALLBACK_MISSIONS);
      })
    );
  }

  getOne(id: number): Observable<Mission> {
    return this.http.get<any>(`${this.apiUrl}/one?id=${id}`).pipe(
      map(res => {
        if (!res) return this.getFallbackById(id);
        
        let item: Mission | null = null;
        if (res.value !== undefined) item = res.value;
        else if (res.data !== undefined) item = res.data;
        else if (res && typeof res === 'object' && !Array.isArray(res)) item = res;

        return item || this.getFallbackById(id);
      }),
      catchError(err => {
        console.warn(`[MissionService] Fallback to mock data due to error fetching mission ID ${id}:`, err);
        return of(this.getFallbackById(id));
      })
    );
  }

  getAttendanceQr(eventId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/attendance/qr/${eventId}`, { responseType: 'blob' });
  }

  registerAttendance(eventId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/attendance`, { eventId });
  }

  private getFallbackById(id: number): Mission {
    return FALLBACK_MISSIONS.find(m => m.id === id) || FALLBACK_MISSIONS[0];
  }
}
