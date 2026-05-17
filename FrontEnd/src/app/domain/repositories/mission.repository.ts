// domain/repositories/mission.repository.ts
import { MissionEntity } from '../entities/mission.entity';

export interface IMissionRepository {
  getAll(): Promise<MissionEntity[]>;
  getById(id: string): Promise<MissionEntity | null>;
  create(data: CreateMissionData): Promise<MissionEntity>;
  registerAttendance(eventId: number): Promise<void>;
  getAttendanceQr(eventId: number): Promise<Blob>;
}

export interface CreateMissionData {
  title: string;
  description: string;
  rewardPoolDirtyPoints: number;
  slotsTotal: number;
  district: string;
  imageUrl?: string;
}
