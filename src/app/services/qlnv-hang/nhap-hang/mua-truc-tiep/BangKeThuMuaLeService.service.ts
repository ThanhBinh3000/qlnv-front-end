import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';

@Injectable({
    providedIn: 'root',
})
export class BangKeThuMuaLeService extends BaseService {
    GATEWAY = '/qlnv-hang';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mua-truc-tiep/bk-ml', '/qlnv-hang');
    }

}