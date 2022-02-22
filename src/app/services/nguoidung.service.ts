import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';
import { UserLogin } from '../models/userlogin';

@Injectable({
  providedIn: 'root'
})

export class NguoiDungService extends BaseService {
  apiUrl: string;
  constructor(
    public httpClient: HttpClient
  ) {
    super(httpClient, "NguoiDung");
    this.apiUrl = `${environment.SERVICE_API}api/NguoiDung`;
  }

  GetNguoiDungTheoUserName(username: string): Promise<OldResponseData> {
    const url = `${this.apiUrl}/TimTheoUserName/${username}`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }


  GetUserLogin(): UserLogin {
    let user = new UserLogin({
      roleId: "9C071DA5-3210-4727-9A03-C6930E70F94D",
      roleName: "Văn thư",
      deptId: "4F32651A-769D-4085-98E0-A89BE6EED54B",
      deptName: "Tổng cục dự trữ",
      userId: "A6AD16BB-9C6E-4A26-ADFA-18BF184FB482",
      displayName: "Văn thư tổng cục",
      userName: "vanthutc"
    });
    return user;
  }
  
  danhSach(body : any){
  const url = `${environment.SERVICE_API}api/NguoiDung/DanhSach`;
  return this.httpClient.post(url,body);
  }

  timTheoUserName(username:any) {
    const url = `${environment.SERVICE_API}api/NguoiDung/timTheoUserName/${username}`;
    return this.httpClient.get(url);
  }

  xemThongTinCaNhan(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/NguoiDung/XemThongTinCaNhan`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  TimLanhDao(body : any) : Promise<OldResponseData>{
    const url = `${environment.SERVICE_API}api/NguoiDung/TimLanhDao`;
    return this.httpClient.post<OldResponseData>(url, body).toPromise();
  }

  timLanhDaoKyThay() : Promise<OldResponseData>{
    const url = `${environment.SERVICE_API}api/NguoiDung/TimLanhDaoKyThay`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  timLanhDaoKyThuaLenh() : Promise<OldResponseData>{
    const url = `${environment.SERVICE_API}api/NguoiDung/TimLanhDaoKyThuaLenh`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  timLanhDaoTheoVaiTro(vaitro) : Promise<OldResponseData>{
    const url = `${environment.SERVICE_API}api/NguoiDung/TimLanhDaoTheoVaiTro/${vaitro}`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  getAllLeader() : Promise<OldResponseData>{
    const url = `${environment.SERVICE_API}api/NguoiDung/GetAllLeader`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  getAllUser() : Promise<OldResponseData>{
    const url = `${environment.SERVICE_API}api/NguoiDung/GetAllUser`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }
}
