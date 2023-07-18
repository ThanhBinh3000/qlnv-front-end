import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../../services/base.service";

@Injectable({
    providedIn: 'root',
})
export class BienBanKetThucNhapKhacNhapKhoVatTuService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, '/nhap-khac/bien-ban-ket-thuc-nhap-kho-vt', '/qlnv-hang');
    }
}
