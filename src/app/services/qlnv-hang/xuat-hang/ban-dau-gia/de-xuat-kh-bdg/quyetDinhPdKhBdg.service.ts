import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from 'src/app/services/base.service';
import {OldResponseData} from 'src/app/interfaces/response';
import {environment} from 'src/environments/environment';
import {PATH} from 'src/app/constants/path';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhPdKhBdgService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.DAU_GIA + "/" + PATH.QD_PD_BDG, PATH.QLNV_HANG);
  }

  getDtlDetail(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/dtl-chi-tiet/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

  approveDtl(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/dtl-chi-tiet/phe-duyet`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  searchDtl(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/dtl-chi-tiet/tra-cuu`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  exportDtl(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/dtl-chi-tiet/ket-xuat`;
    return this._httpClient.post(url, body, {responseType: 'blob'});
  }
}
