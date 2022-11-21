import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';


@Injectable({
  providedIn: 'root',
})
export class GiaoDuToanChiService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'quanLyVonPhi', '');
  }

  urlDefault = environment.SERVICE_API;


  //search list bao cao giao du toan chi
  timBaoCaoGiao(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/danh-sach',
      request,
    );
  };

  //search list bao cao giao du toan chi
  timBaoCaoGiao1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/giao_du_toan/danh-sach',
      'http://192.168.1.101:30101/giao_du_toan/danh-sach',
      request,
    );
  };


  // call api chi tiết báo cáo giao dự toán chi nsnn
  QDGiaoChiTiet(id: any, maLoai: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/chi-tiet/' + id + '?maLoai=' + maLoai,
    );
  };

  // call api chi tiết báo cáo giao dự toán chi nsnn
  QDGiaoChiTiet1(id: any, maLoai: string): Observable<any> {
    return this.httpClient.get(
      'http://192.168.1.108:30101/giao_du_toan/chi-tiet/' + id + '?maLoai=' + maLoai,
    );
  };


  // trinh duyet giao du toan chi nsnn
  giaoDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/them-moi',
      request,
    );
  };

  // trinh duyet giao du toan chi nsnn
  giaoDuToan1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.108:30101/giao_du_toan/them-moi',
      request,
    );
  };

  // update list giao du toan
  updateLapThamDinhGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/cap-nhat',
      request,
    );
  };
  // update list giao du toan
  updateLapThamDinhGiaoDuToan1(request: any): Observable<any> {
    return this.httpClient.put(
      'http://192.168.1.101:8094/giao_du_toan/cap-nhat',
      request,
    );
  };

  //tong hop giao du toan
  tongHopGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/tong-hop',
      request,
    );
  };
  //tong hop giao du toan
  tongHopGiaoDuToan1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.103:30101/giao_du_toan/tong-hop',
      request,
    );
  };

  //tao ma PA giao du toan chi NSNN
  maPhuongAnGiao(maLoai: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/sinh-ma?maLoai=' + maLoai
    );
  };
  //tao ma PA giao du toan chi NSNN
  maPhuongAnGiao1(maLoai: string): Observable<any> {
    return this.httpClient.get(
      'http://192.168.1.101:8094/giao_du_toan/sinh-ma?maLoai=' + maLoai
    );
  };

  //tao ma giao( giao du toan chi NSNN)
  maGiaoGiaoDuToanChi(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/sinh-ma-giao-so'
    );
  };

  //tao ma giao( giao du toan chi NSNN)
  maGiaoGiaoDuToanChi1(): Observable<any> {
    return this.httpClient.get(
      'http://192.168.1.105:8094/giao_du_toan/sinh-ma-giao-so'
    );
  };

  // tim kiem danh sach ma phuong an giao dieu chinh du toan NSNN
  timKiemMaPaGiaoNSNN(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/danh-sach/phuong-an-duyet'
      // 'http://192.168.1.103:8094/giao_du_toan/danh-sach/phuong-an-duyet'
    );
  };
  // tim kiem danh sach ma phuong an giao dieu chinh du toan NSNN
  timKiemMaPaGiaoNSNN1(): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/giao_du_toan/danh-sach/phuong-an-duyet'
      'http://192.168.1.105:8094/giao_du_toan/danh-sach/phuong-an-duyet'
    );
  };

  //giao so tran chi trong Giao du toan NSNN
  giaoSoTranChiGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/giao-so'
      , request);
  };
  //giao so tran chi trong Giao du toan NSNN
  giaoSoTranChiGiaoDuToan1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.101:30101/giao_du_toan/giao-so'
      , request);
  };

  //nhap so QD giao du toan chi NSNN
  themMoiQdCvGiaoNSNN(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/them-moi/qd-cv'
      , request);
  };
  //nhap so QD giao du toan chi NSNN
  themMoiQdCvGiaoNSNN1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.105:8094/giao_du_toan/them-moi/qd-cv'
      , request);
  };

  //tim kiem giao danh sách nội dung khoản mục
  xoaBanGhiGiaoBTC(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/xoa',
      request
    )
  };
  //tim kiem giao danh sách nội dung khoản mục
  xoaBanGhiGiaoBTC1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.101:8094/giao_du_toan/xoa',
      request
    )
  };

  // trinh duyet phuong an giao phan bo du toan NSNN
  trinhDuyetPhuongAnGiao(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/trang-thai',
      request);
  };
  // trinh duyet phuong an giao phan bo du toan NSNN
  trinhDuyetPhuongAnGiao1(request: any): Observable<any> {
    return this.httpClient.put(
      'http://192.168.1.101:30101/giao_du_toan/trang-thai',
      request);
  };
}
