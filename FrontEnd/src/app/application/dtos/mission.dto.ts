// application/dtos/mission.dto.ts
export interface MissionDto {
  id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Upcoming' | 'Completed';
  statusColor: string;           // e.g. '#2E7D32', '#F59E0B'
  rewardPoolDirtyPoints: number;
  slotsFilled: number;
  slotsTotal: number;
  slotFillPercent: number;
  qrScans: number;
  engagement: 'High' | 'Medium' | 'Low';
  engagementColor: string;
  imageUrl: string;
  district: string;
  createdAt: string;             // formatted: 'dd MMM yyyy'
}

export interface AdminMissionsPageDto {
  totalDirtyPointsDistributed: number;   // e.g. 142500
  activeMissionsCount: number;           // e.g. 12
  activeVolunteers: number;              // e.g. 2480
  qrVerificationRate: number;            // e.g. 94.2
  missions: MissionDto[];
  otbRankings: OtbRankingDto[];
}

export interface OtbRankingDto {
  rank: number;
  name: string;
  members: number;
  dirtyPointsDistributed: number;        // NOT "ETK" — Dirty Points
  efficiencyPercent: number;
}

export interface CreateMissionFormDto {
  title: string;
  description: string;
  rewardPoolDirtyPoints: number;
  slotsTotal: number;
  district: string;
}
