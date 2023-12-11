import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  login(body) {
    const url = `${environment.AUTHEN_API}/qlnv-security/login`;
    return this.httpClient.post(url, body);
  }

  refreshToken(body) {
    const url = `${environment.AUTHEN_API}/TokenRefresh`;
    return this.httpClient.post(url, body);
  }

  captcha() {
    const url = `${environment.AUTHEN_API}/qlnv-security/captcha/get-captcha`;
    return this.httpClient.get(url);
  }
}
