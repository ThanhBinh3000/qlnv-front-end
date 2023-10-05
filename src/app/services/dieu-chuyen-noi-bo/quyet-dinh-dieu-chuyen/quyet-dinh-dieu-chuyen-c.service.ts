import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhDieuChuyenCucService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen-c', '/qlnv-hang');
  }
  getDsSoQuyetDinhDieuChuyenCuc(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-so-quyet-dinh-cho-cuc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  getDsSoQuyetDinhDieuChuyenChiCuc(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-so-quyet-dinh-cho-chi-cuc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
