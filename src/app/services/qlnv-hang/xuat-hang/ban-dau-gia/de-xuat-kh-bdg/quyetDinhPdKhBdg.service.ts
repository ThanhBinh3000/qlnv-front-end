import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';

@Injectable({
    providedIn: 'root',
})
export class QuyetDinhPdKhBdgService extends BaseService {
    GATEWAY = '/qlnv-hang';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'ban-dau-gia/qd-pd-bdg', '');
    }

}
