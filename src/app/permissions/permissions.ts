import { Component, OnInit } from '@angular/core';
import { PermissionAddDTO, PermissionDTO } from '../Models/PermissionDTO.js';
import { AdminService } from '../Services/admin.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permissions',
  imports: [CommonModule, FormsModule],
  templateUrl: './permissions.html',
  styleUrls: ['./permissions.scss'],
})
export class Permissions implements OnInit {
  permissions: PermissionDTO[] = [];
  newPermission: PermissionAddDTO = { task: '', description: '' };
  editingPermissionId: string | null = null;
  editingPermission: PermissionDTO = { id: '', task: '', description: '' };

  isLoading = false;
  errorMessage = '';

  constructor(private permissionService: AdminService) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions() {
    this.isLoading = true;
    this.errorMessage = '';
    this.permissionService.getAllPermissions().subscribe({
      next: (data) => {
        this.permissions = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load permissions.';
        this.isLoading = false;
      },
    });
  }

  createPermission() {
    this.isLoading = true;
    this.permissionService.addPermission(this.newPermission).subscribe({
      next: () => {
        this.newPermission = { task: '', description: '' };
        this.loadPermissions();
      },
      error: () => {
        this.errorMessage = 'Failed to add permission.';
        this.isLoading = false;
      },
    });
  }

  startEdit(permission: PermissionDTO) {
    this.editingPermissionId = permission.id;
    this.editingPermission = { ...permission };
  }

  saveEdit() {
    if (!this.editingPermissionId) return;
    this.isLoading = true;
    this.permissionService
      .updatePermission(this.editingPermissionId, this.editingPermission)
      .subscribe({
        next: () => {
          this.editingPermissionId = null;
          this.loadPermissions();
        },
        error: () => {
          this.errorMessage = 'Failed to update permission.';
          this.isLoading = false;
        },
      });
  }

  cancelEdit() {
    this.editingPermissionId = null;
    this.editingPermission = { id: '', task: '', description: '' };
  }

  deletePermission(permissionId: string) {
    if (!confirm('Are you sure you want to delete this permission?')) return;
    this.isLoading = true;
    this.permissionService.deletePermission(permissionId).subscribe({
      next: () => this.loadPermissions(),
      error: () => {
        this.errorMessage = 'Failed to delete permission.';
        this.isLoading = false;
      },
    });
  }
}
