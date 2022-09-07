import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class QlDinhMucPhiService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dinh-muc-phi', '/qlnv-kho');
  }

}
