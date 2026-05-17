import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IRecyclingRepository } from '../../domain/repositories/recycling.repository';
import { RegisterBagRequestDto, PickupConfirmationDto } from '../../application/dtos/recycling.dto';

@Injectable({ providedIn: 'root' })
export class HttpRecyclingRepository implements IRecyclingRepository {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/v1/recycling';

    async registerPickup(data: RegisterBagRequestDto): Promise<PickupConfirmationDto> {
        const request$ = this.http.post<PickupConfirmationDto>(`${this.apiUrl}/pickup`, data);
        return await firstValueFrom(request$);
    } 
}