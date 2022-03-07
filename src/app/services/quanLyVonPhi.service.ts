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
    return this.httpClient.put(this.urlDefault+'/qlnv-khoachphi/lap-tham-dinh-du-toan/cap-nhat',request)
  }

  //get list don vi tao
  dMDonVi(): Observable<any>{
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-donvi/danh-sach/tat-ca",
    );
  }

  //get list danh muc loai bao cao
  dMLoaiBaoCao(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/7",
        {  "paggingReq": {
                "limit": 1000,
                "page": 1
            },
            "str": "",
            "trangThai": ""
        }
    );
  }

  //tong hop
  tongHop(request:any): Observable<any> {
    return this.httpClient.post(
        this.urlDefault + "/qlnv-khoachphi/lap-tham-dinh-du-toan/tong-hop",
        request
    );
  }

  //danh muc ke hoach von
  dMMaHthucVban(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/258",
        {
            "paggingReq": {
                "limit": 1000,
                "page": 1
            },
            "str": "",
            "trangThai": "",
        }
    );
  }

  //danh muc ke hoach von
  mDMaDviChuTri(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/85",
        {
            "paggingReq": {
                "limit": 1000,
                "page": 1
            },
            "str": "",
            "trangThai": "",
        }
    );
  }

}
