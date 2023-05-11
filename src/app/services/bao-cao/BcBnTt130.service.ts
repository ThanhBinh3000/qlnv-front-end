import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "../base.service";

@Injectable({
  providedIn: 'root',
})
export class BcBnTt130Service extends BaseService {
  GATEWAY = '';

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'bc-dtqg-bn/tt-130', '');
  }
}