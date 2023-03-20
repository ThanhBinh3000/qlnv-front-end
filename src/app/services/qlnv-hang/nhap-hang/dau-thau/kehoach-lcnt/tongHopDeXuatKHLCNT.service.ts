import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';

@Injectable({
  providedIn: 'root',
})
export class TongHopDeXuatKHLCNTService extends BaseService {
  GATEWAY = '/qlnv-hang';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/thop-dlieu', '/qlnv-hang');
  }

  deXuatCuc(body: any): Promise<any> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/thop-dlieu/dx-cuc`
    return this.httpClient.post(url, body).toPromise();
  }

}
