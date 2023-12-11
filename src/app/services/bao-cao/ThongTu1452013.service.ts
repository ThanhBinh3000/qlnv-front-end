import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from "../base.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ThongTu1452013Service extends BaseService {
  GATEWAY = '/qlnv-report';

  constructor(public httpClient: HttpClient) {
    super(httpClient, '145-2013-ttbtc', '');
  }

  khTongHopNhapXuat(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/kh-tong-hop-nhap-xuat`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }

  keHoachTang(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/kh-tang`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }

  keHoachGiam(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/kh-giam`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }

  keHoachLuanPhienDoiHang(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/kh-luan-phien-doi-hang`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }

  thucHienKeHoach(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/thuc-hien-kh`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }

  nhapXuatTon(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/nhap-xuat-ton`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }

  nhapXuatTonCt(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/nhap-xuat-ton-ct`;
    return this._httpClient.post(url, body, {responseType: 'blob'}).toPromise();
  }


}
