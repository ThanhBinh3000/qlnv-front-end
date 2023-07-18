import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class QuyetDinhPheDuyetKeHoachMTTService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'mua-truc-tiep/qd-pd-mtt', '/qlnv-hang');
  }

  getDetailDtlCuc(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet-ke-hoach/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }
}
