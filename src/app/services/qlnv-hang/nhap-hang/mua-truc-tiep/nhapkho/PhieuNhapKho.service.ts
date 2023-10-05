import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../base.service';

@Injectable({
  providedIn: 'root',
})
export class PhieuNhapKhoService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'mua-truc-tiep/nhap-kho/phieu-nhap-kho', '');
  }
}
