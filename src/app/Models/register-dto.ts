export interface RegisterDTO {
  FullName: string;
  Password: string;
  ConfirmPassword: string;
  Email: string;
  DateOfBirth?: Date;
  Region?: string;
  PhoneNumber?: string;
  ProfilePictureUrl?: string;
}
