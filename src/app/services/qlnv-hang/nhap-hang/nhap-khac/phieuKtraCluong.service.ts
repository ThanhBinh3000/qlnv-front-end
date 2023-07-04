import {BaseService} from "../../../base.service";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root',
})
export class PhieuKtraCluongService extends BaseService{
  GATEWAY = '/qlnv-hang';
  CONTROLLER = 'nhap-khac/phieu-kiem-tra-chat-luong';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'nhap-khac/phieu-kiem-tra-chat-luong', '/qlnv-hang');
  }
}
