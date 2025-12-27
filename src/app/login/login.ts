import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AccountService } from '../Services/account-service';
import {
  faUser,
  faEnvelope,
  faLock,
  faSave,
  faCheck,
  faEyeSlash,
  faEye,
  faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EmailValidator } from '../Validators/email-validator.js';
import { Router } from '@angular/router';
import { LoginDTO } from '../Models/login-dto.js';

@Component({
  selector: 'app-login',
  imports: [FaIconComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  // Font Awesome icons
  faUser = faUser;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faCheck = faCheck;
  faEyeSlash = faEyeSlash;
  faEye = faEye;
  faSave = faSave;
  faArrowsRotate = faArrowsRotate;

  loginForm: FormGroup;
  isSubmitting = false;
  isClicked = false;
  loginSuccess = false;
  errorMessage: any;
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
          updateOn: 'blur', // Change to 'blur' or keep as default
        },
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(
            '^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[_@*-])[a-zA-Z0-9_@*-]{10,21}$'
          ),
        ],
      ],
      isPersistent: [false],
    });
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        this.router.navigateByUrl('home');
      }
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const loginData: LoginDTO = {
      IsPersistent: this.loginForm.value.isPersistent,
      Email: this.loginForm.value.email,
      Password: this.loginForm.value.password,
    };

    this.accountService.Login(loginData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.token) {
          this.loginSuccess = true;

          console.log('Registration successful:', response);

          if (isPlatformBrowser(this.platformId)) {
            if (loginData.IsPersistent) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('refreshToken', response.refreshToken);
              localStorage.setItem('userName', response.userName);
              localStorage.setItem('userRole', response.roleName);
            } else {
              sessionStorage.setItem('token', response.token);
              sessionStorage.setItem('refreshToken', response.refreshToken);
              sessionStorage.setItem('userName', response.userName);
              sessionStorage.setItem('userRole', response.roleName);
            }
          }

          this.loginForm.reset();
          this.accountService.setUserName(response.userName);
          this.accountService.setUserRole(response.roleName);
          const redirectUrl = sessionStorage.getItem('redirectUrl') || 'home';
          sessionStorage.removeItem('redirectUrl');

          this.router.navigateByUrl(redirectUrl);
        } else {
          this.errorMessage = response.error.detail ?? 'Not Authenticated';
          console.log(this.errorMessage);
        }
      },
      error: (error) => {
        this.isSubmitting = false;

        this.errorMessage =
          error.error.title || error.error.message || 'Login failed';
        console.log('API Error:', JSON.stringify(error.error, null, 2));
      },
    });
  }
  goRegister() {
    this.router.navigateByUrl('account/register');
  }
  goResetPassword() {
    this.isClicked = true;
    this.accountService.ResetPassConfirm(this.loginForm.value.email).subscribe({
      next: (response) => {
        this.isClicked = false;
        console.log('Reset password email sent:', response);
        this.router.navigateByUrl('account/confirm-email');
      },
      error: (error) => {
        this.isClicked = false;
        this.errorMessage =
          error.error.title || error.error.message || 'Request failed';
        console.error('Error sending reset password email:', error);
      },
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  // Add this property to track password visibility
  showPassword = false;

  // ... rest of your existing component code ...

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Google Sign-In handler
  onGoogleSignIn(): void {
    this.accountService.startGoogleSignIn();
  }
}
