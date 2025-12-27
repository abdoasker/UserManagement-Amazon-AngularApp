export interface User {
  Id: string;
  FullName: string;
  RoleName: string;
  Email: string;
  Birthdate?: Date;
  Region?: string;
  PhoneNumber?: string;
  ActiveStatus: string;
}
