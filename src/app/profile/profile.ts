import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { UserDTO } from '../Models/UserDTO.js';
import { UserService } from '../Services/user-service.js';
import { CommonModule } from '@angular/common';
import { AddressAddDTO, AddressDTO } from '../Models/AddressDTO.js';
import { PhoneAddDTO, PhoneDTO } from '../Models/PhoneDTO.js';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, FaIconComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  profileForm!: FormGroup;
  user?: UserDTO;
  loading = false;
  message = '';
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;
  // local lists to render/refresh easily
  addresses: AddressDTO[] = [];
  phones: PhoneDTO[] = [];
  // Track which item is being edited
  editingAddressId: string | null = null;
  editingPhoneId: string | null = null;

  showAddAddress = false;
  showAddPhone = false;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    // Hardcoded email for demo; in real case, get it from logged-in user
    const email =
      localStorage.getItem('userName') ||
      sessionStorage.getItem('userName') ||
      '';
    this.loading = true;
    console.log(email);

    this.userService.getUserByEmail(email).subscribe({
      next: (u) => {
        this.user = u;
        this.profileForm = this.fb.group({
          fullName: [u.fullName, Validators.required],
          region: [u.region],
          birthdate: [u.birthdate, Validators.required],
        });
        console.log(u);

        this.refreshAddresses();
        this.refreshPhones();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  editingProfile = false;

  startEditProfile(): void {
    this.editingProfile = true;
  }

  cancelEditProfile(): void {
    this.editingProfile = false;
    // reset form values back to original user data
    if (this.user) {
      this.profileForm.patchValue({
        fullName: this.user.fullName,
        region: this.user.region,
        birthdate: this.user.birthdate,
      });
    }
  }

  onSave(): void {
    if (!this.user || this.profileForm.invalid) return;

    this.userService
      .updatePersonalInfo(this.user.id, this.profileForm.value)
      .subscribe({
        next: () => {
          this.message = 'Profile updated successfully!';
          this.editingProfile = false;

          // ✅ Update local user object with latest form values
          this.user = {
            ...this.user,
            ...this.profileForm.value,
          };
        },
        error: (err) => {
          console.error(err);
          this.message = 'Error updating profile';
        },
      });
  }

  // ✅ Address operations

  refreshAddresses(): void {
    if (!this.user) return;
    this.userService.getAddresses(this.user.id).subscribe({
      next: (list) => {
        this.addresses = list || [];
        console.log(this.addresses);
      },
      error: (err) => {
        // If controller returns 404 when empty, just show none
        if (err?.status === 404) this.addresses = [];
        else console.error(err);
      },
    });
  }

  addAddress(address: AddressAddDTO): void {
    if (!this.user) return;
    this.userService.addAddress(this.user.id, address).subscribe({
      next: () => {
        this.message = 'Address added!';
        this.refreshAddresses();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error adding address';
      },
    });
  }

  updateAddress(addressId: string, address: AddressDTO): void {
    this.userService.updateAddress(addressId, address).subscribe({
      next: () => {
        this.message = 'Address updated!';
        this.refreshAddresses();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error updating address';
      },
    });
  }

  deleteAddress(addressId: string): void {
    if (!this.user) return;
    this.userService.deleteAddress(this.user.id, addressId).subscribe({
      next: () => {
        this.message = 'Address removed!';
        this.refreshAddresses();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error removing address';
      },
    });
  }

  // ✅ Phone operations

  refreshPhones(): void {
    if (!this.user) return;
    this.userService.getPhones(this.user.id).subscribe({
      next: (list) => {
        this.phones = list || [];
        console.log(this.phones);
      },
      error: (err) => {
        if (err?.status === 404) this.phones = [];
        else console.error(err);
      },
    });
  }

  addPhone(phone: PhoneAddDTO): void {
    if (!this.user) return;
    this.userService.addPhone(this.user.id, phone).subscribe({
      next: () => {
        this.message = 'Phone added!';
        this.refreshPhones();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error adding phone';
      },
    });
  }

  updatePhone(phone: PhoneDTO): void {
    if (!this.user) return;
    this.userService.updatePhone(this.user.id, phone).subscribe({
      next: () => {
        this.message = 'Phone updated!';
        this.refreshPhones();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error updating phone';
      },
    });
  }

  deletePhone(phoneId: string): void {
    if (!this.user) return;
    this.userService.deletePhone(this.user.id, phoneId).subscribe({
      next: () => {
        this.message = 'Phone removed!';
        this.refreshPhones();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error removing phone';
      },
    });
  }

  startEditAddress(addrId: string): void {
    this.editingAddressId = addrId;
  }

  saveAddress(address: AddressDTO): void {
    if (!address.addressId) return;
    this.userService.updateAddress(address.addressId, address).subscribe({
      next: () => {
        this.message = 'Address updated!';
        this.editingAddressId = null;
        this.refreshAddresses();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error updating address';
      },
    });
  }

  cancelEditAddress(): void {
    this.editingAddressId = null;
  }

  setAddressDefault(userId: string, addressId: string): void {
    if (!addressId) return;
    this.userService.setDefaultAddress(userId, addressId).subscribe({
      next: () => {
        this.message = 'Address default updated!';
        this.refreshAddresses();
      },
      error: (err) => console.error(err),
    });
  }

  //  for Phones
  startEditPhone(phoneId: string): void {
    this.editingPhoneId = phoneId;
  }

  savePhone(phone: PhoneDTO): void {
    if (!this.user) return;
    this.userService.updatePhone(this.user.id, phone).subscribe({
      next: () => {
        this.message = 'Phone updated!';
        this.editingPhoneId = null;
        this.refreshPhones();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error updating phone';
      },
    });
  }

  cancelEditPhone(): void {
    this.editingPhoneId = null;
  }

  setPhoneDefault(userId: string, phoneId: string): void {
    if (!phoneId) return;
    this.userService.setDefaultPhone(userId, phoneId).subscribe({
      next: () => {
        this.message = 'phone default updated!';
        this.refreshPhones();
      },
      error: (err) => console.error(err),
    });
  }
}
