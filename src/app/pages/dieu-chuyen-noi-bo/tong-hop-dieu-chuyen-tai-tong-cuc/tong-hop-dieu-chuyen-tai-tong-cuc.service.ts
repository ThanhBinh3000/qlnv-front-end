import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from 'src/app/services/base.service';
import { OldResponseData } from 'src/app/interfaces/response';

@Injectable({
    providedIn: 'root',
})
export class TongHopDieuChuyenCapTongCucService extends BaseService {
    GATEWAY = '/qlnv-hang';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'dieu-chuyen-noi-bo/tong-hop-ke-hoach-dieu-chuyen-tc', 'qlnv-hang');
    }
    lapKeHoach(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/lap-ke-hoach`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    themTHTongCuc(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/them-moi`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    capNhatTHTongCuc(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cap-nhat`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    search(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    getDetail(id): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet/${id}`;
        return this._httpClient.get<OldResponseData>(url).toPromise();
    }
    previewTh(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/xem-truoc-tong-hop`;
        return this._httpClient.post(url, body, { responseType: 'blob' }).toPromise();
    }
}