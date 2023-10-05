import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../base.service';
import {PATH} from 'src/app/constants/path';
import {Observable} from "rxjs";
import {environment} from "../../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ChaoGiaMuaLeUyQuyenService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.BAN_TRUC_TIEP + "/" + PATH.TTIN_BTT, PATH.QLNV_HANG);
  }

  exportHopDong(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/ket-xuat/hop-dong`;
    return this._httpClient.post(url, body, {responseType: 'blob'});
  }
}
