
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhBtcNganhService extends BaseService {

  gateway: string = '/qlnv-khoach'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'giao-chi-tieu-von-dau-nam/quyet-dinh/btc-nganh', '/qlnv-khoach');
  }

}
