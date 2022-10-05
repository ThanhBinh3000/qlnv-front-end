import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TongHopDeXuatKHMTTService extends BaseService {

  GATEWAY = '/qlnv-hang';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'mua-truc-tiep/thop-kh-mtt', '/qlnv-hang');
  }

  loadChiTiet(id: number): Promise<any> {
    const url_ = `${environment.SERVICE_API}${this.GATEWAY}/mua-truc-tiep/thop-kh-mtt/chi-tiet/${id}`;
    return this.httpClient.get<any>(url_).toPromise();
  }

  tonghop(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/mua-truc-tiep/thop-kh-mtt`
    return this.httpClient.post(url, body).toPromise();
  }

}
