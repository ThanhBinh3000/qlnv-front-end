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
    GATEWAY = '/qlnv-hang';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'dieu-chuyen-noi-bo/tong-hop-ke-hoach-dieu-chuyen', 'qlnv-hang');
    }
    lapKeHoach(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/lap-ke-hoach`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    themTHCuc(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/them-moi-kh-cuc`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    capNhatTHCuc(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/cap-nhat-cuc`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
    guiYeuCauXacDinhDiemNhap(body): Promise<OldResponseData> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.table}/yeu-cau-xd`;
        return this._httpClient.post<OldResponseData>(url, body).toPromise();
    }
}