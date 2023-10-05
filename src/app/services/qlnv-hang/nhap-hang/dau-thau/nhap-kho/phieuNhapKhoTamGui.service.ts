import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';

@Injectable({
  providedIn: 'root',
})
export class PhieuNhapKhoTamGuiService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phieu-nhap-kho-tam-gui', '/qlnv-hang');
  }
}
