import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HoSoKyThuatService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dieu-chuyen-noi-bo/ho-so-ky-thuat', '/qlnv-hang');
  }
}
