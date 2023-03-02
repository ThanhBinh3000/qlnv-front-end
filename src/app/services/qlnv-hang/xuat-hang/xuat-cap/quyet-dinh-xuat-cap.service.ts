import { BaseLocalService } from "../../../base-local.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class QuyetDinhXuatCapService extends BaseLocalService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'cuu-tro/xuat-cap/quyet-dinh', '');
  }
}
