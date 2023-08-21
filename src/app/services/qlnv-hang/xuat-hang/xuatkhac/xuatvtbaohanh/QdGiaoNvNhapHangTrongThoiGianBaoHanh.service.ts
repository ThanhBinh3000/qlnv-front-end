import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class QdGiaoNvNhapHangTrongThoiGianBaoHanhService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-khac/ktcl-vt-trong-bao-hanh/qd-giao-nv-nhap-hang', '');
  }

}
