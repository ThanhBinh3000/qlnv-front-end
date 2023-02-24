import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class QuanTriThamSoService extends BaseService{

  GATEWAY = '/qlnv-system';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'sys-param', '/qlnv-system');
  }
}
