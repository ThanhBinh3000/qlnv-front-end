import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BBGiaoNhanService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'nhap-khac/bien-ban-giao-nhan', '/qlnv-hang');
  }

}