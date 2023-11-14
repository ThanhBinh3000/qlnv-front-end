import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BaseService} from './base.service';
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhTtcpService extends BaseService {

  gateway: string = '/qlnv-khoach'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'giao-chi-tieu-von-dau-nam/quyet-dinh/ttcp', '/qlnv-khoach');
  }

  chiTietTheoNam(nam: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/giao-chi-tieu-von-dau-nam/quyet-dinh/ttcp/chi-tiet-nam/${nam}`;
    return this.httpClient.get(url).toPromise();
  }

  chiTietTheoSoQd(soQd: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/giao-chi-tieu-von-dau-nam/quyet-dinh/ttcp/chi-tiet-so-qd/${soQd}`;
    return this.httpClient.get(url).toPromise();
  }

  preview(body) {
    const url = `${environment.SERVICE_API_LOCAL}/${this.table}/xem-truoc`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }
}
