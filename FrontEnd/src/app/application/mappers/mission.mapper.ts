// application/mappers/mission.mapper.ts
import { MissionEntity } from '../../domain/entities/mission.entity';
import { MissionDto }    from '../dtos/mission.dto';

const STATUS_COLOR: Record<string, string> = {
  'In Progress': '#2E7D32',
  'Upcoming':    '#F59E0B',
  'Completed':   '#6B7280',
};

const ENGAGEMENT_COLOR: Record<string, string> = {
  'High':   '#2E7D32',
  'Medium': '#F59E0B',
  'Low':    '#EF4444',
};

export function mapMissionToDto(e: MissionEntity): MissionDto {
  return {
    id:                     e.id,
    title:                  e.title,
    description:            e.description,
    status:                 e.status,
    statusColor:            STATUS_COLOR[e.status] ?? '#6B7280',
    rewardPoolDirtyPoints:  e.rewardPoolDirtyPoints,
    slotsFilled:            e.slotsFilled,
    slotsTotal:             e.slotsTotal,
    slotFillPercent:        e.slotFillPercent,
    qrScans:                e.qrScans,
    engagement:             e.engagement,
    engagementColor:        ENGAGEMENT_COLOR[e.engagement] ?? '#6B7280',
    imageUrl:               e.imageUrl,
    district:               e.district,
    createdAt:              e.createdAt.toLocaleDateString('es-BO'),
  };
}
