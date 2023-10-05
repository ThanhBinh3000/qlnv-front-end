import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from "../../../base.service";

@Injectable({
  providedIn: 'root',
})
export class BangKeCanCtvtService extends BaseService {
  GATEWAY = '/qlnv-hang';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'cuu-tro/xuat-kho/bang-ke', '');
  }
}
