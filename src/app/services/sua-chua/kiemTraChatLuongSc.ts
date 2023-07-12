import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class KiemTraChatLuongSc extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sua-chua/kt-cl', '/qlnv-hang');
  }

}
