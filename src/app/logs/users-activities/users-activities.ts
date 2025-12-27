import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../Services/audit.js';
import { UserActivityDTO } from '../../Models/UserActivityDTO.js';

@Component({
  selector: 'app-users-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-activities.html',
  styleUrl: './users-activities.scss',
})
export class UsersActivities implements OnInit {
  activities: UserActivityDTO[] = [];
  loading = true;

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.auditService.getAllUserActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching activities', err);
        this.loading = false;
      },
    });
  }
}
