import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QlDinhMucPhiService extends BaseService {

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'dinh-muc-phi', '/qlnv-kho');
  }

}
