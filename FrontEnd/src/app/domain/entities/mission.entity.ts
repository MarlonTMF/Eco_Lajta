// domain/entities/mission.entity.ts
export type MissionStatus = 'In Progress' | 'Upcoming' | 'Completed';
export type EngagementLevel = 'High' | 'Medium' | 'Low';

export class MissionEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: MissionStatus,
    public readonly rewardPoolDirtyPoints: number,
    public readonly slotsTotal: number,
    public readonly slotsFilled: number,
    public readonly qrScans: number,
    public readonly engagement: EngagementLevel,
    public readonly imageUrl: string,
    public readonly district: string,
    public readonly createdAt: Date,
  ) {}

  get slotFillPercent(): number {
    return Math.round((this.slotsFilled / this.slotsTotal) * 100);
  }

  get isLive(): boolean {
    return this.status === 'In Progress';
  }
}
