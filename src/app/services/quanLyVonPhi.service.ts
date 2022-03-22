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
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/danh-sach',
      request,
    );
  }

  //search list bao cao giao du toan chi
  timBaoCaoGiao(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/quyet-dinh-giao-du-toan-chi/danh-sach',
      request,
    );
  }

  //search list phan bo du toan giao
  timDanhSachPhanBo(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/phan-bo-dtoan-chi/danh-sach',
      request,
    );
  }

  // call api nút chức năng
  approve(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/chuc-nang',
      request,
    );
  }

  // call api chi tiết báo cáo
  bCChiTiet(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/chi-tiet/' + id,
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
    const headerss= new HttpHeaders().set('Content-Type', 'multipart/form-data').set('Access-Control-Allow-Origin', '*');
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
      request,
    );
  }

  // trinh duyet giao du toan
  trinhDuyetGiaoService(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/quyet-dinh-giao-du-toan-chi/them-moi',
      request,
    );
  }

  // upload list
  updatelist(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/cap-nhat',
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

  //get list danh muc loai bao cao
  dMLoaiBaoCao(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/7',
      {
        paggingReq: {
          limit: 1000,
          page: 1,
        },
        str: '',
        trangThai: '',
      },
    );
  }

  //tong hop
  tongHop(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/tong-hop',
      request,
    );
  }

  //danh muc ke hoach von
  dMMaHthucVban(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/258',
      {
        paggingReq: {
          limit: 1000,
          page: 1,
        },
        str: '',
        trangThai: '',
      },
    );
  }

  //danh muc ke hoach von
  mDMaDviChuTri(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/85',
      {
        paggingReq: {
          limit: 1000,
          page: 1,
        },
        str: '',
        trangThai: '',
      },
    );
  }

  //danh muc ke hoach von
  dMKeHoachVon(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/55',
      {
        paggingReq: {
          limit: 1000,
          page: 1,
        },
        str: '',
        trangThai: '',
      },
    );
  }

  //danh muc khối dự án
  dMKhoiDuAn(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/40',
      {
        paggingReq: {
          limit: 1000,
          page: 1,
        },
        str: '',
        trangThai: '',
      },
    );
  }

  //danh muc chi tieu
  dMChiTieu(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/241',
      {
        paggingReq: {
          limit: 1000,
          page: 1,
        },
        str: '',
        trangThai: '',
      },
    );
  }

  //danh muc noi dung
  dMNoiDung(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/1',
      {
        paggingReq: {
          limit: 1000,
          page: 1,
        },
        str: '',
        trangThai: '',
      },
    );
  }

  //danh muc nhom chi
  dMNhomChi(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/3',
      {
        paggingReq: {
          limit: 1000,
          page: 1,
        },
        str: '',
        trangThai: '',
      },
    );
  }

  //linh vuc chi
  linhvucchi():Observable<any>{
    return this.httpClient.post(this.urlDefault+ '/qlnv-category/dmuc-khoachvon/262' ,
    {
        "paggingReq": {
            "limit": 1000,
            "page": 1
        },
        "str": "",
        "trangThai": "",
    });
  }

  //muc chi
  mucchi():Observable<any>{
    return this.httpClient.post(this.urlDefault + '/qlnv-category/dmuc-khoachvon/135',

    {
        "paggingReq": {
            "limit": 1000,
            "page": 1
        },
        "str": "",
        "trangThai": "",
    })
  }

  //tao ma PA
  maPhuongAn():Observable<any>{
    return this.httpClient.get(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/sinh-ma-pa');
  }

  //chi tiet ma phuong an
  chitietPhuongAn(id:any):Observable<any>{
    return this.httpClient.get(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/chi-tiet/'+id);
  }

  //tao ma giao
  maGiao():Observable<any>{
    return this.httpClient.get(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/sinh-ma-giao-so');
  }

  //giao so tran chi
  giaoSoTranChi(request:any):Observable<any>{
    return  this.httpClient.post(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/giao-so',request);
  }

  //them moi phuong an
  themmoiPhuongAn(request:any):Observable<any>{
    return this.httpClient.post(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/them-moi',request);
  }

  //cap nhat phuong an
  capnhatPhuongAn(requestUpdate:any):Observable<any>{
    return this.httpClient.put(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/cap-nhat',requestUpdate);
  }

  //xem chi tiet so giao tran chi
  getchitiettranchi(id:any):Observable<any>{
    return this.httpClient.get(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/ctiet-giao-so/'+id);
  }

  //tim kiem so giao tran chi
  timkiemphuongan(infoSearch:any):Observable<any>{
    return this.httpClient.post(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/danh-sach',
        infoSearch
    )
  }

  //tim kiem so giao kiem tra tran chi
  timkiemsokiemtratranchi(request:any):Observable<any>{
    return this.httpClient.post(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/dsach-giao-so',request)
  }

  //lay danh sach don vi nhan
  dmDonViNhan():Observable<any>{
    return this.httpClient.post(this.urlDefault + '/qlnv-category/dmuc-khoachvon/341',

    {
        "paggingReq": {
            "limit": 1000,
            "page": 1
        },
        "str": "",
        "trangThai": "",
    })
  }

  //list danh sach phuong an da duoc duyet
  danhsachphuonganduocduyet():Observable<any>{
    return this.httpClient.get(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/danh-sach');
  }


  //xoa quyet dinh cong van
  xoaquyetdinhcongvan(request:any):Observable<any>{
    console.log(request);
    return this.httpClient.put(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/xoa-qd-cv',request);
  }

  //nhap so QD-CV
  nhapsoqdcv(req:any):Observable<any>{
    return this.httpClient.put(this.urlDefault+'/qlnv-khoachphi/pa-giao-so-kt/nhap-qd-cv',req)
  }


  //tim kiem danh sach bao cao ket qua thuc hien von phi hang DTQG tại tong cuc DTNN
  timkiemdanhsachketquathuchienvonphi(request:any):Observable<any>{
    return this.httpClient.post(this.urlDefault+'/qlnv-khoachphi/bao-cao/danh-sach',request)
  }


  //lay danh sach vật tư hàng hóa
  dmVattuhanghoa():Observable<any>{
    return this.httpClient.post(this.urlDefault + '/qlnv-category/dmuc-khoachvon/147',

    {
        "paggingReq": {
            "limit": 1000,
            "page": 1
        },
        "str": "",
        "trangThai": "",
    })
  }

  //dm đơn vị tính
  dmDonvitinh():Observable<any>{
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

  //thêm mới báo cáo (dung chung cho cac mau bao cao 02-05)
  themmoibaocaoketquathuchien(request:any):Observable<any>{
    return this.httpClient.post(this.urlDefault+'/qlnv-khoachphi/bao-cao/them-moi',request);
  }

  //lay chi tiet cac mau bao cao
  chitietmaubaocao(id:any):Observable<any>{
    return this.httpClient.get(this.urlDefault+'/qlnv-khoachphi/bao-cao/chi-tiet/'+id)
  }

  //capnhat baocao (dung chung cho cac mau bao cao 02-05)
  capnhatbaocao(request:any):Observable<any>{
    return this.httpClient.put(this.urlDefault+'/qlnv-khoachphi/bao-cao/cap-nhat',request);
  }

  //get list danh muc loai bao cao ket qua thuc hien von phi hang DTQG
  dMLoaiBaoCaoKetQuaThucHienHangDTQG(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/406',
      {
        paggingReq: {
          limit: 1000,
          page: 1,
        },
        str: '',
        trangThai: '',
      },
    );
  }

  themmoi325(request:any): Observable<any>{
    return this.httpClient.post(this.urlDefault+'/qlnv-khoachphi/dieu-chinh-du-toan-chi/them-moi', request);
  }

  update325(request:any): Observable<any>{
    return this.httpClient.put(this.urlDefault+'/qlnv-khoachphi/dieu-chinh-du-toan-chi/cap-nhat', request);
  }

  chitiet325(id:any): Observable<any>{
    return this.httpClient.get(this.urlDefault+'/qlnv-khoachphi/dieu-chinh-du-toan-chi/chi-tiet/'+id);
  }

  timkiem325(request: any): Observable<any>{
    return this.httpClient.post(this.urlDefault + '/qlnv-khoachphi/dieu-chinh-du-toan-chi/danh-sach', request);
  }


  //tong hop bao cao ket qua thuc hien von phi hang DTQG
  tonghopbaocaoketqua(request:any):Observable<any>{
    return this.httpClient.post(this.urlDefault +'/qlnv-khoachphi/bao-cao/tong-hop',request);
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

}
