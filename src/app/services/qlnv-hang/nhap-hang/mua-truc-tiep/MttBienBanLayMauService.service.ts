import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/services/base.service';
import { environment } from './../../../../../environments/environment.prod';

@Injectable({
    providedIn: 'root',
})
export class MttBienBanLayMauService extends BaseService {
    GATEWAY = '/qlnv-hang';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'mua-truc-tiep/bb-lm', '/qlnv-hang');
    }

}