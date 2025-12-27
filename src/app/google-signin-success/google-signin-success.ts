import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../Services/account-service';

@Component({
  selector: 'app-google-signin-success',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4">
      <div class="alert alert-info">Signing you in with Google...</div>
    </div>
  `,
})
export class GoogleSigninSuccess implements OnInit {
  constructor(
    private router: Router,
    private accountService: AccountService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    const refreshToken = url.searchParams.get('refreshToken');
    const userName = url.searchParams.get('userName');
    const role = url.searchParams.get('role');

    if (isPlatformBrowser(this.platformId)) {
      if (token) {
        localStorage.setItem('token', token);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      if (userName) {
        localStorage.setItem('userName', userName);
        this.accountService.setUserName(userName);
      }
      if (role) {
        localStorage.setItem('userRole', role);
        this.accountService.setUserRole(role);
      }
    }

    this.router.navigateByUrl('home');
  }
}


