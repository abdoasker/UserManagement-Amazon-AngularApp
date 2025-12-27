export interface UserForAdmin {
  id: string;
  fullName: string;
  email: string;
  region?: string;
  activeStatus: string;
  birthdate?: Date | null;
  emailConfirmed: boolean;
  role: string;
  selectedRole?: string | null;
}
