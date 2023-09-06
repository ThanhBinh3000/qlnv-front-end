import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from "src/app/services/base.service";
import {environment} from "src/environments/environment";
import {OldResponseData} from "src/app/interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class HoSoKyThuatBttService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dau-gia/kt-cl/ho-so-ky-thuat', '');
  }

  updateDdiemNhap(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-cl/ho-so-ky-thuat/cap-nhat-ddiem-nhap`;
    return this.httpClient.post<any>(url, body).toPromise();
  }

  search(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-cl/ho-so-ky-thuat/tra-cuu`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getDetail(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-cl/ho-so-ky-thuat/chi-tiet`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  create(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-cl/ho-so-ky-thuat/them-moi`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  update(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-cl/ho-so-ky-thuat/cap-nhat`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  approve(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-cl/ho-so-ky-thuat/phe-duyet`
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
  preview(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/kt-cl/ho-so-ky-thuat/xem-truoc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
