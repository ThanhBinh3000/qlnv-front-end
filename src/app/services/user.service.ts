import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { STORAGE_KEY } from '../constants/config';
import jwt_decode from 'jwt-decode';
import { UserLogin } from '../models/userlogin';
import { OldResponseData } from '../interfaces/response';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
  ) {}

  createUser(body) {
    const url = `${environment.SERVICE_API}api/Account/Them`;
    return this.httpClient.post(url, body);
  }

  updateUser(body) {
    const url = `${environment.SERVICE_API}api/Account/Sua`;
    return this.httpClient.post(url, body);
  }

  deleteUser(id) {
    const url = `${environment.SERVICE_API}api/Account/Xoa?id=${id}`;
    return this.httpClient.post(url, {});
  }

  getListUser(body) {
    const url = `${environment.SERVICE_API}api/Account/TimTheoDieuKien`;
    return this.httpClient.post(url, body);
  }

  getUserById(id) {
    const url = `${environment.SERVICE_API}api/Account/TimBoiId?id=${id}`;
    return this.httpClient.get(url);
  }

  layTatCaVaiTro(): Promise<OldResponseData> {
    const url = `${environment.ACCOUNT_API}api/Account/LayTatCaVaiTro`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  chuyenVaiTro(idVaiTro): Promise<OldResponseData> {
    const url = `${environment.ACCOUNT_API}api/Account/ChuyenVaiTro/${idVaiTro}`;
    return this.httpClient.post<OldResponseData>(url, {}).toPromise();
  }

  getUserLogin(): UserLogin {
    var token = this.storageService.get(STORAGE_KEY.ACCESS_TOKEN);
    var decoded = jwt_decode(token);
    if (decoded && decoded['userinfo']) {
      var userInfo = decodeURIComponent(
        escape(window.atob(decoded['userinfo'])),
      );
      return new UserLogin(JSON.parse(userInfo));
    }
    return new UserLogin({});
  }
}
