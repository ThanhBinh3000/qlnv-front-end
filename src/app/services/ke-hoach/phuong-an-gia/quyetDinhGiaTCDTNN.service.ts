import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../base.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class QuyetDinhGiaTCDTNNService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'phuong-an-gia/qd-gia-tcdtnn', '/qlnv-khoach');
  }

  getPag(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/thong-tin-gia`;
    return this.httpClient.post(url, body).toPromise();
  }

}
