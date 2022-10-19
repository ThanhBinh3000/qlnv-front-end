import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root',
})
export class QuanLyDanhSachHangHongHocService extends BaseService {
  GATEWAY = '/qlnv-luukho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'hang-hong-hoc', '/qlnv-luukho');
  }
}
