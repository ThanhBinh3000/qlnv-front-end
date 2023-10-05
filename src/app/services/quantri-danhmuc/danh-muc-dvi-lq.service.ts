import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class DanhMucDviLqService extends BaseService{

  gateway: string = '/qlnv-category'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dmuc-dvi-lquan', '/qlnv-category');
  }
}
