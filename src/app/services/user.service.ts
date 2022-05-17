import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { STORAGE_KEY } from '../constants/config';
import jwt_decode from "jwt-decode";
import { UserLogin } from '../models/userlogin';
import { ResponseData } from '../interfaces/response';
@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private httpClient: HttpClient, private storageService: StorageService,) { }

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

  layTatCaVaiTro(): Promise<ResponseData<any>> {
    const url = `${environment.SERVICE_API}api/Account/LayTatCaVaiTro`;
    return this.httpClient.get<ResponseData<any>>(url).toPromise();
  }

  chuyenVaiTro(idVaiTro): Promise<ResponseData<any>> {
    const url = `${environment.SERVICE_API}api/Account/ChuyenVaiTro/${idVaiTro}`;
    return this.httpClient.post<ResponseData<any>>(url, {}).toPromise();
  }

  getUserLogin(): UserLogin {
    var token = this.storageService.get(STORAGE_KEY.ACCESS_TOKEN);
    var decoded = jwt_decode(token);
    // if (decoded && decoded["userinfo"]) {
    //   var userInfo = decodeURIComponent(escape(window.atob(token)));
    //   return new UserLogin(JSON.parse(userInfo));
    // }
    // return new UserLogin({})
    // var userInfo = decodeURIComponent(escape(window.atob(decoded.toString())));
      return new UserLogin(decoded);
  }

  isTongCuc(){
    let user = this.getUserLogin();
    return user.CAP_DVI == "1"
  }

  isCuc(){
    let user = this.getUserLogin();
    return user.CAP_DVI == "2"
  }

  isChiCuc(){
    let user = this.getUserLogin();
    return user.CAP_DVI == "3"
  }

}
