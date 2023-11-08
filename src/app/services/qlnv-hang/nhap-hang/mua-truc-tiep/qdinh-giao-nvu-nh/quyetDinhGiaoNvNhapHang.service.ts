import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BaseService } from '../../../../base.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class QuyetDinhGiaoNvNhapHangService extends BaseService {
    GATEWAY = '';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mua-truc-tiep/qd-nv-nh', '');
    }

    updateDdiemNhap(body: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cap-nhat-ddiem-nhap`;
        return this.httpClient.post<any>(url, body).toPromise();
    }

}
