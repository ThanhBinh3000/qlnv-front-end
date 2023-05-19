import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../../services/base.service";

@Injectable({
  providedIn: 'root',
})
export class BienBanLayMauDieuChuyenService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dieu-chuyen-noi-bo/bien-ban-lay-mau', '/qlnv-hang');
  }
}
