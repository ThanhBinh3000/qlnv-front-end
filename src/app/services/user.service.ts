import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { STORAGE_KEY } from '../constants/config';
import jwt_decode from "jwt-decode";
import { UserLogin } from '../models/userlogin';
import { ResponseData } from '../interfaces/response';
import { MESSAGE } from '../constants/message';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})

export class UserService extends BaseService {

  constructor(
    public httpClient: HttpClient,
    private storageService: StorageService) {
    super(httpClient, 'user', '/qlnv-system');
  }


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
    let dvql = this.storageService.get(STORAGE_KEY.DVQL);
    var decoded = jwt_decode(token);
    // if (decoded && decoded["userinfo"]) {
    //   var userInfo = decodeURIComponent(escape(window.atob(token)));
    //   return new UserLogin(JSON.parse(userInfo));
    // }
    // return new UserLogin({})
    // var userInfo = decodeURIComponent(escape(window.atob(decoded.toString())));
    return new UserLogin(decoded, dvql);
  }

  isTongCuc() {
    let user = this.getUserLogin();
    return user.CAP_DVI == "1";
  }

  isCuc() {
    let user = this.getUserLogin();
    return user.CAP_DVI == "2";
  }

  isChiCuc() {
    let user = this.getUserLogin();
    return user.CAP_DVI == "3";
  }

  isAccessPermisson(permissionCode) {
    let listPermission = [];
    var jsonPermission = this.storageService.get(STORAGE_KEY.PERMISSION);
    if (jsonPermission && jsonPermission.length > 0) {
      listPermission = JSON.parse(jsonPermission);
    }
    if (listPermission && listPermission.length > 0) {
      let checkPermission = listPermission.find(x => x === permissionCode);
      if (checkPermission && checkPermission.length > 0) {
        return true;
      }
    }
    return false;
  }

  isAccessUrlPermisson(url) {
    let listPermission = [];
    var jsonPermission = this.storageService.get(STORAGE_KEY.PERMISSION);
    if (jsonPermission && jsonPermission.length > 0) {
      listPermission = JSON.parse(jsonPermission);
    }
    if (listPermission && listPermission.length > 0) {
      let checkPermission = listPermission.filter(x => x.url === url);
      if (checkPermission && checkPermission.length > 0) {
        return true;
      }
    }
    return false;
  }

  //get user info
  getUserInfo(username: string) {
    return this.httpClient.post<any>(environment.SERVICE_API + '/qlnv-system/user/userInfo',
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": username,
        "trangThai": ""
      }
    );
  }

  async getId(sequenceName: string) {
    if (sequenceName) {
      const url = `${environment.SERVICE_API}/qlnv-system/system/${sequenceName}`;
      let res = await this.httpClient.get<any>(url).toPromise();
      if (res.msg == MESSAGE.SUCCESS) {
        return res.data;
      }
    } else {
      console.error('Sequence Name is null')
    }
  }

  //get user name
  getUserName() {
    var token = this.storageService.get(STORAGE_KEY.ACCESS_TOKEN);
    var decoded = jwt_decode(token);
    if (decoded && decoded["sub"]) {
      var userName = decoded["sub"];
      return userName;
    }
    return null;
  }

  haveAnyCap(caps: any) {
    if (!caps) {
      return true;
    }
    let user = this.getUserLogin();
    for (let c of caps) {
      if (c == user.CAP_DVI) {
        return true;
      }
    }
    return false;
  }

  isAccessPermissons(...params: string[]) {
    let listPermission = [];
    var jsonPermission = this.storageService.get(STORAGE_KEY.PERMISSION);
    if (jsonPermission && jsonPermission.length > 0) {
      listPermission = JSON.parse(jsonPermission);
    }
    for (let p of params) {
      if (listPermission && listPermission.length > 0) {
        let checkPermission = listPermission.find(x => x === p);
        if (checkPermission && checkPermission.length > 0) {
          return true;
        }
      }
    }
    return false;
  }
}
