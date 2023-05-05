import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';
import { OldResponseData } from 'src/app/interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class QuanLyNghiemThuKeLotService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/bb-nghiemthu-klst', '/qlnv-hang');
  }

  getDataKho(maDvi): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/data-kho/${maDvi}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  exportPktCl(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat/pktcl`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }

}
