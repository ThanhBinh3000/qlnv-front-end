import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../base.service";
import { BaseLocalService } from "../../../base-local.service";

@Injectable({
  providedIn: 'root'
})
export class QuyetDinhXuatCapService extends BaseLocalService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'cuu-tro/xuat-cap/quyet-dinh', '');
  }
}
