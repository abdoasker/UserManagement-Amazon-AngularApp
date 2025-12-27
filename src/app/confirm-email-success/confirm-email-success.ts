import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../Services/account-service';

@Component({
  selector: 'app-confirm-email-success',
  template: `<p>Email confirmed! Redirecting...</p>`,
})
export class ConfirmEmailSuccess implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const refreshToken = this.route.snapshot.queryParamMap.get('refreshToken');
    const userName = this.route.snapshot.queryParamMap.get('userName');

    if (token && refreshToken && userName) {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('refreshToken', refreshToken);
      sessionStorage.setItem('userName', userName);

      this.accountService.setUserName(userName);
      console.log(userName);

      // redirect home
      this.router.navigateByUrl('/home');
    } else {
      this.router.navigateByUrl('/account/login');
    }
  }
}
