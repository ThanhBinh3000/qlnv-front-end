import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class KhCnCongTrinhNghienCuu extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kh-cn-bq', '/qlnv-hang');
  }

}

