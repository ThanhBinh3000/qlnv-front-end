import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BaseService} from "../../base.service";

@Injectable({
  providedIn: 'root'
})
export class SoLuongNhapHangService extends BaseService {
  GATEWAY = '/qlnv-hang';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sl-nhap-hang', '/qlnv-hang');
  }

}
