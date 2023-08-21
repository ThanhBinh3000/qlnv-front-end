import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../../../base.service";

@Injectable({
  providedIn: 'root'
})
export class BienBanLayMauLuongThucHangDTQGService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'xuat-hang/xuat-khac/ktcl-lt-truoc-het-han/bb-lm', '');
  }
}
