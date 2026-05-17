import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ICitizenRepository } from '../../domain/repositories/citizen.repository';
import { CitizenProfileDto, DashboardStatsDto } from '../../application/dtos/citizen.dto';

@Injectable({ providedIn: 'root' })
export class HttpCitizenRepository implements ICitizenRepository {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/v1/citizens';

    async getProfile(): Promise<CitizenProfileDto> {
        const request$ = this.http.get<CitizenProfileDto>(`${this.apiUrl}/profile/me`);
        return await firstValueFrom(request$); 
    }

    async getDashboardStats(): Promise<DashboardStatsDto> {
        const request$ = this.http.get<DashboardStatsDto>(`${this.apiUrl}/stats/me`);
        return await firstValueFrom(request$);
    }
}