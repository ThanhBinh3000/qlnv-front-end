import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class QthtChotGiaNhapXuatService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quan-tri-he-thong/chot-gia-nhap-xuat', '/qlnv-hang');
  }

}
