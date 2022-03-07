import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class DonviService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'Donvi');
  }

  layDanhMucDonvi() {
    const url = `${environment.SERVICE_API}api/DonVi/InitDmChung`;
    return this.httpClient.get(url);
  }

  layDonviTheoIdCha(id) {
    const url = `${environment.SERVICE_API}api/DonVi/LayTheoIdCha/${id}`;
    return this.httpClient.get(url);
  }

  LayTatCaDonViTheoTree(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/LayTatCaDonViTheoTree`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  layUserDonViRoot(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/LayUserDonViRoot`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  layTatCaDonViTheoTree(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/LayTatCaDonViTheoTree`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  LayTheoIdCha(idParent: any): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/LayTheoIdCha/${idParent}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  TimTheoId(id: any): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/TimTheoId/${id}`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  layDSDonViPhatHanh(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/layDSDonViPhatHanh`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  layDonViTheoUser(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/LayDonViTheoUser`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  layDonViDeXuat(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/LayDonViDeXuat`;
    return this.httpClient.post<OldResponseData>(url, body).toPromise();
  }

  layLanhDaoDeXuat(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/LayLanhDaoDeXuat`;
    return this.httpClient.post<OldResponseData>(url, body).toPromise();
  }

  layLanhDaoPhongDeXuat(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/LayLanhDaoPhongDeXuat`;
    return this.httpClient.post<OldResponseData>(url, body).toPromise();
  }

  layTatCaTheoFilterTree(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/LayTatCaTheoFilterTree`;
    return this.httpClient.post<OldResponseData>(url, body).toPromise();
  }

  timDonViTheoTuKhoa(search): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/TimDonViTheoTuKhoa?search=${search}`;
    return this.httpClient.get<OldResponseData>(url).toPromise();
  }

  layCapDuoiDeXuat(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/LayCapDuoiDeXuat`;
    return this.httpClient.post<OldResponseData>(url, body).toPromise();
  }

  layNguoiXuLyTiepTheoVBDen(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}api/DonVi/LayNguoiXuLyTiepTheoVBDen`;
    return this.httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
