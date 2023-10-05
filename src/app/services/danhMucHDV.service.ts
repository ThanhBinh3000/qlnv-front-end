import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';


@Injectable({
  providedIn: 'root',
})
export class DanhMucHDVService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'danhMucHDV', '');
  }

  urlDefault = environment.SERVICE_API;

  //get list danh muc loai bao cao
  dMLoaiBaoCao(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/7",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //get list don vi tao
  dMDonVi(): Observable<any> {
    return this.httpClient.post(
      // this.urlDefault + '/qlnv-category/dmuc-donvi/danh-sach/hoat-dong'
      this.urlDefault + "/qlnv-category/dmuc-donvi/tat-ca",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  chiTietDonVi(id: string): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-donvi/chi-tiet/" + id
    );
  }

  //danh muc noi dung
  dMNoiDung(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/1",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //danh muc nhom chi
  dMNhomChi(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/3",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //danh muc loai chi
  dMLoaiChi(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/2",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //danh muc loai ke hoach
  dMLoaiKeHoach(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/32",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //danh muc khối dự án
  dMKhoiDuAn(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/40",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //danh muc loai ke hoach
  dMDiaDiemXayDung(): Observable<any> {
    // return this.httpClient.get(
    //   this.urlDefault + "/qlnv-category/dmuc-chung/danh-sach/XUAT_BAN",
    // );
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/45",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //danh muc loai ke hoach
  dMMaNganhKinhTe(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/50",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //danh muc ke hoach von
  dMKeHoachVon(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/55",
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

  dMLoaiDan(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/106",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": "",
      }
    )
  }
  dMNguonVon(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/122",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": "",
      }
    )
  }
  dMLoaiCongTrinh(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/131",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": "",
      }
    )
  }
  dMucCoQuan(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/143",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": "",
      }
    )
  }

  //danh muc ke hoach von
  dMHinhThucVanBan(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/81",
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
  dMDonviChuTri(): Observable<any> {
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

  dMKhoanChi(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/129",
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
  dMMucChi(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/135",
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
  dMLoaiChiTX(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/140",
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
  dMMaLoaiBoiDuong(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/172",
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
  dMMaLoaiChiMuc(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/179",
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

  dMThietBi(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/111",
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


  dMMaLoaiKhoan(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/175",
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


  // danh muc vat tu
  dMVatTu(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dm-hang/danh-sach",
      // this.urlDefault + "/qlnv-category/dmuc-khoachvon/147",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //danh muc don vi tinh
  dMDviTinh(): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + "/qlnv-category/dmuc-khoachvon/164",
      this.urlDefault + "/qlnv-category/dmuc-dvi-tinh/danh-sach/tat-ca",
      // {
      //   "paggingReq": {
      //     "limit": 1000,
      //     "page": 1
      //   },
      //   "str": "",
      //   "trangThai": ""
      // }
    );
  }
  //danh muc nhom
  dMNhom(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/155",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //danh muc loai
  dMLoai(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/159",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }
  mDCQQD(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/143",
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

  mDCongTrinh(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/131",
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

  mDChiTiet(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/255",
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
  dMMaNdungChi(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/249",
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

  // lay danh sach cuc khu vuc
  dMDviCon(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-donvi/ds-donvi-child"
    );
  }
  //chung loai
  dMChungLoai(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/462",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }
  // địa điểm kho
  dMDiaDiemKho(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/541",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //nguon hang
  dMNguonHang(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/469",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //hinh thuc
  dMHinhThuc(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/481",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  // danh muc loai quyet dinh giao
  dMLoaiQDGiaoDT(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/421",
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
  // danh muc nhom qd giao du toan
  dMNhomQDGiaoDT(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/425",
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
  // danh muc mat hang giao du toan
  dMMatHangQDGiaoDT(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/429",
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
  // danh muc don vi tinh giao du toan
  dMDviHangQDGiaoDT(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/433",
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

  //danh muc Khoan muc
  dMKhoanMuc(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/503",
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": ""
      }
    );
  }

  //danh muc ke hoach von
  dMLoaiBaoCaoThucHienDuToanChi(): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/525",
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


  dMucBcaoDuyet(): Observable<any> {
    // return this.httpClient.get('http://192.168.1.125:8094/lap-tham-dinh-du-toan/danh-sach-bao-cao-duyet/'
    return this.httpClient.get(this.urlDefault + '/qlnv-khoachphi/lap-tham-dinh-du-toan/danh-sach-bao-cao-duyet/'
    );
  }



  //danh muc ke hoach von (trung vs ma 81)
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


  //linh vuc chi
  linhvucchi(): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-category/dmuc-khoachvon/262',
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": "",
      });
  }

  //lay danh sach don vi nhan
  dmDonViNhan(): Observable<any> {
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
  //lay danh sach quyet dinh BTC 3.2.6
  dmQuyetDinhBTC(): Observable<any> {
    return this.httpClient.get(
      // this.urlDefault + '/qlnv-category/dmuc-khoachvon/341',
      'http://192.168.1.103:8094/qd-giao-phan-bo-dtoan/danh-sach')
  }

  //lấy danh sach các đơn vị thuộc quyền quản lý bởi tổng cục hoặc khu vực ( Tổng cục lấy các khu vực do tổng cục đó quản lý)
  dmDonViThuocQuanLy(request: any): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-category/dmuc-donvi/ds-donvi-child', request);
  }

  // lấy danh sách danh mục vốn phí
  dmGoc(): Observable<any> {
    return this._httpClient.post(this.urlDefault + '/qlnv-category/dmuc-khoachvon/danh-muc-goc',
      {
        "paggingReq": {
          "limit": 1000,
          "page": 1
        },
        "str": "",
        "trangThai": "",
      })
  }
  // Thêm danh mục vốn phí
  addDm(request: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/',
      request,
    );
  }
  // danh sách danh mục con theo danh mục cha
  danhSachDanhMucCon(request: any, id: any): Observable<any> {
    return this.httpClient.post(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/' + id,
      request,
    );
  }
  // Chi tiết danh mục vốn phí
  chiTietDmGoc(id: any): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/chi-tiet/' + id,
    );
  }
  xoaDanhMuc(id: any): Observable<any> {
    return this.httpClient.delete(
      this.urlDefault + '/qlnv-category/dmuc-khoachvon/' + id,
    );
  }

  //danh muc bao cao ket qua thuc hien (bao cao 04a)
  dMNoiDungChi04a(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-chung/danh-sach/NOI_DUNG_CHI04A",
    );
  }

  //danh muc bao cao ket qua thuc hien (bao cao 04b)
  dMNoiDungChi04b(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-chung/danh-sach/NOI_DUNG_CHI04B",
    );
  }

  //danh muc bao cao ket qua thuc hien (bao cao 04b)
  dMNoiDungChi05(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-chung/danh-sach/NOI_DUNG_CHI05",
    );
  }

  //danh muc bao cao ket qua thuc hien (bao cao 04b)
  dMNoiDungPhuLuc1(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-chung/danh-sach/NOI_DUNG_PL1",
    );
  }

  //danh muc bao cao ket qua thuc hien (bao cao 04b)
  dMMaDuAnPhuLuc3(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-chung/danh-sach/MA_DU_AN_PL3",
    );
  }

  //danh mục loại khoản phụ lục 1 điều chỉnh
  dMLoaiKhoanPL1DieuChinh(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-chung/danh-sach/danh-muc-loai-khoan-dieu-chinh-pl1",
    );
  }

  //danh mục nội dung kinh phí phụ lục 1 điều chỉnh
  dMNoiDungKinhPhiPL1DieuChinh(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-chung/danh-sach/danh-muc-noi-dung-kinh-phi-dieu-chinh-pl1",
    );
  }

  //danh muc bao cao ket qua thuc hien (bao cao 04b)
  dMNoiDungPhuLuc2DC(): Observable<any> {
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-chung/danh-sach/NOI_DUNG_PL2_DC",
    );
  }
}

