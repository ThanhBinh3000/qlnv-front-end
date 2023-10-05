import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../../../services/base.service";

@Injectable({
    providedIn: 'root',
})
export class BangKeCanHangDieuChuyenService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient, 'dieu-chuyen-noi-bo/bang-ke-can-hang', '/qlnv-hang');
    }
}
