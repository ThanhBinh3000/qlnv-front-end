import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class TheoDoiBqDtlService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'theo-doi-bao-quan-chi-tiet', '/qlnv-luukho');
  }

}
