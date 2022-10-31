import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../base.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class QuyetDinhGiaTCDTNNService extends BaseService {
  // gateway: string = '/qlnv-category'
  // table: string = 'phuong-an-gia/qd-gia-tcdtnn'
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phuong-an-gia/qd-gia-tcdtnn', '/qlnv-khoach');
  }

  loadToTrinhTongHop(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/list-to-trinh`;
    return this.httpClient.post(url, body).toPromise();
  }

  loadToTrinhDeXuatThongTinGia(id: number) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/${id}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  loadToTrinhTongHopThongTinGia(id: number) {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/phuong-an-gia/tong-hop/chi-tiet/${id}`;
    return this.httpClient.get<any>(url).toPromise();
  }

  dsSoQd(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/list-qd-tcdtnn`;
    return this.httpClient.post(url, body).toPromise();
  }

  getPag(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/thong-tin-gia`;
    return this.httpClient.post(url, body).toPromise();
  }

}
