import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { OldResponseData } from '../interfaces/response';


@Injectable({
  providedIn: 'root',
})
export class DanhMucService extends BaseService {
  constructor(public httpClient: HttpClient) {
    super(httpClient, 'danhMuc');
  }

  urlDefault = environment.SERVICE_API;

  //get list danh muc loai bao cao
  dMLoaiBaoCao(): Observable<any>{
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
  dMDonVi(): Observable<any>{
    return this.httpClient.get(
      this.urlDefault + "/qlnv-category/dmuc-donvi/danh-sach/tat-ca",
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


  //danh muc chi tieu

  dmchitieu(): Observable<any> {
    return this.httpClient.post(this.urlDefault + '/qlnv-category/dmuc-khoachvon/111', {
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": "",
      "trangThai": "",
    });
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
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/147",
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
    return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/164",
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
dMMaCucDtnnKvucs(): Observable<any> {
  return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/244",
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

dMTrangThai(): Observable<any> {
  return this.httpClient.post(
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/382",
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
    dMCucKhuVuc():Observable<any>{
      return this.httpClient.post(
          this.urlDefault  + "/qlnv-category/dmuc-donvi/ds-donvi-child",
          {
                  capDvi: "2",
                  kieuDvi: null,
                  loaiDvi: null,
                  maDvi: "0",
                  maPhuong: null,
                  maQuan: null,
                  maTinh: null,
                  paggingReq: {
                    "limit": 20,
                    "page": 1
                  },
                  str: "string",
                  tenDvi: "string",
                  trangThai: "00"
          }
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
      this.urlDefault + "/qlnv-category/dmuc-khoachvon/465",
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
}
