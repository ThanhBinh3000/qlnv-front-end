import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class DanhSachVttbXuatBatKhaKhangService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-khac/xuat-vt-trong-th-bat-kha-khang/danh-sach', '');
  }
}
