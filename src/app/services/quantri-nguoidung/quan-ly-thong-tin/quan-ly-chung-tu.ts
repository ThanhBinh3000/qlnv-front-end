import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QLChungTuService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'info-manage', '/qlnv-category');
  }

  danhSach(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/search-certificate`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  themMoi(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/create-certificate`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  capNhat(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/update-certificate`;
    return this._httpClient.put<OldResponseData>(url, body).toPromise();
  }

  delete(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/delete-certificate/${id}`;
    return this._httpClient.delete<OldResponseData>(url).toPromise();
  }

  deleteMuti(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/delete-certificates`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  export(body: any): Observable<Blob> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/export-certificate`;
    return this._httpClient.post(url, body, { responseType: 'blob' });
  }
}
