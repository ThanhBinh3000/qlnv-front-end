import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "../../../base.service";

@Injectable({
  providedIn: 'root',
})
export class DxKhNhapKhacService extends BaseService {
  GATEWAY = '/qlnv-hang';
  CONTROLLER = 'nhap-khac/dx-kh';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'nhap-khac/dx-kh', '/qlnv-hang');
  }
}