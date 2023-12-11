import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import {environment} from "../../../../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class MttPhieuKiemTraChatLuongService extends BaseService {
    GATEWAY = '/qlnv-hang';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mua-truc-tiep/pkt-cl', '/qlnv-hang');
    }
    getSoLuongNhap(body: any) {
        let url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/so-luong-nhap-kho`
        return this.httpClient.post<any>(url, body).toPromise();
    }

}
