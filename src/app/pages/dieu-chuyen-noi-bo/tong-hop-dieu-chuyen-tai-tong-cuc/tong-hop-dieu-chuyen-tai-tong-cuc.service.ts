import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from 'src/app/services/base.service';
import { OldResponseData } from 'src/app/interfaces/response';

@Injectable({
    providedIn: 'root',
})
export class TongHopDieuChuyenService extends BaseService {
    GATEWAY = '/dieu-chuyen-noi-bo';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'tong-hop-ke-hoach-dieu-chuyen', 'dieu-chuyen-noi-bo');
    }
    tongHop(body: any): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/lap-ke-hoach`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    yeuCauXacDinhDiemNhap(id: number): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/yeu-cau`;
        return this._httpClient.post<OldResponseData>(url, id).toPromise()
    }
}