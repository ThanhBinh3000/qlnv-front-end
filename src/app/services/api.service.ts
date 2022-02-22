import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  login(body) {
    const url = `${environment.ACCOUNT_API}api/Account/DangNhap`;
    return this.httpClient.post(url, body);
  }

  refreshToken(body) {
    const url = `${environment.ACCOUNT_API}api/Account/TokenRefresh`;
    return this.httpClient.post(url, body);
  }
}
