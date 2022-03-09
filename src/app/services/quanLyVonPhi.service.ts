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
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/danh-sach',
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

  // upload list
  updatelist(request: any): Observable<any> {
    return this.httpClient.put(
      this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/cap-nhat',
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
}
