import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../../services/base.service";

@Injectable({
    providedIn: 'root',
})
export class BangKeNhapKhacNhapVatTuService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'nhap-khac/bang-ke-nhap-vt', '/qlnv-hang');
    }
}
