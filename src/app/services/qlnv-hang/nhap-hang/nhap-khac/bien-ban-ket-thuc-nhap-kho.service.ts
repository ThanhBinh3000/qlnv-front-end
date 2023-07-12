import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OldResponseData } from "../../../../interfaces/response";
import { environment } from "../../../../../environments/environment";
import { BaseService } from "../../../base.service";

@Injectable({
    providedIn: 'root',
})
export class BienBanKetThucNhapKhoService extends BaseService {
    GATEWAY = '/qlnv-hang';
    CONTROLLER = 'nhap-khac/bien-ban-ket-thuc-nhap-kho';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'nhap-khac/bien-ban-ket-thuc-nhap-kho', '/qlnv-hang');
    }
}
