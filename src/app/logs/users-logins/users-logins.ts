import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../Services/audit.js';
import { LoginActivityDTO } from '../../Models/LoginActivityDTO.js';

@Component({
  selector: 'app-users-logins',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-logins.html',
  styleUrl: './users-logins.scss',
})
export class UsersLogins implements OnInit {
  logins: LoginActivityDTO[] = [];
  loading = true;

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.auditService.getAllLoginActivities().subscribe({
      next: (data) => {
        this.logins = data;
        console.log(data);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching login activities', err);
        this.loading = false;
      },
    });
  }
}
