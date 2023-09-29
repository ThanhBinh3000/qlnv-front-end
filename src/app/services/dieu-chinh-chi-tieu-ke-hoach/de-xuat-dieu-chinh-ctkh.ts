import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../base.service";
import { OldResponseData } from 'src/app/interfaces/response';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeXuatDieuChinhCTKHService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'qlnv-khoach', '');
  }

  traCuu(params): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/de-xuat-dieu-chinh-ke-hoach-nam`;
    return this._httpClient.get<OldResponseData>(url, { params }).toPromise();
  }

  themMoi(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/de-xuat-dieu-chinh-ke-hoach-nam`;
    return this._httpClient.post<OldResponseData>(url, body).toPromise();
  }

  capNhat(body): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/de-xuat-dieu-chinh-ke-hoach-nam`;
    return this._httpClient.put<OldResponseData>(url, body).toPromise();
  }

  chiTiet(id): Promise<OldResponseData> {
    const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/de-xuat-dieu-chinh-ke-hoach-nam/${id}`;
    return this._httpClient.get<OldResponseData>(url).toPromise();
  }

}
