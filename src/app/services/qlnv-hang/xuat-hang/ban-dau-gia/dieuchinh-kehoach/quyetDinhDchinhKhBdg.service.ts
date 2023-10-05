import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { PATH } from 'src/app/constants/path';

@Injectable({
    providedIn: 'root',
})
export class QuyetDinhDchinhKhBdgService extends BaseService {

    constructor(public httpClient: HttpClient) {
        super(httpClient, PATH.XUAT_HANG_DTQG + "/" + PATH.DAU_GIA + "/" + PATH.QD_DC, PATH.QLNV_HANG);
    }

}
