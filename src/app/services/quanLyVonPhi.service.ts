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
  constructor(public httpClient: HttpClient,
    public httpClient1: HttpClient) {
    super(httpClient, 'quanLyVonPhi');
  }

  urlDefault = environment.SERVICE_API;
  //search list bao cao
  timBaoCao(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/bao-cao/danh-sach', request)
    // return this.httpClient.post('http://192.168.1.120:8094/bao-cao/danh-sach', request)
  }

  //search list bao cao
  timBaoCaoLapThamDinh(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/danh-sach',

      // 'http://192.168.1.100:8094/lap-tham-dinh/danh-sach',
      request,
    );
  }

  //search list bao cao
  timKiemDeNghi(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/danh-sach',
      'http://192.168.1.100:8094/de-nghi-cap-von/danh-sach',
      request,
    );
  }

  //search list bao cao
  timKiemDeNghiThop(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/danh-sach',
      'http://192.168.1.100:8094/thop-cap-von/danh-sach',
      request,
    );
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
      'http://192.168.1.103:8094/quyet-toan/danh-sach',
      request,
    );
  }

  //search list bao cao giao du toan chi
  timBaoCaoGiao(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/danh-sach',
      // 'http://192.168.1.103:8094/giao_du_toan/danh-sach',
      request,
    );
  }

  //search list bao cao giao du toan chi
  timBaoCaoGiao1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/giao_du_toan/danh-sach',
      'http://192.168.1.103:8094/giao_du_toan/danh-sach',
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

  // call api nút chức năng
  approve(request: any): Observable<any> {
    return this.httpClient.put(
      // 'http://192.168.1.110:8094/lap-tham-dinh-du-toan/trang-thai',
      // 'http://192.168.1.125:8094/lap-tham-dinh-du-toan/trang-thai',
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/trang-thai',
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

  // call api nút chức năng cho văn bản
  approveVB(request: any): Observable<any> {
    return this.httpClient.put(
      // 'http://192.168.1.103:8094/lap-tham-dinh-du-toan/chuc-nang-van-ban',
      // 'http://192.168.1.125:8094/lap-tham-dinh-du-toan/chuc-nang',
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/chuc-nang-van-ban',
      request,
    );
  }

  // call api chi tiết báo cáo
  bCLapThamDinhDuToanChiTiet(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/chi-tiet/' + id,
      // 'http://192.168.1.100:8094/lap-tham-dinh/chi-tiet/' + id,
    );
  }

  bCLapThamDinhDuToanChiTiet1(id: any): Observable<any> {
    return this.httpClient.get(
      //this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/chi-tiet/' + id,
      'http://192.168.1.100:8094/lap-tham-dinh-du-toan/chi-tiet/' + id,
    );
  }
  bCDieuChinhDuToanChiTiet(id: any): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/chi-tiet/' + id,
      'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/chi-tiet/' + id,
    );
  }


  // call api chi tiết báo cáo giao dự toán chi nsnn
  QDGiaoChiTiet(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/chi-tiet/' + id,
    );
  }

  // call api chi tiết báo cáo giao dự toán chi nsnn
  QDGiaoChiTiet1(id: any, maLoai: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/chi-tiet/' + id + '?maLoai=' + maLoai,
      // 'http://192.168.1.103:8094/giao_du_toan/chi-tiet/' + id + '?maLoai=' + maLoai,
    );
  }

  // call api chi tiết báo cáo quyết toán vốn, phí hàng DTQG
  CtietBcaoQuyetToan(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/chi-tiet/' + id ,
      // 'http://192.168.1.103:8094/quyet-toan/chi-tiet/' + id ,
    );
  }

  // call api chi tiết báo cáo quyết toán vốn, phí hàng DTQG
  CtietBcaoQuyetToan1(id: any): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/quyet-toan/chi-tiet/' + id ,
      'http://192.168.1.103:8094/quyet-toan/chi-tiet/' + id ,
    );
  }

  // upload file to server
  uploadFile(request: FormData): Observable<any> {
    let options = { headers: new HttpHeaders().set('Content-Type', 'multipart/form-data') };
    const headerss = new HttpHeaders().set('Content-Type', 'multipart/form-data').set('Access-Control-Allow-Origin', '*');
    let headers: {
      'Content-Type': 'multipart/form-data'
    }
    return this.httpClient1.post(
      this.urlDefault + '/qlnv-core/file/upload',
      request,
      { 'headers': headerss }
    );
  }

  //sinh ma bao cao
  sinhMaBaoCao(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/sinh-ma',
      // 'http://192.168.1.100:8094/lap-tham-dinh/sinh-ma',
    );
  }

  //sinh ma bao cao quyet toan
  sinhMaBaoCaoQuyetToan(maPhanBcao: any): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/quyet-toan/sinh-ma?maPhanBcao=' + maPhanBcao,
      'http://192.168.1.103:8094/quyet-toan/sinh-ma?maPhanBcao=' + maPhanBcao,
    );
  }

  //sinh ma bao cao dieu chinh du toan
  sinhMaBaoCaoDieuChinh(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/sinh-ma',
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/sinh-ma',
    );
  }

  // trinh duyet
  trinhDuyetService(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/them-moi',
      // 'http://192.168.1.100:8094/lap-tham-dinh/them-moi',
      request,
    );
  }

  // Trình duyệt quyết toán vốn, phí hàng DTQG
  trinhDuyetServiceQuyetToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/them-moi',
      // 'http://192.168.1.111:8094/quyet-toan/them-moi',
      request,
    );
  }

  // Trình duyệt quyết toán vốn, phí hàng DTQG 1
  trinhDuyetServiceQuyetToan1(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/quyet-toan/them-moi',
      'http://192.168.1.103:8094/quyet-toan/them-moi',
      request,
    );
  }

  // trinh duyet dieu chinh du toan NSNN
  trinhDuyetDieuChinhService(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/them-moi',
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/them-moi',
      request,
    );
  }

  // trinh duyet giao du toan chi nsnn
  giaoDuToan1(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/them-moi',
      request,
    );
  }
  // trinh duyet giao du toan chi nsnn
  giaoDuToan2(request: any): Observable<any> {
    return this.httpClient.post(
      'http://192.168.1.103:8094/giao_du_toan/them-moi',
      request,
    );
  }

  // trinh duyet bao cao thuc hien du toan chi 3.2.8
  trinhDuyetBaoCaoThucHienDTCService(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/bao-cao/them-moi',
      // 'http://192.168.1.120:8094/bao-cao/them-moi',
      request,
    );
  }

  // upload list
  updateLapThamDinh(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/chi-tiet/cap-nhat',
      // 'http://192.168.1.100:8094/lap-tham-dinh/chi-tiet/cap-nhat',
      request,
    );
  }

  // upload list
  updateDeNghi(request: any): Observable<any> {
    return this.httpClient.put(
      // this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/chi-tiet/cap-nhat',
      'http://192.168.1.100:8094/de-nghi-cap-von/cap-nhat',
      request,
    );
  }

  // upload list
  updateBieuMau(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/cap-nhat',
      // 'http://192.168.1.100:8094/lap-tham-dinh/cap-nhat',
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
      'http://192.168.1.103:8094/quyet-toan/cap-nhat',
      request,
    );
  }


  // update list giao du toan
  updateLapThamDinhGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/qd-giao-phan-bo-dtoan/cap-nhat',
      request,
    );
  }
  // update list giao du toan
  updateLapThamDinhGiaoDuToan1(request: any): Observable<any> {
    return this.httpClient.put(
      // 'http://192.168.1.103:8094/giao_du_toan/cap-nhat',
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/cap-nhat',
      request,
    );
  }

  // upload phu luc dieu chinh du toan NSNN
  updatePLDieuChinh(request: any): Observable<any> {
    return this.httpClient.put(
      // this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/chi-tiet',
      'http://192.168.1.105:8094/dieu-chinh-du-toan-chi/chi-tiet',
      request,
    );
  }

  // tong hop dieu chinh du toan
  tongHopDieuChinhDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/tong-hop',
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/tong-hop',
      request,
    );
  }


  //tong hop
  tongHop(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/tong-hop',
      // 'http://192.168.1.100:8094/lap-tham-dinh/tong-hop',
      request,
    );
  }

  //tong hop
  tongHopCapVonNguonChi(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/tong-hop',
      'http://192.168.1.100:8094/thop-cap-von/tong-hop',
      request,
    );
  }

  //tong hop giao du toan
  tongHopGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/tong-hop',
      // 'http://192.168.1.103:8094/giao_du_toan/tong-hop',
      request,
    );
  }

  //tao ma PA
  maPhuongAn(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/sinh-ma-pa'
      // 'http://192.168.1.100:8094/pa-giao-so-kt/sinh-ma-pa'
    );
  }

  //tao ma PA
  maDeNghi(): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/sinh-ma-pa'
      'http://192.168.1.100:8094/de-nghi-cap-von/sinh-ma'
    );
  }

  //tao ma PA
  dsachHopDong(): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/sinh-ma-pa'
      'http://192.168.1.100:8094/de-nghi-cap-von/danh-sach-hop-dong'
    );
  }

  //danh sach bao cao tong hop nen bao cao to
  danhSachBaoCaoTongHop(maBcao: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/danh-sach/bao-cao/' + maBcao
      // 'http://192.168.1.100:8094/pa-giao-so-kt/danh-sach/bao-cao/' + maBcao
    )
  }
  //tao ma PA giao du toan chi NSNN
  maPhuongAnGiao(maLoai: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/sinh-ma?maLoai=' + maLoai
      // 'http://192.168.1.103:8094/giao_du_toan/sinh-ma?maLoai=' + maLoai
    );
  }

  //tao ma giao( giao du toan chi NSNN)
  maGiaoGiaoDuToanChi(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/sinh-ma-giao-so'
      // 'http://192.168.1.103:8094/giao_du_toan/sinh-ma-giao-so'
    );
  }

  timKiemMaPaDuyet(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/danh-sach/pa-lanh-dao-duyet'
      // 'http://192.168.1.100:8094/pa-giao-so-kt/danh-sach/pa-lanh-dao-duyet'
    );
  }

  // tim kiem danh sach ma phuong an giao dieu chinh du toan NSNN
  timKiemMaPaGiaoNSNN(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/danh-sach/phuong-an-duyet'
      // 'http://192.168.1.103:8094/giao_du_toan/danh-sach/phuong-an-duyet'
    );
  }
  //chi tiet ma phuong an
  ctietPhuongAn(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/chi-tiet/' + id
      // 'http://192.168.1.100:8094/pa-giao-so-kt/chi-tiet/' + id
    );
  }

  //chi tiet ma phuong an
  ctietDeNghi(id: any): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/chi-tiet/' + id
      'http://192.168.1.100:8094/de-nghi-cap-von/chi-tiet/' + id
    );
  }

  ctietDeNghiThop(id: any): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/chi-tiet/' + id
      'http://192.168.1.100:8094/thop-cap-von/chi-tiet/' + id
    );
  }

  //tao ma giao
  maGiao(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/sinh-ma-giao-so'
      // 'http://192.168.1.100:8094/pa-giao-so-kt/sinh-ma-giao-so'
    );
  }

  //giao so tran chi
  giaoSoTranChi(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/giao-so'
      // 'http://192.168.1.100:8094/pa-giao-so-kt/giao-so'
      , request);
  }

  //giao so tran chi trong Giao du toan NSNN
  giaoSoTranChiGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/giao-so'
      // 'http://192.168.1.103:8094/giao_du_toan/giao-so'
      , request);
  }

  //them moi phuong an
  themMoiPhuongAn(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/them-moi',
      // 'http://192.168.1.100:8094/pa-giao-so-kt/them-moi',
      request);
  }

  themMoiDnghiThop(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/them-moi',
      'http://192.168.1.100:8094/thop-cap-von/them-moi',
      request);
  }

  capNhatDnghiThop(request: any): Observable<any> {
    return this.httpClient.put(
      // this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/them-moi',
      'http://192.168.1.100:8094/thop-cap-von/cap-nhat',
      request);
  }

  //sua bao cao theo so giao tran chi
  suaBcao(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/cap-nhat/bao-cao',
      // 'http://192.168.1.100:8094/pa-giao-so-kt/cap-nhat/bao-cao',
      request);
  }

  //cap nhat phuong an
  capnhatPhuongAn(requestUpdate: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/cap-nhat'
      // 'http://192.168.1.100:8094/pa-giao-so-kt/cap-nhat'
      , requestUpdate);
  }

  //xoa phuong an
  xoaPhuongAn(id: any): Observable<any> {
    return this.httpClient.delete(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/xoa/' + id
      // 'http://192.168.1.100:8094/pa-giao-so-kt/xoa/' + id
    );
  }
  //xem chi tiet so giao tran chi
  ctietGiaoSoTranChi(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/ctiet-giao-so/' + id
      // 'http://192.168.1.100:8094/pa-giao-so-kt/ctiet-giao-so/'+id
    );

  }

  //tim kiem so giao tran chi
  timKiemPhuongAn(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/danh-sach'
      // 'http://192.168.1.100:8094/pa-giao-so-kt/danh-sach'
      , request)
  }

  //tim kiem so giao kiem tra tran chi
  timKiemSoKiemTraTranChi(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/dsach-giao-so'
      // 'http://192.168.1.100:8094/pa-giao-so-kt/dsach-giao-so'
      , request)
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

  //nhap so QD-CV
  themMoiQdCv(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/nhap-qd-cv'
      // 'http://192.168.1.100:8094/pa-giao-so-kt/nhap-qd-cv'
      , request);
  }

  //nhap so QD giao du toan chi NSNN
  themMoiQdCvGiaoNSNN(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/them-moi/qd-cv'
      // 'http://192.168.1.103:8094/giao_du_toan/them-moi/qd-cv'
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
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/cap-nhat',
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
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/danh-sach',
      request);
  }

  danhSachDieuChinh(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/danh-sach',
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/danh-sach-dieu-chinh',
      request);
  }


  //tong hop bao cao ket qua thuc hien von phi hang DTQG
  tongHopBaoCaoKetQua(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/bao-cao/tong-hop', request);
    // return this.httpClient.post('http://192.168.1.120:8094/bao-cao/tong-hop', request);
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
  timDsachVban(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/danh-sach-van-ban',
      // 'http://192.168.1.103:8094/lap-tham-dinh-du-toan/danh-sach-van-ban',
      request,
    );
  }

  ctietVban(id: number): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/chi-tiet-van-ban/' + id
    );
  }

  themMoiVban(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/them-moi-van-ban',
      request
    );
  }

  capNhatVban(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/cap-nhat-van-ban',
      request
    );
  }

  // call api chi tiết báo cáo
  baoCaoChiTiet(id: any): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/bao-cao/chi-tiet/' + id,);
    // return this.httpClient.get('http://192.168.1.120:8094/bao-cao/chi-tiet/')
  }

  // call api nút chức năng
  approveBaoCao(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/bao-cao/trang-thai',
      // 'http://192.168.1.120:8094/bao-cao/trang-thai',
      request,
    );
  }

  // call api nút chức năng
  approveThamDinh(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/trang-thai',
      // 'http://192.168.1.100:8094/lap-tham-dinh/trang-thai',
      request,
    );
  }


  // call api nút chức năng
  approveCtietThamDinh(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/chi-tiet/phe-duyet',
      // 'http://192.168.1.100:8094/lap-tham-dinh/chi-tiet/phe-duyet',
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
      'http://192.168.1.103:8094/quyet-toan/trang-thai',
      request,
    );
  }

  // call api nút chức năng
  approveDieuChinh(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/trang-thai',
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/trang-thai',
      request,
    );
  }

  // call api nút chức năng
  approveDieuChinhPheDuyet(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/chi-tiet/phe-duyet',
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/chi-tiet/phe-duyet',
      request,
    );
  }


  // upload bao cao thuc hien du toan chi
  updateBaoCaoThucHienDTC(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/bao-cao/cap-nhat',
      // 'http://192.168.1.120:8094/bao-cao/cap-nhat',
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

  //sinh đợt báo cáo 3.2.9
  sinhDotBaoCao(): Observable<any> {
    // return this.httpClient.get('http://192.168.1.120:8094/bao-cao/sinh-dot');
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/bao-cao/sinh-dot')
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
  xoaBanGhiGiaoBTC(id: any): Observable<any> {
    return this.httpClient.delete(
      // 'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach-noi-dung-khoan-muc',
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/xoa/' + id,

    )
  }

  trinhDuyetPhuongAn(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/trang-thai',
      // 'http://192.168.1.100:8094/pa-giao-so-kt/trang-thai',
      request);
  }

  taoMoiDeNghi(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/trang-thai',
      'http://192.168.1.100:8094/de-nghi-cap-von/them-moi',
      request);
  }

  trinhDeNghi(request: any): Observable<any> {
    return this.httpClient.put(
      // this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/trang-thai',
      'http://192.168.1.100:8094/de-nghi-cap-von/trang-thai',
      request);
  }

  trinhDuyetDeNghiTongHop(request: any): Observable<any> {
    return this.httpClient.put(
      // this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/trang-thai',
      'http://192.168.1.100:8094/thop-cap-von/trang-thai',
      request);
  }



  // trinh duyet phuong an giao phan bo du toan NSNN
  trinhDuyetPhuongAnGiao(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/giao_du_toan/trang-thai',
      // 'http://192.168.1.103:8094/giao_du_toan/trang-thai',
      request);
  }

  //xóa báo cáo nút xóa Báo cáo
  xoaBaoCaoLapThamDinh(id: any): Observable<any> {
    return this.httpClient.delete(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/xoa/' + id
      // 'http://192.168.1.100:8094/lap-tham-dinh/xoa/' + id
    );
  }

  //xóa báo cáo nút xóa Báo cáo
  xoaDeNghi(id: any): Observable<any> {
    return this.httpClient.delete(
      // this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/xoa/' + id
      'http://192.168.1.100:8094/de-nghi-cap-von/xoa/' + id
    );
  }

  //xóa báo cáo nút xóa Báo cáo
  xoaDeNghiThop(id: any): Observable<any> {
    return this.httpClient.delete(
      // this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh/xoa/' + id
      'http://192.168.1.100:8094/thop-cap-von/xoa/' + id
    );
  }

  //xóa báo cáo nút xóa Báo cáo quyết toán
  xoaBaoCaoLapQuyetToan(id: any): Observable<any> {
    return this.httpClient.delete(
      this.urlDefault + '/qlnv-khoachphi/quyet-toan/xoa/' + id
      // 'http://192.168.1.111:8094/quyet-toan/xoa/' + id
    );
  }
  //xóa báo cáo nút xóa Báo cáo quyết toán
  xoaBaoCaoLapQuyetToan1(id: any): Observable<any> {
    return this.httpClient.delete(
      // this.urlDefault + '/qlnv-khoachphi/quyet-toan/xoa/' + id
      'http://192.168.1.103:8094/quyet-toan/xoa/' + id
    );
  }

  //xóa báo cáo nút xóa Báo cáo
  xoaDuToanDieuChinh(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/xoa/' + id
      // 'http://192.168.1.103:8094/dieu-chinh-du-toan-chi/xoa/' + id
    );
  }

  //download file tu he thong chung
  downloadFile(fileUrl: any): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-core/file/' + fileUrl, { responseType: 'blob' });
  }

  // trinh duyet
  themDeNghiCapVon(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/them-moi',
      // 'http://192.168.1.100:8094/cap-nguon-von-chi/dncv',
      request,
    );
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
    // return this.httpClient.post('http://192.168.1.120:8094/bao-cao/tim-kiem-thong-tin-phe-duyet',request);
  }

  //sinh ma bao cao (3.2.9)
  taoMaBaoCao(): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/bao-cao/sinh-ma');
    // return this.httpClient.get('http://192.168.1.120:8094/bao-cao/sinh-ma');
  }

  //xóa báo cáo nút xóa Báo cáo
  xoaBaoCao(id: any): Observable<any> {
    return this.httpClient.delete(
      this.urlDefault + '/qlnv-khoachphi/bao-cao/xoa/' + id
    );
  }

  // call api chi tiết báo cáo
  baoCaoCapNhatChiTiet(request: any): Observable<any> {
    return this.httpClient.put(this.urlDefault + '/qlnv-khoachphi/bao-cao/chi-tiet', request);
    // return this.httpClient.put('http://192.168.1.120:8094/bao-cao/chi-tiet/',request)
  }

  // call api chức năng duyet bieu mau
  approveBieuMau(request: any): Observable<any> {
    return this.httpClient.put(this.urlDefault + '/qlnv-khoachphi/bao-cao/chi-tiet/phe-duyet', request);
    // return this.httpClient.put('http://192.168.1.120:8094/bao-cao/chi-tiet',request);
  }

}
