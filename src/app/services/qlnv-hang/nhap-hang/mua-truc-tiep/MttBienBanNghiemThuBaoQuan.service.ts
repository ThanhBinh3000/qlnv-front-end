import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';


@Injectable({
    providedIn: 'root',
})
export class MttBienBanNghiemThuBaoQuan extends BaseService {
    GATEWAY = '/qlnv-hang';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mua-truc-tiep/bb-nt', '/qlnv-hang');
    }

}