import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../base.service";
import { PATH } from 'src/app/constants/path';

@Injectable({
  providedIn: 'root',
})
export class ThongTinDauGiaService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/ban-dau-gia/to-chuc-trien-khai', PATH.QLNV_HANG);
  }
}
