import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../base.service';
import { environment } from 'src/environments/environment';
import { OldResponseData } from 'src/app/interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class ThongTinDauThauService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/ttin-dthau', '/qlnv-hang');
  }

  getDetailThongTin(id, loaiVthh): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/${id}/${loaiVthh}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
  getDetailThongTinVt(id, loaiVthh, type): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/vt/${id}/${loaiVthh}/${type}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
  getDanhSachNhaThau(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ds-nha-thau`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }
  updateKqLcnt(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/update-kq-dt`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  updateGoiThau(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/update-goi-thau`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
