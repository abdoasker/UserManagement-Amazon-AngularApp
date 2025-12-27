import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserActivityDTO } from '../../Models/UserActivityDTO.js';
import { AuditService } from '../../Services/audit.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-activities',
  imports: [CommonModule],
  templateUrl: './user-activities.html',
  styleUrl: './user-activities.scss',
})
export class UserActivities implements OnInit {
  userId!: string;

  activities: UserActivityDTO[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    this.loadActivities();
  }

  loadActivities() {
    this.isLoading = true;
    this.auditService.getUserActivities(this.userId).subscribe({
      next: (data) => {
        this.activities = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user activities';
        this.isLoading = false;
      },
    });
  }
}
