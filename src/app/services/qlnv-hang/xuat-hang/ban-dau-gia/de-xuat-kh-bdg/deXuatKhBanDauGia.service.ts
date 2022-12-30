
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OldResponseData } from '../../../../../interfaces/response';
import { BaseService } from '../../../../base.service';


@Injectable({
  providedIn: 'root'
})
export class DeXuatKhBanDauGiaService extends BaseService {
  GATEWAY = '/qlnv-hang';
  CONTROLLER = 'ban-dau-gia/dx-kh-bdg';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ban-dau-gia/dx-kh-bdg', '/qlnv-hang');
  }

  getSoLuongAdded(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/count-sl-kh`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

}