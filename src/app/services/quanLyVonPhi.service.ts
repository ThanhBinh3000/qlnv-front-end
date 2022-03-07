import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';


@Injectable({
  providedIn: 'root',
})
export class QuanLyVonPhiService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quanLyVonPhi');
  }

  urlDefault = environment.SERVICE_API;

  //search list bao cao
  timBaoCao(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-khoachphi/lap-tham-dinh-du-toan/danh-sach",
      request,
    );
  }

  // call api nút chức năng
  approve(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/chuc-nang',
      request
    );
  }

  // call api chi tiết báo cáo
  bCChiTiet(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/chi-tiet/' + id
    );
  }

  // upload file to server
  uploadFile(request: FormData): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-core/file/upload',
      request,
    );
  }

  //sinh ma bao cao
  sinhMaBaoCao(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + "/qlnv-khoachphi/lap-tham-dinh-du-toan/sinh-ma-bcao",
    );
  }

  // trinh duyet
  trinhDuyetService(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-khoachphi/lap-tham-dinh-du-toan/them-moi",
      request,
    )
  }

  // upload list
  updatelist(request:any):Observable<any>{
    return this.httpClient.put(this.urlDefault+'/qlnv-khoachphi/lap-tham-dinh-du-toancap-nhat',request)
  }
}
