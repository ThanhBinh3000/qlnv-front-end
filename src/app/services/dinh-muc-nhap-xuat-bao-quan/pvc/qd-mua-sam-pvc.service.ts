import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../base.service";

@Injectable({
  providedIn: 'root'
})
export class QdMuaSamPvcService extends BaseService {

  GATEWAY = '/qlnv-kho';
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'pvc-quyet-dinh-mua-sam','/qlnv-kho');
  }

}
