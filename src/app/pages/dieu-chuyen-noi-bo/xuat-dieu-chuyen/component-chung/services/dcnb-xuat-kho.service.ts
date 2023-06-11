import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../../services/base.service";

@Injectable({
    providedIn: 'root',
})
export class PhieuXuatKhoDieuChuyenService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'dieu-chuyen-noi-bo/phieu-xuat-kho', '/qlnv-hang');
    }
}
