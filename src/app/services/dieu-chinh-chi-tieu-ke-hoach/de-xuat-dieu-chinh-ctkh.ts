import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeXuatDieuChinhCTKHService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'de-xuat-dieu-chinh-ke-hoach-nam', '/qlnv-khoach');
  }

  // traCuu(body): Promise<OldResponseData> {
  //   const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu`;
  //   return this._httpClient.post<OldResponseData>(url, body).toPromise();
  // }

  // themMoi(body): Promise<OldResponseData> {
  //   const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/them-moi`;
  //   return this._httpClient.post<OldResponseData>(url, body).toPromise();
  // }

  // capNhat(body): Promise<OldResponseData> {
  //   const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cap-nhat`;
  //   return this._httpClient.put<OldResponseData>(url, body).toPromise();
  // }

  // chiTiet(id): Promise<OldResponseData> {
  //   const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/${id}`;
  //   return this._httpClient.get<OldResponseData>(url).toPromise();
  // }

  danhSachDX(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  duyet(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/status`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  xoa(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/delete/multiple`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  exportlist(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/export/list`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }

  getDeXuat(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}
