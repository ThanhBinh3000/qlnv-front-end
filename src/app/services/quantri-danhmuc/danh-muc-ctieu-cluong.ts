import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class DanhMucCtieuCluongService extends BaseService{

  gateway: string = '/qlnv-category'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dmuc-ctieu-cluong', '/qlnv-category');
  }
}
