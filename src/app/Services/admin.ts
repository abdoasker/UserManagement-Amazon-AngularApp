import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserForAdmin } from '../Models/user-for-admin.js';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { RoleDTO, RoleAddDTO, RoleUpdateDTO } from '../Models/role.js';
import { PermissionAddDTO, PermissionDTO } from '../Models/PermissionDTO.js';
import { AccountService } from './account-service.js';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'https://localhost:7215/api/v1/admin';
  private hubUrl = '/api/v1/admin/hubs/users';

  private hubConnection!: signalR.HubConnection;

  private userAddedSource = new Subject<UserForAdmin>();
  private userUpdatedSource = new Subject<UserForAdmin>();

  userAdded$ = this.userAddedSource.asObservable();
  userUpdated$ = this.userUpdatedSource.asObservable();

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.startSignalRConnection();
  }

  /** SignalR setup */
  private startSignalRConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: async () => {
          return await this.accountService.getValidAccessToken();
        },
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected to UserHub'))
      .catch((err) => console.error('SignalR Connection Error: ', err));

    this.hubConnection.on('UserAdded', (user: UserForAdmin) => {
      this.userAddedSource.next(user);
    });

    this.hubConnection.on('UserUpdated', (user: UserForAdmin) => {
      this.userUpdatedSource.next(user);
    });
  }

  // ---------------------- USER MANAGEMENT ----------------------
  //#region User Management
  /** Get all users */
  getAllUsers(): Observable<UserForAdmin[]> {
    return this.http.get<UserForAdmin[]>(`${this.apiUrl}/users`);
  }

  /** Get user details by ID */
  getUserDetails(userId: string): Observable<UserForAdmin> {
    return this.http.get<UserForAdmin>(`${this.apiUrl}/users/${userId}`);
  }

  /** Get users by role */
  filterUsersByRole(roleName: string): Observable<UserForAdmin[]> {
    return this.http.get<UserForAdmin[]>(
      `${this.apiUrl}/users/by-role/${roleName}`
    );
  }

  /** Deactivate user */
  deactivateUser(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/deactivate`, {});
  }

  /** Activate user */
  activateUser(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}/activate`, {});
  }

  /** delete user */
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, {});
  }

  /** Assign role to user */
  assignRole(userId: string, roleName: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/${userId}/roles/${roleName}`,
      {}
    );
  }

  /** Revoke role from user */
  revokeRole(userId: string, roleName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}/roles/${roleName}`);
  }
  //#endregion

  // ---------------------- Role MANAGEMENT ----------------------
  //#region Role Management
  /** get all roles in system */
  getAllRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(`${this.apiUrl}/roles`);
  }
  /** get role by id */
  getRoleById(roleId: string): Observable<RoleDTO> {
    return this.http.get<RoleDTO>(`${this.apiUrl}/roles/${roleId}`);
  }

  /** Create new role */
  createRole(roleAdd: RoleAddDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/roles`, roleAdd);
  }
  /** Update role by id */
  updateRole(roleId: string, roleUpdate: RoleUpdateDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/roles/${roleId}`, roleUpdate);
  }
  /** Delete role by id */
  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/roles/${roleId}`);
  }

  /** Assign Permission To Role */
  assignPermissionToRole(
    roleId: string,
    permissionId: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/roles/${roleId}/permissions/${permissionId}`,
      {}
    );
  }

  /** Revoke Permission From Role */
  revokePermissionFromRole(
    roleId: string,
    permissionId: string
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/roles/${roleId}/permissions/${permissionId}`
    );
  }

  //#endregion

  // ---------------------- Permission MANAGEMENT ----------------------
  //#region Permission Management
  /** Get all permissions */
  getAllPermissions(): Observable<PermissionDTO[]> {
    return this.http.get<PermissionDTO[]>(`${this.apiUrl}/permissions`);
  }
  /** Get permission by id */
  getPermissionById(permissionId: string): Observable<PermissionDTO> {
    return this.http.get<PermissionDTO>(
      `${this.apiUrl}/permissions/${permissionId}`
    );
  }
  /** Add permission*/
  addPermission(permission: PermissionAddDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/permissions`, permission);
  }
  /** Update permission */
  updatePermission(
    permissionId: string,
    permission: PermissionDTO
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/permissions/${permissionId}`,
      permission
    );
  }
  /** Delete permission */
  deletePermission(permissionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/permissions/${permissionId}`);
  }

  //#endregion
}
