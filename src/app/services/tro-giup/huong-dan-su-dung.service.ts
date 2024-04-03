import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HuongDanSuDungService extends BaseService {

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'info-manage/search-info-utility-software', '/qlnv-category');
    }
    getDanhSachHuongDan(body): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}`;
        return this._httpClient.post<any>(url, body).toPromise();
    }
}
