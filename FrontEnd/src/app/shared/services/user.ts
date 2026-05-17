import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserMe {
  id: number;
  fullName: string;
  email: string;
  photoUrl: string;
  role: string;
  pointsBalance: number;
}


@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getMe(): Observable<UserMe> {
    return this.http.get<UserMe>(`${this.apiUrl}/me`);
  }
}