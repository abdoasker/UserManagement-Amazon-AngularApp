import { AddressDTO } from './AddressDTO.js';
import { PhoneDTO } from './PhoneDTO.js';

export interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  region: string;
  birthdate: string;
  addresses?: AddressDTO[];
  phones?: PhoneDTO[];
}
