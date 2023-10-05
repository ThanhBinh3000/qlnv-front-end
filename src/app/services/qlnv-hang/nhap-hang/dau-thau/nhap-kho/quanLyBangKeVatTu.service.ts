import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuanLyBangKeVatTuService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bang-ke-vt', '/qlnv-hang');
  }

}