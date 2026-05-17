import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IMissionRepository, CreateMissionData } from '../../domain/repositories/mission.repository';
import { MissionEntity, MissionStatus, EngagementLevel } from '../../domain/entities/mission.entity';

@Injectable({
  providedIn: 'root'
})
export class HttpMissionRepository implements IMissionRepository {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/events';

  async getAll(): Promise<MissionEntity[]> {
    const response = await firstValueFrom(this.http.get<{success: boolean, value: any[]}>(this.apiUrl));
    if (!response.success || !response.value) {
      return [];
    }
    return response.value.map((item: any) => this.mapBackendToEntity(item));
  }

  async getById(id: string): Promise<MissionEntity | null> {
    try {
      const response = await firstValueFrom(this.http.get<{success: boolean, value: any}>(`${this.apiUrl}/one?id=${id}`));
      if (!response.success || !response.value) {
        return null;
      }
      return this.mapBackendToEntity(response.value);
    } catch (e) {
      return null;
    }
  }

  async create(data: CreateMissionData): Promise<MissionEntity> {
    const payload = {
      title: data.title,
      description: data.description,
      locationName: data.district,
      pointsReward: data.rewardPoolDirtyPoints,
      slotsTotal: data.slotsTotal,
      district: data.district,
      imageUrl: data.imageUrl,
      startsAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endsAt: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      longitude: -66.1570,
      latitude: -17.3935
    };

    const response = await firstValueFrom(this.http.post<{success: boolean, value: any}>(this.apiUrl, payload));
    if (!response.success || !response.value) {
      throw new Error('Failed to create mission');
    }
    return this.mapBackendToEntity(response.value);
  }

  private mapBackendToEntity(item: any): MissionEntity {
    // Map backend Event fields to frontend MissionEntity properties
    
    // Calculate status
    let status: MissionStatus = 'Upcoming';
    if (item.status === 'published') {
      const start = new Date(item.startsAt);
      if (start <= new Date()) {
        status = 'In Progress';
      }
    } else if (item.status === 'finished') {
      status = 'Completed';
    } else if (item.status === 'cancelled') {
      status = 'Completed'; // fallback or adjust if we add 'Cancelled' to MissionStatus
    }

    // Determine engagement (mock calculation based on filled slots for demo purposes)
    let engagement: EngagementLevel = 'Low';
    const percent = item.slotsTotal > 0 ? (item.slotsFilled / item.slotsTotal) : 0;
    if (percent > 0.8) engagement = 'High';
    else if (percent > 0.4) engagement = 'Medium';

    return new MissionEntity(
      item.id.toString(),
      item.title || 'Untitled Mission',
      item.description || '',
      status,
      item.pointsReward || 0,
      item.slotsTotal || 0,
      item.slotsFilled || 0,
      item.qrScans || 0,
      engagement,
      item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
      item.district || item.locationName || 'Cochabamba',
      item.createdAt ? new Date(item.createdAt) : new Date()
    );
  }
}
