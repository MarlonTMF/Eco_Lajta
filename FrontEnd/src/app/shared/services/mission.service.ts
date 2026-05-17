import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

@Injectable({ providedIn: 'root' })
export class MissionService {
  private apiUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mission[]> {
    return this.http.get<Result<Mission[]>>(this.apiUrl).pipe(
      map(res => res.value || [])
    );
  }

  getOne(id: number): Observable<Mission> {
    return this.http.get<Result<Mission>>(`${this.apiUrl}/one?id=${id}`).pipe(
      map(res => res.value)
    );
  }
}
