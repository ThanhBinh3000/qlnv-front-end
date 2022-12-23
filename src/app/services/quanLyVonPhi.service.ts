import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';


@Injectable({
  providedIn: 'root',
})
export class QuanLyVonPhiService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quanLyVonPhi', '');
  }

  urlDefault = environment.SERVICE_API;

  //lay danh muc don vi con theo ma don vi vho trc
  dmDviCon(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-donvi/tat-ca',
      request,
    )
  }

  dmKho(maDvi: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-category/dmuc-donvi/danh-sach/dm-kho/MLK/' + maDvi
    )
  }

  // upload file to server
  uploadFile(request: FormData): Observable<any> {
    let options = { headers: new HttpHeaders().set('Content-Type', 'multipart/form-data') };
    const headerss = new HttpHeaders().set('Content-Type', 'multipart/form-data').set('Access-Control-Allow-Origin', '*');
    let headers: {
      'Content-Type': 'multipart/form-data'
    }
    return this.httpClient.post(
      this.urlDefault + '/qlnv-core/file/upload-attachment',
      // 'https://192.168.1.109:8091/file/upload',
      request,
      { 'headers': headerss }
    );
  }

  //tao ma PA
  dsachHopDong(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/hop-dong/danh-sach',
      // 'http://192.168.1.104:8094/hop-dong/danh-sach',
      request,
    );
  }

  //list danh sach phuong an da duoc duyet
  danhsachphuonganduocduyet(maDvi: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/danh-sach-phuong-an/', maDvi);
    // return this.httpClient.post('http://192.168.1.103:8094/pa-giao-so-kt/danh-sach-phuong-an',maDvi);
  }


  //xoa quyet dinh cong van
  xoaquyetdinhcongvan(request: any): Observable<any> {
    return this.httpClient.delete(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/xoa-qd-cv/' + request);
  }

  //dm đơn vị tính
  dmDonvitinh(): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-category/dmuc-dvi-tinh/danh-sach',
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": "",
      })
  }

  //search list danh sach cong van de nghi cap von
  timDsachCvanDnghi(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/cap-nguon-von-chi/search-dncv',
      request,
    );
  }

  //search list danh sach de nghi cap von
  timDsachDnghi(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/quyet-dinh-giao-du-toan-chi/danh-sach',
      request,
    );
  }

  // call api chi tiết báo cáo
  sinhMaVban(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault +
      '/qlnv-khoachphi/lap-tham-dinh-du-toan/sinh-ma-vban'
    );
  }

  //download file tu he thong chung
  downloadFile(fileUrl: any): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-core/file/' + fileUrl, { responseType: 'blob' });
  }

  // tim kiem danh sach bao cao de duyet cho cuc khu vuc (3.2.9)
  timKiemDuyetBaoCao(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/bao-cao/tim-kiem-thong-tin-phe-duyet', request);
  }

  //get user theo dvql
  getListUserByManage(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-system/user/findList', request);
  }

  getListUser(): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/chung/can-bo');
  }

  getListUser1(): Observable<any> {
    return this.httpClient.get('http://192.168.1.109:30101/chung/can-bo');
  }

  getDinhMucNhapXuat(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/chung/dinh-muc/muc-chi-dvi', request);
  }

  getDinhMucNhapXuat1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.105:8094/chung/dinh-muc/muc-chi-dvi',
      request,
    );
  }

  getDinhMucBaoQuan(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-category/dmuc-dmuc-phi/danh-sach', request);
  }

  getDinhMuc(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/chung/dinh-muc',
      request,
    )
  }

  //lay thong tin luy ke
  getLuyKe(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/bao-cao/get-luy-ke'
      , request
    );
  }

  getDmucDviTrucThuocTCDT(): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-category/dmuc-donvi/chi-tiet/1');
  }

}
