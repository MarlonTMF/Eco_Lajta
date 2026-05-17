export type MapPointType = 'recycling' | 'mission' | 'reported';

export interface MapPoint {
  id: string;
  type: MapPointType;
  title: string;
  location: string;
  rewardText: string;
  rewardLabel: string;
  image: string;
  hoursOrDate: string;
  statusText: string;
  statusClass: string;
  capacityOrSeverity: string;
  capacityPercentage?: number;
  isSeverity?: boolean;
  severityClass?: string;
  description: string;
  lat: number;
  lng: number;
  icon: string;
  photos: string[];
}