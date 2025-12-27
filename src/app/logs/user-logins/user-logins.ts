import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { LoginActivityDTO } from '../../Models/LoginActivityDTO'; // adjust path
import { AuditService } from '../../Services/audit.js';

@Component({
  selector: 'app-user-logins',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-logins.html',
  styleUrls: ['./user-logins.scss'],
})
export class UserLogins implements OnInit {
  logs: LoginActivityDTO[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.auditService.getUserLoginActivities(userId).subscribe({
        next: (data) => {
          this.logs = data;
          console.log(data);

          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load login activities';
          console.error(err);
          this.loading = false;
        },
      });
    } else {
      this.error = 'No user ID provided in URL';
      this.loading = false;
    }
  }
}
