import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from 'src/app/services/base.service';

@Injectable({
    providedIn: 'root',
})
export class TongHopDieuChuyenService extends BaseService {
    GATEWAY = '/dieu-chuyen-noi-bo';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'tong-hop-ke-hoach-dieu-chuyen', 'dieu-chuyen-noi-bo');
    }

}