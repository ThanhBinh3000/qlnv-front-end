import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../base.service';

@Injectable({
  providedIn: 'root'
})
export class DeXuatPAGService extends BaseService {
  gateway: string = '/qlnv-khoach'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phuong-an-gia/dx-pag', '/qlnv-khoach')

  }

}
