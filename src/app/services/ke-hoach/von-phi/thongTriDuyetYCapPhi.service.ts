import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from '../../base.service';

@Injectable({
    providedIn: 'root',
})
export class ThongTriDuyetYCapPhiService extends BaseService {
    GATEWAY = '/qlnv-khoach';
    router = 'phi-thong-tri-duyet-y-du-toan';

    constructor(public httpClient: HttpClient) {
        super(httpClient, 'phi-thong-tri-duyet-y-du-toan', '');
    }

    timKiem(body: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}/search`;
        return this.httpClient.post(url, body).toPromise();
    }

    loadChiTiet(id: number): Promise<any> {
        const url_ = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}/${id}`;
        return this.httpClient.get<any>(url_).toPromise();
    }

    them(body: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}`;
        return this.httpClient.post(url, body).toPromise();
    }

    sua(body: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}`;
        return this.httpClient.put(url, body).toPromise();
    }

    deleteData(id: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}/${id}`;
        return this.httpClient.delete(url).toPromise();
    }

    deleteMultiple(body: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}/delete/multiple`;
        return this.httpClient.post(url, body).toPromise();
    }

    updateStatus(body: any): Promise<any> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}/status`;
        return this.httpClient.put(url, body).toPromise();
    }

    exportList(body: any): Observable<Blob> {
        const url = `${environment.SERVICE_API}${this.GATEWAY}/${this.router}/export/list`;
        return this.httpClient.post(url, body, { responseType: 'blob' });
    }
}
