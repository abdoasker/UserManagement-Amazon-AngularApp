import { PermissionDTO } from './PermissionDTO.js';

export interface RoleDTO {
  id: string;
  name: string;
  permissions: PermissionDTO[];
}
export interface RoleUpdateDTO {
  id: string;
  name: string;
}
export interface RoleAddDTO {
  name: string;
}
