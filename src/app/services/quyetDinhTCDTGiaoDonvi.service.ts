import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhTCDTGiaoDonviService extends BaseService {

  gateway: string = '/qlnv-khoach'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'giao-chi-tieu-von-dau-nam/quyet-dinh/tcdt-giao-donvi', '/qlnv-khoach');
  }

  chiTietTheoNam(nam: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/giao-chi-tieu-von-dau-nam/quyet-dinh/tcdt-giao-donvi/chi-tiet-nam/${nam}`;
    return this.httpClient.get(url).toPromise();
  }

  chiTietTheoSoQd(soQd: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/giao-chi-tieu-von-dau-nam/quyet-dinh/tcdt-giao-donvi/chi-tiet-so-qd/${soQd}`;
    return this.httpClient.get(url).toPromise();
  }
}
