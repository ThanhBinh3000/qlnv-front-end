import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CauHinhKetNoiKtnb extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'ket-noi-ktnb', '/qlnv-category');
  }

  capNhat(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/update`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  chiTiet(): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/detail`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }


}
