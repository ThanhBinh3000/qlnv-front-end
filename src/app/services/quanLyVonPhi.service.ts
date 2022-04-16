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
    // return this.httpClient.post('http://192.168.1.110:8094/bao-cao/danh-sach', request)
    // return this.httpClient.post('http://192.168.1.111:8094/bao-cao/danh-sach', request)
  }

  //search list bao cao
  timBaoCaoLapThamDinh(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/danh-sach',

      // 'http://192.168.1.111:8094/lap-tham-dinh-du-toan/danh-sach',
      request,
    );
  }

  //search list bao cao giao du toan chi
  timBaoCaoGiao(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/quyet-dinh-giao-du-toan-chi/danh-sach',
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach',
      request,
    );
  }

  //search list phan bo du toan giao
  timDanhSachPhanBo(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/phan-bo-dtoan-chi/danh-sach',
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach-phan-bo',
      request,
    );
  }

  // call api nút chức năng
  approve(request: any): Observable<any> {
    return this.httpClient.put(
      // 'http://192.168.1.110:8094/lap-tham-dinh-du-toan/chuc-nang',
      // 'http://192.168.1.125:8094/lap-tham-dinh-du-toan/chuc-nang',
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/chuc-nang',
      request,
    );
  }

  // call api chi tiết báo cáo
  bCLapThamDinhDuToanChiTiet(id: any): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/chi-tiet/' + id,
      'http://192.168.1.111:8094/lap-tham-dinh-du-toan/chi-tiet/' + id,
    );
  }

  bCLapThamDinhDuToanChiTiet1(id: any): Observable<any> {
    return this.httpClient.get(
      //this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/chi-tiet/' + id,
      'http://192.168.1.111:8094/lap-tham-dinh-du-toan/chi-tiet/' + id,
    );
  }


  // call api chi tiết báo cáo
  QDGiaoChiTiet(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/quyet-dinh-giao-du-toan-chi/chi-tiet/' + id,
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
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/sinh-ma-bcao',
    );
  }

  // trinh duyet
  trinhDuyetService(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/them-moi',
      // 'http://192.168.1.111:8094/lap-tham-dinh-du-toan/them-moi',
      request,
    );
  }

  // trinh duyet giao du toan
  trinhDuyetGiaoService(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/quyet-dinh-giao-du-toan-chi/them-moi',
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/them-moi',
      request,
    );
  }

  // trinh duyet bao cao thuc hien du toan chi 3.2.8
  trinhDuyetBaoCaoThucHienDTCService(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/bao-cao/them-moi',
      // 'http://192.168.1.118:8094/bao-cao/them-moi',
      request,
    );
  }

  // upload list
  updatelist(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/cap-nhat',
      // 'http://192.168.1.111:8094/lap-tham-dinh-du-toan/cap-nhat',
      request,
    );
  }


  // update list giao du toan
  updatelistGiaoDuToan(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/quyet-dinh-giao-du-toan-chi/cap-nhat',
      request,
    );
  }

  //get list don vi tao
  dMDonVi(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-category/dmuc-donvi/danh-sach/tat-ca',
    );
  }

  //tong hop
  tongHop(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/tong-hop',
      request,
    );
  }

  //tao ma PA
  maPhuongAn(): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/sinh-ma-pa');
  }

  //chi tiet ma phuong an
  chitietPhuongAn(maPa: any): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/chi-tiet/' + maPa);
    // return this.httpClient.get('http://192.168.1.103:8094/pa-giao-so-kt/chi-tiet/'+maPa);
  }

  //tao ma giao
  maGiao(): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/sinh-ma-giao-so');
  }

  //giao so tran chi
  giaoSoTranChi(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/giao-so', request);
    // return this.httpClient.post('http://192.168.1.103:8094/pa-giao-so-kt/giao-so',request);
  }

  //them moi phuong an
  themmoiPhuongAn(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/them-moi', request);
    // return this.httpClient.post('http://192.168.1.103:8094/pa-giao-so-kt/them-moi',request)
  }

  //cap nhat phuong an
  capnhatPhuongAn(requestUpdate: any): Observable<any> {
    return this.httpClient.put(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/cap-nhat', requestUpdate);
    // return this.httpClient.put('http://192.168.1.103:8094/pa-giao-so-kt/cap-nhat',requestUpdate);
  }

  //xem chi tiet so giao tran chi
  getchitiettranchi(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/ctiet-giao-so/', request);
    // return this.httpClient.post('http://192.168.1.103:8094/pa-giao-so-kt/ctiet-giao-so/',request);

  }

  //tim kiem so giao tran chi
  timkiemphuongan(infoSearch: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/danh-sach', infoSearch)
    // return this.httpClient.post('http://192.168.1.103:8094/pa-giao-so-kt/danh-sach',infoSearch)
  }

  //tim kiem so giao kiem tra tran chi
  timkiemsokiemtratranchi(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/dsach-giao-so', request)
    // return this.httpClient.post('http://192.168.1.103:8094/pa-giao-so-kt/dsach-giao-so',request);
  }

  //list danh sach phuong an da duoc duyet
  danhsachphuonganduocduyet(maDvi:any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/danh-sach-phuong-an/',maDvi);
    // return this.httpClient.post('http://192.168.1.103:8094/pa-giao-so-kt/danh-sach-phuong-an',maDvi);
  }


  //xoa quyet dinh cong van
  xoaquyetdinhcongvan(request: any): Observable<any> {
    return this.httpClient.delete(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/xoa-qd-cv/'+request);
  }

  //nhap so QD-CV
  nhapsoqdcv(req: any): Observable<any> {
    return this.httpClient.put(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/nhap-qd-cv', req)
    // return this.httpClient.put('http://192.168.1.103:8094/pa-giao-so-kt/nhap-qd-cv',req);
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

  themmoi325(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/them-moi', request);
  }

  update325(request: any): Observable<any> {
    return this.httpClient.put(this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/cap-nhat', request);
  }

  chitiet325(id: any): Observable<any> {
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/chi-tiet/' + id);
  }

  timkiem325(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/danh-sach', request);
  }


  //tong hop bao cao ket qua thuc hien von phi hang DTQG
  tonghopbaocaoketqua(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/bao-cao/tong-hop', request);
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
    return this.httpClient.post( this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/danh-sach-van-ban',
      request,
    );
  }

  ctietVban(id: number): Observable<any> {
    return this.httpClient.get(  this.urlDefault +'/qlnv-khoachphi/lap-tham-dinh-du-toan/chi-tiet-van-ban/' + id
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
    return this.httpClient.get( this.urlDefault + '/qlnv-khoachphi/bao-cao/chi-tiet/' + id,);
    // return this.httpClient.get('http://192.168.1.118:8094/bao-cao/chi-tiet/' + id)
  }

  // call api nút chức năng
  approveBaoCao(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/bao-cao/chuc-nang',
      // 'http://192.168.1.118:8094/bao-cao/chuc-nang',
      request,
    );
  }

  // call api chức năng duyet bieu mau
  approveBieuMau(request:any):Observable<any>{
    return this.httpClient.put(this.urlDefault+'/qlnv-khoachphi/bao-cao/phe-duyet-chi-tiet',request);
    // return this.httpClient.put('http://192.168.1.111:8094/bao-cao/phe-duyet-chi-tiet',request);
  }

  // upload bao cao thuc hien du toan chi
  updateBaoCaoThucHienDTC(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/bao-cao/cap-nhat',
      request,
    );
    // return this.httpClient.put('http://192.168.1.118:8094/bao-cao/cap-nhat',
      // request)
  }

  // call api chi tiết báo cáo
  sinhMaVban(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault +
      '/qlnv-khoachphi/lap-tham-dinh-du-toan/sinh-ma-vban'
    );
  }

  //sinh đợt báo cáo 3.2.9
  sinhDotBaoCao():Observable<any>{
    // return this.httpClient.get('http://192.168.1.111:8094/bao-cao/lay-dot-bao-cao');
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/bao-cao/lay-dot-bao-cao')
  }

  //tim kiem giao danh sách nội dung khoản mục
  timDanhSachBCGiaoBTCPD(request: any): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/dsach-giao-so',
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach-noi-dung-khoan-muc',
      request
    )
  }

  trinhDuyetPhuongAn(request:any):Observable<any>{
    return this.httpClient.put(this.urlDefault + '/qlnv-khoachphi/pa-giao-so-kt/chuc-nang',
    request);
  }

  //xóa báo cáo nút xóa Báo cáo
  xoaBaoCao(id:any):Observable<any>{
    return this.httpClient.delete(this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/xoa/' +id);
  }
}
