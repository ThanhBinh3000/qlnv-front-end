import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class TongHopDanhSachHangXkdmService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-khac/xuat-hang-khoi-dm/tong-hop', '');
  }
}
