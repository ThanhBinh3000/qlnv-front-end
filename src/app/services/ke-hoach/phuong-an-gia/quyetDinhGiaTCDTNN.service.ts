import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../base.service';


@Injectable({
  providedIn: 'root',
})
export class QuyetDinhGiaTCDTNNService extends BaseService {
  gateway: string = '/qlnv-category'
  table: string = 'phuong-an-gia/qd-gia-tcdtnn'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phuong-an-gia/qd-gia-tcdtnn', '/qlnv-khoach');
  }

}
