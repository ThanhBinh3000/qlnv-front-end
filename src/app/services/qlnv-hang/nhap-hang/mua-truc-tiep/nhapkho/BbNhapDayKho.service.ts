import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../base.service';

@Injectable({
  providedIn: 'root',
})
export class BbNhapDayKhoService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'mua-truc-tiep/nhap-kho/bb-nhap-day-kho', '');
  }
}
