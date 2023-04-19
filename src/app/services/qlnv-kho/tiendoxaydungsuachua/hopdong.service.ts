import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../base.service';
import {environment} from 'src/environments/environment';
import {OldResponseData} from "../../../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class HopdongService extends BaseService {
  GATEWAY = '/qlnv-kho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'tien-do-xdsc/xay-dung/hop-dong', '');
  }

  search(body) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }


  danhSachHdTheoKhlcnt(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/danh-sach-hop-dong-theo-khlcnt/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

}