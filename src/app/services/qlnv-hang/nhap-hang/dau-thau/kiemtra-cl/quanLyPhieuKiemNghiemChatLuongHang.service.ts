import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuKiemNghiemChatLuongHangService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'knghiem-cluong', '/qlnv-hang');
  }

}
