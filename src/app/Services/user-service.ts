import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../Models/UserDTO.js';
import { AddressAddDTO, AddressDTO } from '../Models/AddressDTO.js';
import { PhoneAddDTO, PhoneDTO } from '../Models/PhoneDTO.js';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7215/api/v1/users';

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/email/${email}`);
  }

  updatePersonalInfo(userId: string, data: Partial<UserDTO>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/personal-info`, data);
  }

  getAddresses(userId: string) {
    return this.http.get<AddressDTO[]>(`${this.apiUrl}/${userId}/addresses`);
  }

  addAddress(userId: string, address: AddressAddDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/addresses`, address);
  }

  updateAddress(addressId: string, address: AddressDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/addresses/${addressId}`, address);
  }

  deleteAddress(userId: string, addressId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/addresses/${addressId}`);
  }

  setDefaultAddress(userId: string, addressId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${userId}/addresses/${addressId}/default`,
      {}
    );
  }

  getPhones(userId: string) {
    return this.http.get<PhoneDTO[]>(`${this.apiUrl}/${userId}/phones`);
  }

  addPhone(userId: string, phone: PhoneAddDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/phones`, phone);
  }

  updatePhone(userId: string, phone: PhoneDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/phones`, phone);
  }

  deletePhone(userId: string, phoneId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/phones/${phoneId}`);
  }
  setDefaultPhone(userId: string, phoneId: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${userId}/phones/${phoneId}/default`,
      {}
    );
  }
}
