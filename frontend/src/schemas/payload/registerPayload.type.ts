import type { UserRole } from '../../store/authStore';

export interface RegisterPayload {
  role: UserRole;
  fullName: string;
  email: string;
  password: string;
}
