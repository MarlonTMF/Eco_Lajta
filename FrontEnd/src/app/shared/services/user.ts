import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface UserMe {
  id: number;
  fullName: string;
  email: string;
  photoUrl: string | null;
  role: string;
  pointsBalance: number;
}

const isValidImageUrl = (s: string | null | undefined): boolean =>
  !!s && (s.startsWith('http://') || s.startsWith('https://')) && !s.startsWith('eyJ');

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getMe(): Observable<UserMe> {
    return this.http.get<UserMe>(`${this.apiUrl}/me`).pipe(
      map(user => ({
        ...user,
        photoUrl: isValidImageUrl(user.photoUrl) ? user.photoUrl : null
      }))
    );
  }
}