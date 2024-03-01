import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';
import {BaseLocalService} from "../../../../base-local.service";

@Injectable({
  providedIn: 'root',
})
export class QuanLyPhieuNhapDayKhoService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ql-bien-ban-nhap-day-kho-lt', '/qlnv-hang');
  }

}
