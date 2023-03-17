import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../base.service";

@Injectable({
  providedIn: 'root'
})
export class HopDongPvcService extends BaseService{

  GATEWAY = '/qlnv-kho';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'hop-dong-pvc-ccdc', '/qlnv-kho');
  }
}
