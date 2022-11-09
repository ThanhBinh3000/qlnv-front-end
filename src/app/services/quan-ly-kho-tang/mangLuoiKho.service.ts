import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MangLuoiKhoService extends BaseService {
    GATEWAY = '/qlnv-kho';
    // GATEWAY = '';
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mlk', '');
    }

    getDetailByMa(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/mlk/info-mlk`;
        return this._httpClient.post<any>(url, body).toPromise();
    }
}
