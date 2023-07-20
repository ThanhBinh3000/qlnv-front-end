import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { BaseService } from '../../../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HoSoKyThuatNkService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ho-so-ky-thuat-nk', '/qlnv-hang');
  }

}
