import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MangLuoiKhoService extends BaseService {
    GATEWAY = '/qlnv-kho';
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mlk', '/qlnv-kho');
    }

    getDetailByMa(body) {
        const url = `${environment.LOCAL}/mlk/info-mlk`;
        return this._httpClient.post<any>(url, body).toPromise();
    }
}
