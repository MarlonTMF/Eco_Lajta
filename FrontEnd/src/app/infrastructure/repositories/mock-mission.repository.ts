// infrastructure/repositories/mock-mission.repository.ts
import { Injectable }          from '@angular/core';
import { IMissionRepository, CreateMissionData } from '../../domain/repositories/mission.repository';
import { MissionEntity }       from '../../domain/entities/mission.entity';

@Injectable()
export class MockMissionRepository implements IMissionRepository {
  private missions: MissionEntity[] = [
    new MissionEntity(
      'mission-1',
      'Reforestación Parque Sur',
      'Planting 200 native species in the southern green belt to combat urban heat islands.',
      'In Progress', 5000, 100, 85, 162, 'High',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
      'Distrito Sur', new Date('2026-04-01'),
    ),
    new MissionEntity(
      'mission-2',
      'Limpieza Vecinal - Distrito 4',
      'Monthly community cleanup and waste segregation workshop for District 4 residents.',
      'Upcoming', 2500, 50, 12, 0, 'Low',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      'Distrito 4', new Date('2026-05-10'),
    ),
    new MissionEntity(
      'mission-3',
      'Reciclaje Masivo - Cala Cala',
      'Large-scale plastics and cardboard collection drive for Cala Cala neighborhood.',
      'Upcoming', 3000, 80, 5, 0, 'Low',
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600',
      'Cala Cala', new Date('2026-06-01'),
    ),
  ];

  async getAll(): Promise<MissionEntity[]> {
    return [...this.missions];
  }

  async getById(id: string): Promise<MissionEntity | null> {
    return this.missions.find(m => m.id === id) ?? null;
  }

  async create(data: CreateMissionData): Promise<MissionEntity> {
    const entity = new MissionEntity(
      `mission-${Date.now()}`,
      data.title,
      data.description,
      'Upcoming',
      data.rewardPoolDirtyPoints,
      data.slotsTotal,
      0, 0, 'Low',
      data.imageUrl ?? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
      data.district,
      new Date(),
    );
    this.missions.push(entity);
    return entity;
  }

  async registerAttendance(eventId: number): Promise<void> {
    return Promise.resolve();
  }

  async getAttendanceQr(eventId: number): Promise<Blob> {
    return Promise.resolve(new Blob(['mock-qr'], { type: 'image/png' }));
  }
}
