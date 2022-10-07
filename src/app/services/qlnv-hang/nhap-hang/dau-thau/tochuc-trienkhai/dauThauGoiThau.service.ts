import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class dauThauGoiThauService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dx-kh/ttin-dthau-gthau', '/qlnv-hang');
  }

  chiTietByGoiThauId(id: number): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/ttin-dthau-gthau/chi-tiet/goi-thau/${id}`
    return this.httpClient.get<any>(url).toPromise();
  }

  updateStatus(body: any): Promise<any> {
    let url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/ttin-dthau-gthau/phe-duyet`
    return this.httpClient.post<any>(url, body).toPromise();
  }

  exportList(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/dx-kh/ttin-dthau-gthau/ket-xuat`;
    return this.httpClient.post(url, body, { responseType: 'blob' });
  }
}
