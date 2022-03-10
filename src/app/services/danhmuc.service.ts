import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class DanhMucService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'DanhMuc');
  }

  loadDanhMucHangHoa() {
    const url = `${environment.SERVICE_API}/qlnv-gateway/qlnv-category/dm-hang/danh-sach`;
    return this.httpClient.post<any>(url, null);
  }
}
