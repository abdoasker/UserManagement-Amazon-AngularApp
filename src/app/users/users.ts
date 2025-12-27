import { Component, OnInit } from '@angular/core';
import { UserForAdmin } from '../Models/user-for-admin.js';
import { AdminService } from '../Services/admin.js';
import { CommonModule } from '@angular/common';
import { RoleDTO } from '../Models/role.js';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  users: UserForAdmin[] = [];
  roles: RoleDTO[] = [];
  selectedRole: string = '';
  isLoading = false;
  errorMessage = '';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();

    // subscribe to SignalR events
    this.adminService.userAdded$.subscribe((user) => {
      this.users = [...this.users, { ...user, selectedRole: null }];
    });

    this.adminService.userUpdated$.subscribe((updatedUser) => {
      this.users = this.users.map((u) =>
        u.id === updatedUser.id ? { ...updatedUser, selectedRole: null } : u
      );
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data.map((u) => ({ ...u, selectedRole: null }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load users. Try again later.';
        this.isLoading = false;
      },
    });
  }
  loadRoles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.adminService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load roles. Try again later.';
        this.isLoading = false;
      },
    });
  }

  onRoleChange(): void {
    if (!this.selectedRole) {
      this.loadUsers(); // no filter → get all users
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.filterUsersByRole(this.selectedRole).subscribe({
      next: (data) => {
        this.users = data.map((u) => ({ ...u, selectedRole: null }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to filter users. Try again later.';
        this.isLoading = false;
      },
    });
  }
  viewAllActivities() {
    this.router.navigate([`/admin/logs/user-activities`]);
  }

  viewActivities(userId: string) {
    this.router.navigate([`/admin/logs/user-activities`, userId]);
  }

  viewAllLogins() {
    this.router.navigate([`/admin/logs/user-logins`]);
  }

  viewLogins(userId: string) {
    this.router.navigate([`/admin/logs/user-logins`, userId]);
  }

  // For flag styling
  getStatusClass(status: string): string {
    if (!status) return 'badge bg-secondary';
    if (status.toLowerCase() === 'active') return 'badge bg-success';
    else if (status.toLowerCase() === 'suspend') return 'badge bg-warning';
    return 'badge bg-danger';
  }

  assignRole(userId: string, roleName: string | null): void {
    if (!roleName) return;
    this.isLoading = true;

    this.adminService.assignRole(userId, roleName).subscribe({
      next: () => {
        this.isLoading = false;
        // refresh users list to reflect change
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to assign role.';
        this.isLoading = false;
      },
    });
  }

  deactivateUser(userId: string): void {
    this.isLoading = true;

    this.adminService.deactivateUser(userId).subscribe({
      next: () => {
        this.isLoading = false;
        // refresh users list to reflect change
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to revoke role.';
        this.isLoading = false;
      },
    });
  }
  activateUser(userId: string): void {
    this.isLoading = true;
    this.adminService.activateUser(userId).subscribe({
      next: () => {
        this.isLoading = false;
        // refresh users list to reflect change
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to revoke role.';
        this.isLoading = false;
      },
    });
  }
  deleteUser(userId: string): void {
    this.isLoading = true;
    this.adminService.deleteUser(userId).subscribe({
      next: () => {
        this.isLoading = false;
        // refresh users list to reflect change
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to revoke role.';
        this.isLoading = false;
      },
    });
  }
  revokeRole(userId: string, roleName: string): void {
    this.isLoading = true;

    this.adminService.revokeRole(userId, roleName).subscribe({
      next: () => {
        this.isLoading = false;
        // refresh users list to reflect change
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to revoke role.';
        this.isLoading = false;
      },
    });
  }
}
