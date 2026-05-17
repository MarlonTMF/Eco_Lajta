export interface AdminUserDTO {
  id: number;
  fullName: string;
  email: string;
  photoUrl: string;
  ci: string;
  phone: string;
  zone: string;
  pointsBalance: number;
  isActive: boolean;
  role: string;
}

export interface AdminUserUpdateDTO {
  fullName?: string;
  ci?: string;
  phone?: string;
  zone?: string;
  pointsBalance?: number;
  isActive?: boolean;
  role?: string;
}

export abstract class UserRepository {
  abstract getAllUsers(): Promise<AdminUserDTO[]>;
  abstract updateUser(id: number, user: AdminUserUpdateDTO): Promise<AdminUserDTO>;
}
