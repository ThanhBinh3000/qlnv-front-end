import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {environment} from "../../environments/environment";
import {OldResponseData} from "../interfaces/response";

@Injectable({
  providedIn: 'root'
})
export class DanhMucDinhMucHaoHutService extends BaseService{

  gateway: string = '/qlnv-category'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dmuc-dinh-muc-hao-hut', '/qlnv-category');
  }
}
