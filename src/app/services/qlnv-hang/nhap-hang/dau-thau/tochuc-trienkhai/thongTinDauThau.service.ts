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
}
