import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../base.service";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhDieuChuyenCucService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dieu-chuyen-noi-bo/quyet-dinh-dieu-chuyen-c', '/qlnv-hang');
  }
}
