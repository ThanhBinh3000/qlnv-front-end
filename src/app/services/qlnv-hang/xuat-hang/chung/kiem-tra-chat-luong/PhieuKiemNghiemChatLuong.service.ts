import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from "src/app/services/base.service";

@Injectable({
  providedIn: 'root',
})
export class PhieuKiemNghiemChatLuongService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'kt-cl/phieu-kiem-nghiem-chat-luong', '');
  }
}
