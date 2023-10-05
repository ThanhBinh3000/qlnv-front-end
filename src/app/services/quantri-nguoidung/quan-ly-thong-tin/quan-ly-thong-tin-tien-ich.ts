import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QLThongTinTienIchService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'info-manage', '/qlnv-category');
  }

  danhSach(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/search-info-utility-software`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  themMoi(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/create-info-utility-software`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  capNhat(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/update-info-utility-software`;
    return this._httpClient.put<OldResponseData>(url, body).toPromise();
  }

  deleteMuti(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/delete-info-utility-software`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  export(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/export-info-utility-software`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }
}
