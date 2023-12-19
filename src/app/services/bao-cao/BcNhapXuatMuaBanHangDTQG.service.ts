import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BcNhapXuatMuaBanHangDTQGService extends BaseService {
  GATEWAY = '/qlnv-report';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bc-nhap-xuat-mua-ban-hang-dtqg', '');
  }

  baoCaoTienDoNhapHang(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-tien-do-nhap-gao`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }

  baoCaoChiTietXuatGaoHotro(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/bc-chi-tiet-xuat-gao-hotro-diaphuong`;
    return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
  }
}
