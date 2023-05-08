import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';


@Injectable({
  providedIn: 'root',
})
export class QuyetToanVonPhiService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quanLyVonPhi', '');
  }
  urlTest = 'http://localhost:9159';
  urlDefault = environment.SERVICE_API + '/qlnv-khoachphi';

  timBaoCaoQuyetToanVonPhi(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/quyet-toan/danh-sach',
      // 'http://192.168.1.111:8094/lap-tham-dinh/danh-sach',
      request,
    );
  }
  //search list bao cao
  timBaoCaoQuyetToanVonPhi1(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/quyet-toan/danh-sach',
      // 'http://192.168.1.228:30101/quyet-toan/danh-sach',
      request,
    );
  }

  // call api chi tiết báo cáo quyết toán vốn, phí hàng DTQG
  CtietBcaoQuyetToan(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/quyet-toan/chi-tiet/' + id,
      // 'http://192.168.1.105:8094/quyet-toan/chi-tiet/' + id ,
    );
  }

  // call api chi tiết báo cáo quyết toán vốn, phí hàng DTQG theo năm
  CtietBcaoQuyetToanNam(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/quyet-toan/tra-cuu',
      // 'http://192.168.1.105:8094/quyet-toan/tra-cuu' ,
      request,
    );
  }
  // call api chi tiết báo cáo quyết toán vốn, phí hàng DTQG theo năm
  CtietBcaoQuyetToanNam1(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/quyet-toan/tra-cuu',
      // 'http://192.168.1.100:30101/quyet-toan/tra-cuu',
      request,
    );
  }

  // call api chi tiết báo cáo quyết toán vốn, phí hàng DTQG
  CtietBcaoQuyetToan1(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/quyet-toan/chi-tiet/' + id,
      // 'http://192.168.1.228:30101/quyet-toan/chi-tiet/' + id,
    );
  }

  //sinh ma bao cao quyet toan
  sinhMaBaoCaoQuyetToan(maPhanBcao: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/quyet-toan/sinh-ma?maPhanBcao=' + maPhanBcao,
    );
  }

  sinhMaBaoCaoQuyetToan1(maPhanBcao: any): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/quyet-toan/sinh-ma?maPhanBcao=' + maPhanBcao,
      'http://192.168.1.105:8094/quyet-toan/sinh-ma?maPhanBcao=' + maPhanBcao,
    );
  }



  // Trình duyệt quyết toán vốn, phí hàng DTQG
  trinhDuyetServiceQuyetToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/quyet-toan/them-moi',
      request,
    );
  }

  // Trình duyệt quyết toán vốn, phí hàng DTQG 1
  trinhDuyetServiceQuyetToan1(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/quyet-toan/them-moi',
      // 'http://192.168.1.228:30101/quyet-toan/them-moi',
      request,
    );
  }

  // update báo cáo quyết toán vốn, phí hàng DTQG
  updateBaoCaoQuyetToan(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/quyet-toan/cap-nhat',
      // 'http://192.168.1.111:8094/lap-tham-dinh/cap-nhat',
      request,
    );
  }

  // update báo cáo quyết toán vốn, phí hàng DTQG
  updateBaoCaoQuyetToan1(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/quyet-toan/cap-nhat',
      // 'http://192.168.1.228:30101/quyet-toan/cap-nhat',
      request,
    );
  }
  // call api nút chức năng
  approveQuyetToan(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/quyet-toan/trang-thai',
      request,
    );
  }

  // call api nút chức năng
  approveQuyetToan1(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/quyet-toan/trang-thai',
      // 'http://192.168.1.228:30101/quyet-toan/trang-thai',
      request,
    );
  }

  //xóa báo cáo nút xóa Báo cáo quyết toán
  xoaBaoCaoLapQuyetToan(request: any): Observable<any> {
    return this.httpClient.post(
      // 'http://192.168.1.105:8094/quyet-toan/xoa/',
      this.urlDefault + '/quyet-toan/xoa',
      request
    );
  }
  //xóa báo cáo nút xóa Báo cáo quyết toán
  xoaBaoCaoLapQuyetToan1(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/nhap-ghi-nhan-von/xoa',
      // 'http://192.168.1.105:8094/quyet-toan/xoa',
      request
    );
  }

  checkNamTaoMoiQuyetToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/quyet-toan/validate',
      request
    );
  }

  tongHop(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/quyet-toan/tong-hop',
      // 'http://192.168.1.228:30101/quyet-toan/tong-hop',
      request
    );
  }

  tongHop1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/quyet-toan/tong-hop',
      'http://localhost:9159/quyet-toan/tong-hop',
      request
    );
  }

  getHangHoaKho(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/kho/tra-cuu',
      // 'http://192.168.1.228:30101/kho/tra-cuu',
      request
    );
  }

}

