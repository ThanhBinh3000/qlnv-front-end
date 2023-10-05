import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEY } from '../constants/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private storageService: StorageService) {}

  saveToken(token: string) {
    return this.storageService.set(STORAGE_KEY.ACCESS_TOKEN, token);
  }

  getToken(): string {
    return this.storageService.get(STORAGE_KEY.ACCESS_TOKEN);
  }

  saveUser(user) {
    return this.storageService.set(STORAGE_KEY.USER_INFO, user);
  }

  getUser() {
    return this.storageService.get(STORAGE_KEY.USER_INFO);
  }

  saveRole(role: number) {
    return this.storageService.set(STORAGE_KEY.ROLE, role);
  }

  getRole(): number {
    return this.storageService.get(STORAGE_KEY.ROLE);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
