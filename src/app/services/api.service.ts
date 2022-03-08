import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  login(body) {
    const url = `${environment.SERVICE_API}/qlnv-security/login`;
    return this.httpClient.post(url, body);
  }

  refreshToken(body) {
    const url = `${environment.AUTHEN_API}/qlnv-gateway/TokenRefresh`;
    return this.httpClient.post(url, body);
  }
}
