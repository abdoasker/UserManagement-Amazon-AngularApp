import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccountService } from './Services/account-service.js';
import { isPlatformBrowser, NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('UserManagement');
  constructor(
    public Acc: AccountService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit() {
    this.loadUser();
  }
  private loadUser(): void {
    // Only run this in the browser
    if (isPlatformBrowser(this.platformId)) {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      const userName =
        localStorage.getItem('userName') || sessionStorage.getItem('userName');
      const userRole =
        localStorage.getItem('userRole') || sessionStorage.getItem('userRole');

      if (token && userName) {
        this.Acc.setUserName(userName);
        this.Acc.setUserRole(userRole);
      }
    }
  }

  Logout() {
    this.Acc.LogOut().subscribe({
      next: () => {
        // Handle successful logout (e.g., redirect)
        this.Acc.setUserName(null);
        this.Acc.setUserRole(null);
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        sessionStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        sessionStorage.removeItem('userRole');
        this.router.navigate(['/account/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }
}
