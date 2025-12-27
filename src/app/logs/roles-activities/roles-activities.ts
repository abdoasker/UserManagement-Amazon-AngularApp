import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../Services/audit.js';
import { RoleActivityDTO } from '../../Models/RoleActivityDTO.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-activities',
  imports: [CommonModule],
  templateUrl: './roles-activities.html',
  styleUrl: './roles-activities.scss',
})
export class RolesActivities implements OnInit {
  activities: RoleActivityDTO[] = [];
  loading = true;

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.auditService.getAllRolesActivities().subscribe({
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
