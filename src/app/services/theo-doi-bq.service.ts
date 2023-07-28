import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "./base.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {OldResponseData} from "../interfaces/response";
import {BaseServiceLocal} from "./baseLocal.service";

@Injectable({
  providedIn: 'root'
})
export class TheoDoiBqService extends BaseServiceLocal {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'theo-doi-bao-quan', '/qlnv-luukho');
  }

}
