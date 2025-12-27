import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../Services/account-service';
import {
  faLock,
  faEye,
  faEyeSlash,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
  imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule],
})
export class ResetPassword implements OnInit {
  resetForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // icons
  faLock = faLock;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faCheck = faCheck;

  showPassword = false;

  private token!: string;
  private email!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';

    this.resetForm = this.fb.group(
      {
        email: [
          { value: this.email, disabled: true },
          [Validators.required, Validators.email],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  goLogin() {
    this.router.navigateByUrl('account/login');
  }
  get f() {
    return this.resetForm.controls;
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    const model = {
      email: this.email,
      token: this.token,
      newPassword: this.f['password'].value,
      confirmNewPassword: this.f['confirmPassword'].value,
    };

    this.accountService.confirmResetPassword(model).subscribe({
      next: () => {
        this.successMessage =
          'Password reset successful! Redirecting to login...';
        setTimeout(() => this.router.navigateByUrl('/account/login'), 2000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to reset password. Please try again.';
        this.isSubmitting = false;
      },
    });
  }
}
