import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../base.service';

@Injectable({
  providedIn: 'root',
})
export class ThongTinDauThauService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/ttin-dthau', '/qlnv-hang');
  }

}
