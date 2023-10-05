import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';

@Injectable({
  providedIn: 'root'
})
export class QuyetToanVonPhiService extends BaseService {
  gateway: string = '/qlnv-khoach'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'von-phi-hang/von-phi-bo-nganh', '/qlnv-khoach')

  }

}
