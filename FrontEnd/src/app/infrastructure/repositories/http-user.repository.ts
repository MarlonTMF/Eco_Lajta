import { environment } from '../../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UserRepository, AdminUserDTO, AdminUserUpdateDTO } from '../../domain/repositories/user.repository';
import { Result } from '../../domain/models/result.model';

@Injectable({
  providedIn: 'root'
})
export class HttpUserRepository extends UserRepository {
  private readonly apiUrl = environment.apiUrl + '/users';
  private http = inject(HttpClient);

  async getAllUsers(): Promise<AdminUserDTO[]> {
    const result = await firstValueFrom(
      this.http.get<Result<AdminUserDTO[]>>(this.apiUrl)
    );
    if (!result.success) throw new Error('Failed to fetch users');
    return result.value;
  }

  async updateUser(id: number, user: AdminUserUpdateDTO): Promise<AdminUserDTO> {
    const result = await firstValueFrom(
      this.http.put<Result<AdminUserDTO>>(`${this.apiUrl}/${id}`, user)
    );
    if (!result.success) throw new Error('Failed to update user');
    return result.value;
  }
}
