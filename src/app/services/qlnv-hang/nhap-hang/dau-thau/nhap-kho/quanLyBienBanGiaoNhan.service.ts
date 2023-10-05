import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';

@Injectable({
  providedIn: 'root',
})
export class QuanLyBienBanGiaoNhanService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bien-ban-giao-nhan-vt', '/qlnv-hang');
  }


}
