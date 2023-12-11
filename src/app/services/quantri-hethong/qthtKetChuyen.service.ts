import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class QthtKetChuyenService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quan-tri-he-thong/ket-chuyen', '/qlnv-hang');
  }

}
