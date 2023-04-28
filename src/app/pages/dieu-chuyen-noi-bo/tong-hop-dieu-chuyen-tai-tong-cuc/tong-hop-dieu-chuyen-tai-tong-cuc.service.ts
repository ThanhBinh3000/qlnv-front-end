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
    GATEWAY = '/dieu-chuyen-noi-bo';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'tong-hop-ke-hoach-dieu-chuyen-tc', 'dieu-chuyen-noi-bo');
    }
    yeuCauXacDinhDiemNhap(id: number): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/yeu-cau`;
        return this._httpClient.post<OldResponseData>(url, id).toPromise()
    }
    lapKeHoach(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/lap-ke-hoach-tong-cuc`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    themTHTongCuc(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/them-moi-kh-tong-cuc`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    capNhatTHTongCuc(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cap-nhat-tong-cuc`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    guiYeuCauXacDinhDiemNhap(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/yeu-cau-xd`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    search(body) {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/tra-cuu-tong-cuc`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    getDetail(id): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/chi-tiet-kh-tong-cuc/${id}`;
        return this._httpClient.get<OldResponseData>(url).toPromise();
    }
}