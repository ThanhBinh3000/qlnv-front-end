import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../../services/base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BienBanKetThucNhapKhacNhapKhoVatTuService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, '/nhap-khac/bien-ban-ket-thuc-nhap-kho-vt', '/qlnv-hang');
  }

  getDanhSach(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}