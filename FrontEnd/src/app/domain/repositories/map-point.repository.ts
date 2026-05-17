import { Observable } from 'rxjs';
import { MapPoint } from '../entities/map-point.entity';

export interface MapPointRepository {
  getActivePoints(): Observable<MapPoint[]>;
}