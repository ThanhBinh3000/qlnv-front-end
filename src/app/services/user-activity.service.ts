import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserActivityService extends BaseService {

  gateway: string = '/qlnv-system'

  constructor(public httpClient: HttpClient) {
    super(httpClient, 'lich-su-truy-cap', '/qlnv-system');
  }

}
