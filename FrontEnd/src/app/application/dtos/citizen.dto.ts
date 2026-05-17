export interface AchievementDto {
    title: string;
    level: string;
    icon: string;
    bgClass: string;
    colorClass: string;
    locked?: boolean;
}

export interface ActivityDto {
    type: string;
    title: string;
    description: string;
    reward?: string;
    time: string;
    icon: string;
    bgClass: string;
    colorClass: string;
}

export interface CitizenProfileDto {
    name: string;
    role: string;
    totalRecycled: number;
    balanceDirtyPoints: number;
    eventsCount: number;
    avatarUrl: string;
    coverUrl: string;
    achievements: AchievementDto[];
    recentActivities: ActivityDto[];
}

export interface DashboardStatsDto {
    totalRecycledKg: number;
    carbonReducedKg: number;
    currentStreakDays: number;
    plasticKg: number;
    paperKg: number;
    organicKg: number;
}