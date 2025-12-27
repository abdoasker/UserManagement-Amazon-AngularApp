import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../Services/admin.js';
import { RoleDTO, RoleAddDTO } from '../Models/role.js';
import { PermissionDTO } from '../Models/PermissionDTO.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.html',
  styleUrls: ['./roles.scss'],
})
export class Roles implements OnInit {
  roles: RoleDTO[] = [];
  allPermissions: PermissionDTO[] = [];

  selectedPermissionIds: { [roleId: string]: string | undefined } = {};

  isLoading = false;
  errorMessage = '';
  newRoleName = '';
  editingRoleId: string | null = null;
  editingRoleName = '';

  constructor(private adminService: AdminService ,private router:Router) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.adminService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load roles. Please try again.';
        this.isLoading = false;
      },
    });
  }

  viewAllActivities() {
    this.router.navigate([`/admin/logs/roles-activities`]);
  }
  loadPermissions() {
    this.adminService.getAllPermissions().subscribe({
      next: (perms) => {
        this.allPermissions = perms;
      },
      error: () => (this.errorMessage = 'Failed to load permissions'),
    });
  }
  getSortedPermissions(role: RoleDTO): PermissionDTO[] {
    return [...role.permissions].sort((a, b) => a.task.localeCompare(b.task));
  }

  createRole(): void {
    if (!this.newRoleName.trim()) return;
    const roleAdd: RoleAddDTO = { name: this.newRoleName.trim() };
    this.isLoading = true;
    this.adminService.createRole(roleAdd).subscribe({
      next: () => {
        this.newRoleName = '';
        this.loadRoles();
      },
      error: () => {
        this.errorMessage = 'Failed to create role.';
        this.isLoading = false;
      },
    });
  }

  startEdit(role: RoleDTO): void {
    this.editingRoleId = role.id;
    this.editingRoleName = role.name;
  }

  saveEdit(): void {
    if (!this.editingRoleId || !this.editingRoleName.trim()) return;
    this.isLoading = true;
    this.adminService
      .updateRole(this.editingRoleId, {
        id: this.editingRoleId,
        name: this.editingRoleName.trim(),
      })
      .subscribe({
        next: (res) => {
          console.log(res);

          this.editingRoleId = null;
          this.editingRoleName = '';
          this.loadRoles();
        },
        error: () => {
          this.errorMessage = 'Failed to update role.';
          this.isLoading = false;
        },
      });
  }

  cancelEdit(): void {
    this.editingRoleId = null;
    this.editingRoleName = '';
  }

  deleteRole(roleId: string): void {
    if (!confirm('Are you sure you want to delete this role?')) return;
    this.isLoading = true;
    this.adminService.deleteRole(roleId).subscribe({
      next: () => this.loadRoles(),
      error: () => {
        this.errorMessage = 'Failed to delete role.';
        this.isLoading = false;
      },
    });
  }

  getAvailablePermissions(role: RoleDTO): PermissionDTO[] {
    const rolePermissionIds = new Set(role.permissions.map((p) => p.id));
    return this.allPermissions.filter((p) => !rolePermissionIds.has(p.id));
  }
  addPermissionToRole(roleId: string) {
    const permissionId = this.selectedPermissionIds[roleId];
    if (!permissionId) return;

    this.isLoading = true;
    this.adminService.assignPermissionToRole(roleId, permissionId).subscribe({
      next: () => {
        const role = this.roles.find((r) => r.id === roleId);
        const perm = this.allPermissions.find((p) => p.id === permissionId);
        if (role && perm) {
          role.permissions.push(perm);
        }
        this.selectedPermissionIds[roleId] = undefined;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to assign permission';
        this.isLoading = false;
      },
    });
  }

  revokePermission(roleId: string, permissionId: string) {
    this.isLoading = true;
    this.adminService.revokePermissionFromRole(roleId, permissionId).subscribe({
      next: () => {
        const role = this.roles.find((r) => r.id === roleId);
        if (role) {
          role.permissions = role.permissions.filter(
            (p) => p.id !== permissionId
          );
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to revoke permission';
        this.isLoading = false;
      },
    });
  }
}
