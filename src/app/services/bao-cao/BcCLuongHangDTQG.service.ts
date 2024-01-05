import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BcCLuongHangDTQGService extends BaseService {
  GATEWAY = '/qlnv-report';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bc-cl-hang-dtqg', '');
  }

  baoCaoSLuongCLuongCcdc(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-sl-cl-ccdc`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  baoCaoSLuongCLuongMmTbcd(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-sl-cl-mm-tbcd`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  baoCaoCongTacBqHangDtqg(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bccl-ct-bq-hangdtqg`;
    // const url = `http://localhost:3333/${this.table}/bccl-ct-bq-hangdtqg`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  bcclNhapHangDtqg(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-cl-hang-dtqg-nhap-kho`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  bcclXuatHangDtqg(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-cl-hang-dtqg-xuat-kho`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  bcclHangHaoHut(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-cl-hao-hut-hang-dtqg`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  bcCongTacKtkt(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-congtac-qly-ktkt`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  bcclGiaKeKichKe(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-giake-kichke`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
  bcclTinhHinhKiemDinh(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-tinh-hinh-kiem-dinh-ccdc`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }


}
