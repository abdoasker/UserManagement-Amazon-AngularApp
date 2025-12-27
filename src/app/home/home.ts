import { Component } from '@angular/core';
import { AccountService } from '../Services/account-service.js';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  userName: string | null = null;

  constructor(private accountService: AccountService) {
    this.accountService.currentUserName$.subscribe(
      (name) => (this.userName = name)
    );
  }
}
