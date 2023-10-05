import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from "../../../base.service";
import { environment } from "../../../../../environments/environment";
import { OldResponseData } from "../../../../interfaces/response";

@Injectable({
    providedIn: 'root',
})
export class BienBanHaoDoiService extends BaseService {
    GATEWAY = '/qlnv-hang';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'cuu-tro/xuat-kho/bien-ban-hao-doi', '');
    }
}