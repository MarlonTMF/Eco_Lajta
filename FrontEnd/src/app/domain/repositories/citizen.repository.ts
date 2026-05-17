import { CitizenProfileDto, DashboardStatsDto } from '../../application/dtos/citizen.dto';

export interface ICitizenRepository {
    getProfile(): Promise<CitizenProfileDto>;
    getDashboardStats(): Promise<DashboardStatsDto>;
}