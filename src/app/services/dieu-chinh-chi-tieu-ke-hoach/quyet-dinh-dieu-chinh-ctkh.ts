import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { BaseService } from "../base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhDieuChinhCTKHService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quyet-dinh-dieu-chinh-ke-hoach-nam', '/qlnv-khoach');
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

  exportlistTc(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/export/list-tc`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }

  searchTc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu-tc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  xemTruocCtKhNamLuongThuc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/preview/ke-hoach-luong-thuc`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  xemTruocCtKhNamMuoi(body) {
    const url = `${environment.SERVICE_API}/qlnv-report/dc-ct-kh-preview/xem-truoc-ct-kh-muoi`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  xemTruocCtKhNamVatTu(body) {
    const url = `${environment.SERVICE_API}/qlnv-report/dc-ct-kh-preview/xem-truoc-ct-kh-vat-tu`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  xemTruocCtKhNamTheoCuc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/preview/xem-truoc-ct-kh-theo-cuc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
  xuatBaoCaoNhapVt(body: any): Promise<HttpResponse<Blob>> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/quyet-dinh-dieu-chinh-ke-hoach-nam/report-nhap-vt`;
    return this.httpClient.post(url, body, {responseType: 'blob', observe: 'response'}).toPromise();
  }
}
