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

  timBaoCaoQuyetToanVonPhi(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/danh-sach',
      // 'http://192.168.1.111:8094/lap-tham-dinh/danh-sach',
      request,
    );
  }
  //search list bao cao
  timBaoCaoQuyetToanVonPhi1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/danh-sach',
      'http://192.168.1.105:8094/quyet-toan/danh-sach',
      request,
    );
  }

  //search list bao cao giao du toan chi
  timBaoCaoGiao(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/danh-sach',
      request,
    );
  }

  //search list bao cao giao du toan chi
  timBaoCaoGiao1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/giao_du_toan/danh-sach',
      'http://192.168.1.101:30101/giao_du_toan/danh-sach',
      request,
    );
  }

  //search list phan bo du toan giao chi nsnn
  timDanhSachPhanBo(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/qd-giao-phan-bo-dtoan/danh-sach-phan-bo',
      // 'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach-phan-bo',
      request,
    );
  }

  // call api nút chức năng giao dự toán chi NSNN
  approveGiao(request: any): Observable<any> {
    return this.httpClient.put(
      // 'http://192.168.1.110:8094/lap-tham-dinh-du-toan/chuc-nang',
      // 'http://192.168.1.125:8094/lap-tham-dinh-du-toan/chuc-nang',
      // this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/chuc-nang',
      "http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/chuc-nang",
      request,
    );
  }

  bCDieuChinhDuToanChiTiet(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/chi-tiet/' + id,
      // 'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/chi-tiet/' + id,
    );
  }

  bCDieuChinhDuToanChiTiet1(id: any): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/chi-tiet/' + id,
      'http://192.168.1.103:30101/dieu-chinh-du-toan-chi/chi-tiet/' + id,
    );
  }


  // call api chi tiết báo cáo giao dự toán chi nsnn
  QDGiaoChiTiet(id: any, maLoai: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/chi-tiet/' + id + '?maLoai=' + maLoai,
    );
  }

  // call api chi tiết báo cáo giao dự toán chi nsnn
  QDGiaoChiTiet1(id: any, maLoai: string): Observable<any> {
    return this.httpClient.get(
      'http://192.168.1.108:30101/giao_du_toan/chi-tiet/' + id + '?maLoai=' + maLoai,
    );
  }

  // call api chi tiết báo cáo quyết toán vốn, phí hàng DTQG
  CtietBcaoQuyetToan(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/chi-tiet/' + id,
      // 'http://192.168.1.105:8094/quyet-toan/chi-tiet/' + id ,
    );
  }

  // call api chi tiết báo cáo quyết toán vốn, phí hàng DTQG theo năm
  CtietBcaoQuyetToanNam(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/tra-cuu',
      // 'http://192.168.1.105:8094/quyet-toan/tra-cuu' ,
      request,
    );
  }
  // call api chi tiết báo cáo quyết toán vốn, phí hàng DTQG theo năm
  CtietBcaoQuyetToanNam1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/quyet-toan/tra-cuu',
      'http://192.168.1.100:30101/quyet-toan/tra-cuu',
      request,
    );
  }

  // call api chi tiết báo cáo quyết toán vốn, phí hàng DTQG
  CtietBcaoQuyetToan1(id: any): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/quyet-toan/chi-tiet/' + id ,
      'http://192.168.1.105:8094/quyet-toan/chi-tiet/' + id,
    );
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

  //sinh ma bao cao quyet toan
  sinhMaBaoCaoQuyetToan(maPhanBcao: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/sinh-ma?maPhanBcao=' + maPhanBcao,
    );
  }

  sinhMaBaoCaoQuyetToan1(maPhanBcao: any): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/quyet-toan/sinh-ma?maPhanBcao=' + maPhanBcao,
      'http://192.168.1.105:8094/quyet-toan/sinh-ma?maPhanBcao=' + maPhanBcao,
    );
  }

  //sinh ma bao cao dieu chinh du toan
  sinhMaBaoCaoDieuChinh(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/sinh-ma',
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/sinh-ma',
    );
  }

  // Trình duyệt quyết toán vốn, phí hàng DTQG
  trinhDuyetServiceQuyetToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/them-moi',
      request,
    );
  }

  // Trình duyệt quyết toán vốn, phí hàng DTQG 1
  trinhDuyetServiceQuyetToan1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/quyet-toan/them-moi',
      'http://192.168.1.101:30101/quyet-toan/them-moi',
      request,
    );
  }

  // trinh duyet dieu chinh du toan NSNN
  trinhDuyetDieuChinhService(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/them-moi',
      // 'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/them-moi',
      request,
    );
  }
  // trinh duyet dieu chinh du toan NSNN
  trinhDuyetDieuChinhService1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/them-moi',
      'http://192.168.1.109:30101/dieu-chinh-du-toan-chi/them-moi',
      request,
    );
  }

  // trinh duyet giao du toan chi nsnn
  giaoDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/them-moi',
      request,
    );
  }
  // trinh duyet giao du toan chi nsnn
  giaoDuToan1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.108:30101/giao_du_toan/them-moi',
      request,
    );
  }

  // update báo cáo quyết toán vốn, phí hàng DTQG
  updateBaoCaoQuyetToan(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/cap-nhat',
      // 'http://192.168.1.111:8094/lap-tham-dinh/cap-nhat',
      request,
    );
  }

  // update báo cáo quyết toán vốn, phí hàng DTQG
  updateBaoCaoQuyetToan1(request: any): Observable<any> {
    return this.httpClient.put(
      // this.urlDefault + '/qlnv-khoachphi/quyet-toan/cap-nhat',
      'http://192.168.1.101:30101/quyet-toan/cap-nhat',
      request,
    );
  }


  // update list giao du toan
  updateLapThamDinhGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/cap-nhat',
      request,
    );
  }
  // update list giao du toan
  updateLapThamDinhGiaoDuToan1(request: any): Observable<any> {
    return this.httpClient.put(
      'http://192.168.1.101:8094/giao_du_toan/cap-nhat',
      request,
    );
  }

  // upload phu luc dieu chinh du toan NSNN
  updatePLDieuChinh(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/chi-tiet',
      // 'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/chi-tiet',
      request,
    );
  }

  // upload phu luc dieu chinh du toan NSNN
  updatePLDieuChinh1(request: any): Observable<any> {
    return this.httpClient.put(
      // this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/chi-tiet',
      'http://192.168.1.103:30101/dieu-chinh-du-toan-chi/chi-tiet',
      request,
    );
  }

  // tong hop dieu chinh du toan
  tongHopDieuChinhDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/tong-hop',
      // 'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/tong-hop',
      request,
    );
  }
  // tong hop dieu chinh du toan
  tongHopDieuChinhDuToan1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/tong-hop',
      'http://192.168.1.103:30101/dieu-chinh-du-toan-chi/tong-hop',
      request,
    );
  }

  //tong hop giao du toan
  tongHopGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/tong-hop',
      request,
    );
  }
  //tong hop giao du toan
  tongHopGiaoDuToan1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.103:30101/giao_du_toan/tong-hop',
      request,
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

  //tao ma PA giao du toan chi NSNN
  maPhuongAnGiao(maLoai: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/sinh-ma?maLoai=' + maLoai
    );
  }
  //tao ma PA giao du toan chi NSNN
  maPhuongAnGiao1(maLoai: string): Observable<any> {
    return this.httpClient.get(
      'http://192.168.1.101:8094/giao_du_toan/sinh-ma?maLoai=' + maLoai
    );
  }

  //tao ma giao( giao du toan chi NSNN)
  maGiaoGiaoDuToanChi(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/sinh-ma-giao-so'
    );
  }

  //tao ma giao( giao du toan chi NSNN)
  maGiaoGiaoDuToanChi1(): Observable<any> {
    return this.httpClient.get(
      'http://192.168.1.105:8094/giao_du_toan/sinh-ma-giao-so'
    );
  }

  // tim kiem danh sach ma phuong an giao dieu chinh du toan NSNN
  timKiemMaPaGiaoNSNN(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/danh-sach/phuong-an-duyet'
      // 'http://192.168.1.103:8094/giao_du_toan/danh-sach/phuong-an-duyet'
    );
  }
  // tim kiem danh sach ma phuong an giao dieu chinh du toan NSNN
  timKiemMaPaGiaoNSNN1(): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/giao_du_toan/danh-sach/phuong-an-duyet'
      'http://192.168.1.105:8094/giao_du_toan/danh-sach/phuong-an-duyet'
    );
  }

  //giao so tran chi trong Giao du toan NSNN
  giaoSoTranChiGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/giao-so'
      , request);
  }
  //giao so tran chi trong Giao du toan NSNN
  giaoSoTranChiGiaoDuToan1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.101:30101/giao_du_toan/giao-so'
      , request);
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

  //nhap so QD giao du toan chi NSNN
  themMoiQdCvGiaoNSNN(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/them-moi/qd-cv'
      , request);
  }
  //nhap so QD giao du toan chi NSNN
  themMoiQdCvGiaoNSNN1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.105:8094/giao_du_toan/them-moi/qd-cv'
      , request);
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

  themmoiDieuChinh(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/them-moi',
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/them-moi',
      request);
  }

  updateDieuChinh(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/cap-nhat',
      request);
  }
  updateDieuChinh1(request: any): Observable<any> {
    return this.httpClient.put(
      'http://192.168.1.103:30101/dieu-chinh-du-toan-chi/cap-nhat',
      request);
  }

  chiTietDieuChinh(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/chi-tiet/' + id
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/chi-tiet/' + id,
    );
  }

  timKiemDieuChinh(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/danh-sach',
      request);
  }
  timKiemDieuChinh1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.101:8094/dieu-chinh-du-toan-chi/danh-sach',
      request);
  }

  danhSachDieuChinh(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/danh-sach',
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/danh-sach-dieu-chinh',
      request);
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

  // call api nút chức năng
  approveQuyetToan(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/trang-thai',
      request,
    );
  }

  // call api nút chức năng
  approveQuyetToan1(request: any): Observable<any> {
    return this.httpClient.put(
      // this.urlDefault + '/qlnv-khoachphi/quyet-toan/trang-thai',
      'http://192.168.1.105:8094/quyet-toan/trang-thai',
      request,
    );
  }

  // call api nút chức năng
  approveDieuChinh(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/trang-thai',
      // 'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/trang-thai',
      request,
    );
  }

  // call api nút chức năng
  approveDieuChinhPheDuyet(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/chi-tiet/phe-duyet',
      request,
    );
  }
  // call api nút chức năng dieu chinh
  approveDieuChinhPheDuyet1(request: any): Observable<any> {
    return this.httpClient.put(
      'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/chi-tiet/phe-duyet',
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



  //tim kiem giao danh sách nội dung khoản mục
  timDanhSachBCGiaoBTCPD(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/qd-giao-phan-bo-dtoan/danh-sach-noi-dung-khoan-muc'
      // 'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach-noi-dung-khoan-muc'
    )
  }
  //tim kiem giao danh sách nội dung khoản mục
  timDanhSachBCGiaoBTCPD1(): Observable<any> {
    return this.httpClient.get(
      // 'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach-noi-dung-khoan-muc',
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach-noi-dung-khoan-muc',

    )
  }
  //tim kiem giao danh sách nội dung khoản mục
  xoaBanGhiGiaoBTC(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/xoa',
      request
    )
  }
  //tim kiem giao danh sách nội dung khoản mục
  xoaBanGhiGiaoBTC1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.101:8094/giao_du_toan/xoa',
      request
    )
  }

  // trinh duyet phuong an giao phan bo du toan NSNN
  trinhDuyetPhuongAnGiao(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/trang-thai',
      request);
  }
  // trinh duyet phuong an giao phan bo du toan NSNN
  trinhDuyetPhuongAnGiao1(request: any): Observable<any> {
    return this.httpClient.put(
      'http://192.168.1.101:30101/giao_du_toan/trang-thai',
      request);
  }

  //xóa báo cáo nút xóa Báo cáo quyết toán
  xoaBaoCaoLapQuyetToan(request: any): Observable<any> {
    return this.httpClient.post(
      // 'http://192.168.1.105:8094/quyet-toan/xoa/',
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/xoa',
      request
    );
  }
  //xóa báo cáo nút xóa Báo cáo quyết toán
  xoaBaoCaoLapQuyetToan1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/nhap-ghi-nhan-von/xoa',
      'http://192.168.1.105:8094/quyet-toan/xoa',
      request
    );
  }

  //xóa báo cáo nút xóa Báo cáo
  xoaDuToanDieuChinh(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/xoa',
      request
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/xoa/' + id
    );
  }
  //xóa báo cáo nút xóa Báo cáo
  xoaDuToanDieuChinh1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/xoa/' + id
      'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/xoa',
      request
    );
  }

  //download file tu he thong chung
  downloadFile(fileUrl: any): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-core/file/' + fileUrl, { responseType: 'blob' });
  }

  // tim kiem danh sach quyet dinh giao phan bo du toan 3.2.6
  timKiemGiaoPhanBo(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/qd-giao-phan-bo-dtoan/danh-sach',
      // 'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach',
      request,
    );
  }
  // tim kiem danh sach quyet dinh giao phan bo du toan 3.2.6
  timKiemGiaoPhanBo1(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach',
      request,
    );
  }

  // call api chi tiết báo cáo
  chiTietPhanBo(id: any): Observable<any> {
    return this.httpClient.get(
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/chi-tiet/' + id,
    );
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

  checkNamTaoMoiQuyetToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/validate',
      request
    );
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
}
