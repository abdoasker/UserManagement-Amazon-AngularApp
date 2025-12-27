import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AccountService } from '../Services/account-service';
import { RegisterDTO } from '../Models/register-dto.js';
import {
  faUser,
  faEnvelope,
  faLock,
  faCalendar,
  faGlobe,
  faPhone,
  faImage,
  faCheck,
  faEyeSlash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EmailValidator } from '../Validators/email-validator.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports: [FaIconComponent, CommonModule, ReactiveFormsModule],
})
export class Register implements OnInit {
  // Font Awesome icons
  faUser = faUser;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faCalendar = faCalendar;
  faGlobe = faGlobe;
  faPhone = faPhone;
  faImage = faImage;
  faCheck = faCheck;
  faEyeSlash = faEyeSlash;
  faEye = faEye;

  registerForm: FormGroup;
  isSubmitting = false;
  registrationSuccess = false;
  errorMessage: any;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.registerForm = this.fb.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-Z\s]+$/),
          ],
        ],
        email: [
          '',
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [
              EmailValidator.createValidator(this.accountService),
            ],
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
        confirmPassword: ['', [Validators.required]],
        dateOfBirth: [''],
        region: [
          '',
          [Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)],
        ],
        phoneNumber: [
          '',
          [Validators.maxLength(15), Validators.pattern(/^\+?[0-9\s]+$/)],
        ],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        this.router.navigateByUrl('orders');
      }
    }
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const registerData: RegisterDTO = {
      FullName: this.registerForm.value.fullName,
      Email: this.registerForm.value.email,
      Password: this.registerForm.value.password,
      ConfirmPassword: this.registerForm.value.confirmPassword,
      DateOfBirth: this.registerForm.value.dateOfBirth || undefined,
      Region: this.registerForm.value.region || undefined,
      PhoneNumber: this.registerForm.value.phoneNumber || undefined,
      ProfilePictureUrl: this.registerForm.value.profilePictureUrl || undefined,
    };

    this.accountService.Registeration(registerData).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        if (response.message.includes('successful')) {
          this.registrationSuccess = true;
          this.registerForm.reset();
          this.router.navigateByUrl('account/confirm-email');
        } else {
          this.errorMessage = response.error.detail ?? 'Registration failed';
          console.log(this.errorMessage);
        }
      },
      error: (error) => {
        this.isSubmitting = false;

        // Handle different types of error responses
        if (error.error) {
          // For validation errors (400 Bad Request)
          if (error.status === 400 && error.error.errors) {
            this.errorMessage = 'Validation failed:';
            // Format validation errors for display
            const errorMessages = [];
            for (const [field, messages] of Object.entries(
              error.error.errors
            )) {
              errorMessages.push(
                `${field}: ${(messages as string[]).join(', ')}`
              );
            }
            this.errorMessage += '\n' + errorMessages.join('\n');

            console.log(
              'Validation errors:',
              JSON.stringify(error.error, null, 2)
            );
          }
          // For other error types
          else {
            this.errorMessage =
              error.detail ||
              error.error.title ||
              error.error.message ||
              'Registration failed';
            console.log('API Error:', JSON.stringify(error.error, null, 2));
          }
        }
        // For network or other unexpected errors
        else {
          this.errorMessage =
            error.message || 'An unexpected error occurred during registration';
          console.log('Network/Client Error:', error);
        }

        console.log('Registration error:', this.errorMessage);
      },
    });
  }
  goLogin() {
    this.router.navigateByUrl('account/login');
  }
  get f() {
    return this.registerForm.controls;
  }
  // Add this property to track password visibility
  showPassword = false;

  // ... rest of your existing component code ...

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
