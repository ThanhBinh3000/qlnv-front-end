import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";

@Injectable({
  providedIn: 'root'
})
export class QuanTriThamSoService extends BaseService{

  GATEWAY = '/sys-param';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quan-tri-tham-so', '/sys-param');
  }
}
