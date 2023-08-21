import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';

@Injectable({
    providedIn: 'root',
})
export class MttPhieuKiemNghiemChatLuongService extends BaseService {
    GATEWAY = '/qlnv-hang';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mua-truc-tiep/pkn_cl', '/qlnv-hang');
    }

}
