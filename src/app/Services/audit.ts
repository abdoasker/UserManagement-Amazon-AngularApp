import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginActivityDTO } from '../Models/LoginActivityDTO.js';
import { UserActivityDTO } from '../Models/UserActivityDTO.js';
import { HttpClient } from '@angular/common/http';
import { RoleActivityDTO } from '../Models/RoleActivityDTO.js';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'https://localhost:7215/api/v1/admin/logs';

  // === User Activities ===
  getAllUserActivities(): Observable<UserActivityDTO[]> {
    return this.http.get<UserActivityDTO[]>(`${this.baseUrl}/user-activities`);
  }

  getUserActivities(userId: string): Observable<UserActivityDTO[]> {
    return this.http.get<UserActivityDTO[]>(
      `${this.baseUrl}/user-activities/${userId}`
    );
  }
  // === Login Activities ===
  getAllLoginActivities(): Observable<LoginActivityDTO[]> {
    return this.http.get<LoginActivityDTO[]>(
      `${this.baseUrl}/login-activities`
    );
  }

  getUserLoginActivities(userId: string): Observable<LoginActivityDTO[]> {
    return this.http.get<LoginActivityDTO[]>(
      `${this.baseUrl}/login-activities/${userId}`
    );
  }

  // === Roles Activities ===

  getAllRolesActivities(): Observable<RoleActivityDTO[]> {
    return this.http.get<RoleActivityDTO[]>(`${this.baseUrl}/roles-activities`);
  }
}
