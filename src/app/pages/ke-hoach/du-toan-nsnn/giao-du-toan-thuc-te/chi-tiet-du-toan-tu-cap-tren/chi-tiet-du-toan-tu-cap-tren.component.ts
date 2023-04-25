import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { displayNumber, exchangeMoney } from 'src/app/Utility/func';
import { DON_VI_TIEN, GDT, LA_MA, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { NOI_DUNG } from '../tao-moi-quyet-dinh-btc/tao-moi-quyet-dinh-btc.constant';
// import { GIAO_DU_TOAN, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../giao-du-toan-chi-nsnn.constant';
// import { NOI_DUNG } from './nhan-du-toan-chi-NSNN-cho-cac-don-vi.constant';

export class ItemData {
  id!: any;
  stt: any;
  level: number;
  maNdung: number;
  soTien: number;
  nguonNsnn: number;
  nguonKhac: number;
  checked!: boolean;
}

export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}

export const TRANG_THAI_GIAO_DU_TOAN = [
  {
    id: '0',
    tenDm: "Chưa giao",
  },
  {
    id: '1',
    tenDm: "Mới",
  },
  {
    id: '2',
    tenDm: "Đã nhận",
  },
]
@Component({
  selector: 'app-chi-tiet-du-toan-tu-cap-tren',
  templateUrl: './chi-tiet-du-toan-tu-cap-tren.component.html',
  styleUrls: ['./chi-tiet-du-toan-tu-cap-tren.component.scss']
})
export class ChiTietDuToanTuCapTrenComponent implements OnInit {
  @Input() data;
  @Output() dataChange = new EventEmitter();

  //thong tin dang nhap
  id!: any;
  userInfo: any;
  //thong tin chung bao cao
  ngayNhap: string;
  maBaoCao: string;
  soQd: ItemCongVan;
  maDviTao: string;
  maPa: string;
  maPaCha: string;
  maGiao: string;
  trangThai: string;
  namDtoan: number;
  maDviTien: any = "1";
  newDate = new Date();
  tenDvi: string;
  maLoai = '2';
  //danh muc
  lstDvi: any[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  lstCtietBcao: ItemData[] = [];
  donVis: any[] = [];
  trangThais: any[] = TRANG_THAI_GIAO_DU_TOAN;
  noiDungs: any[] = NOI_DUNG;
  soLaMa: any[] = LA_MA;
  //file
  fileDetail: NzUploadFile;
  // khac
  statusBtnNew: boolean;
  editMoneyUnit = false;
  isDataAvailable = false;
  isStatus: any;
  status = false;

  constructor(
    private userService: UserService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private giaoDuToanChiService: GiaoDuToanChiService,
    private spinner: NgxSpinnerService,
    private routerActive: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private router: Router,
    private notification: NzNotificationService,
    private location: Location,
    private danhMucService: DanhMucHDVService,
    private dataSource: DataService,
    public globals: Globals,
  ) { }

  ngOnInit() {
    this.action('init');
  };

  async action(code: string) {
    this.spinner.show();
    this.isDataAvailable = false;
    switch (code) {
      case 'init':
        await this.initialization().then(() => {
          this.isDataAvailable = true;
        });
        break;
      case 'save':
        await this.save().then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'detail':
        await this.getDetailReport().then(() => {
          this.isDataAvailable = true;
        });
        break;
      default:
        break;
    }
    this.spinner.hide();
  };

  back() {
    let preTab = localStorage.getItem('preTab');
    const obj = {
      tabSelected: preTab,
    }
    this.dataChange.emit(obj);
    localStorage.removeItem('preTab');
  };

  async initialization() {
    this.spinner.show();
    localStorage.setItem("preTab", "dsGiaoTuCapTren")
    this.id = this.data.id;
    await this.userService.getUserLogin();
    this.userInfo = this.userService.getUserLogin();
    this.maDviTao = this.userInfo?.MA_DVI;
    console.log(this.userInfo)
    //lay danh sach danh muc
    // await this.danhMucService.dMDonVi().toPromise().then(
    //   data => {
    //     if (data.statusCode == 0) {
    //       this.donVis = data.data;
    //       // this.lstDvi = this.donVis.filter(e => e.parent?.maDvi === this.maDviTao);
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //     }
    //   },
    //   err => {
    //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //   }
    // );
    if (this.id) {
      this.getDetailReport();
    }
    await this.getChildUnit();
    this.sortByIndex()
    this.spinner.hide();
  };

  async getChildUnit() {
    this.spinner.show();
    const request = {
      maDviCha: this.maDviTao,
      trangThai: '01',
    }
    await this.quanLyVonPhiService.dmDviCon(request).toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.lstDvi = data.data;
          this.lstDvi = this.lstDvi.filter(e => e.tenVietTat && (e.tenVietTat.includes("CDT") || e.tenVietTat.includes("CNTT") || e.tenVietTat.includes("_VP")))
          console.log(this.lstDvi);
          // if ((this.userInfo.DON_VI.tenVietTat.includes("CDT") || this.userInfo.DON_VI.tenVietTat.includes("CNTT") || this.userInfo.DON_VI.tenVietTat.includes("_VP")) && this.isStatus == "2") {
          //   this.lstDvi.push(
          //     {
          //       tenDvi: this.userInfo.TEN_DVI,
          //       maDvi: this.userInfo.MA_DVI
          //     }
          //   )
          // }
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    )
    this.spinner.hide();
  }

  statusClass() {
    if (Utils.statusSave.includes(this.isStatus)) {
      return 'du-thao-va-lanh-dao-duyet';
    } else {
      return 'da-ban-hanh';
    }
  };


  //get user info
  async getUserInfo(username: string) {
    await this.userService.getUserInfo(username).toPromise().then(
      (data) => {
        if (data?.statusCode == 0) {
          this.userInfo = data?.data
          return data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  //download file về máy tính
  async downloadFileCv() {
    if (this.soQd?.fileUrl) {
      await this.quanLyVonPhiService.downloadFile(this.soQd?.fileUrl).toPromise().then(
        (data) => {
          fileSaver.saveAs(data, this.soQd?.fileName);
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      const file: any = this.fileDetail;
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  }

  // call chi tiet bao cao
  async getDetailReport() {
    this.spinner.show();
    await this.giaoDuToanChiService.QDGiaoChiTiet(this.id, "1").toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          console.log(data.data);

          this.lstCtietBcao = data.data.lstCtiets;
          this.sortByIndex();
          this.soQd = data.data.soQd;
          this.maPa = data.data.maPa;
          this.maPaCha = data.data.maPaCha
          this.maGiao = data.data.maGiao;
          this.namDtoan = data.data.namDtoan;
          this.ngayNhap = this.datepipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
          this.maDviTao = data.data.maDviNhan;
          this.tenDvi = this.donVis.find(e => e.maDvi == this.maDviTao)?.tenDvi
          // this.lstDvi = this.donVis.filter(e => e?.maDviCha === this.maDviTao);
          // this.isStatus = this.trangThais.find(e => e.id == data.data.trangThai)?.tenDm;
          this.isStatus = data.data.trangThai
          this.maDviTien = data.data.maDviTien
          if (data.data.trangThai == '1' || this.userInfo.CAP_DVI == '3') {
            this.statusBtnNew = true;
          }
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    this.spinner.hide();
  }

  redirectkehoachvonphi() {
    const obj = {
      tabSelected: 'giaodutoan',
    }
    this.dataSource.changeData(obj);
    // this.router.navigate([
    //   MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN,
    // ]);
    // this.location.back()
  }


  // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
  getChiMuc(str: string): string {
    str = str.substring(str.indexOf('.') + 1, str.length);
    let xau = "";
    const chiSo: any = str.split('.');
    const n: number = chiSo.length - 1;
    let k: number = parseInt(chiSo[n], 10);
    if (n == 0) {
      for (let i = 0; i < this.soLaMa.length; i++) {
        while (k >= this.soLaMa[i].gTri) {
          xau += this.soLaMa[i].kyTu;
          k -= this.soLaMa[i].gTri;
        }
      }
    }
    if (n == 1) {
      xau = chiSo[n];
    }
    if (n == 2) {
      xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    }
    if (n == 3) {
      xau = String.fromCharCode(k + 96);
    }
    if (n == 4) {
      xau = "-";
    }
    return xau;
  }

  // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
  getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
  }
  // lấy phần đuôi của stt
  getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
  }

  setLevel() {
    this.lstCtietBcao.forEach(item => {
      const str: string[] = item.stt.split('.');
      item.level = str.length - 2;
    })
  }

  sortByIndex() {
    this.setLevel();
    this.lstCtietBcao.sort((item1, item2) => {
      if (item1.level > item2.level) {
        return 1;
      }
      if (item1.level < item2.level) {
        return -1;
      }
      if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
        return -1;
      }
      if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
        return 1;
      }
      return 0;
    });
    const lstTemp: any[] = [];
    this.lstCtietBcao.forEach(item => {
      const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
      if (index == -1) {
        lstTemp.splice(0, 0, item);
      } else {
        lstTemp.splice(index + 1, 0, item);
      }
    })

    this.lstCtietBcao = lstTemp;
  }

  setDetail() {
    this.lstCtietBcao.forEach(item => {
      item.level = this.noiDungs.find(e => e.id == item.maNdung)?.level;
    })
  }


  //lay ten don vi tạo
  getUnitName() {
    return this.donVis.find((item) => item.maDvi == this.maDviTao)?.tenDvi;
  }


  getStatusName(status: string) {
    return this.trangThais.find(e => e.id == status)?.tenDm;
  };

  checkAddReport() {
    return this.userService.isAccessPermisson(GDT.ADD_REPORT_PA_PBDT);
  }
  checkTiepNhan() {
    return this.userService.isAccessPermisson(GDT.NHAN_PA_PBDT)
  }
  // luu
  async save() {
    const request = {
      id: this.id,
      lyDoTuChoi: null,
      maChucNang: "2",
      maLoai: "1"
    };
    this.spinner.show();
    this.giaoDuToanChiService.trinhDuyetPhuongAnGiao(request).toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          await this.getDetailReport();
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    this.statusBtnNew = false;
    this.spinner.hide();
  }

  async taoMoiPhuongAn(loaiPa) {
    const listCtietDvi: any[] = [];

    let maPa
    await this.giaoDuToanChiService.maPhuongAnGiao(this.maLoai).toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          maPa = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
          return;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        return;
      },
    );

    this.lstDvi.forEach(item => {
      listCtietDvi.push({
        id: uuid.v4() + 'FE',
        maDviNhan: item.maDvi,
        soTranChi: 0,
      })
    })

    if ((this.userInfo.DON_VI.tenVietTat.includes("CDT") || this.userInfo.DON_VI.tenVietTat.includes("CNTT") || this.userInfo.DON_VI.tenVietTat.includes("_VP")) && this.isStatus == "2") {
      listCtietDvi.push({
        id: uuid.v4() + 'FE',
        maDviNhan: this.userInfo.MA_DVI,
        soTranChi: 0,
      })
    }

    const lstCtietBcaoTemp: any[] = [];
    // gui du lieu trinh duyet len server
    this.lstCtietBcao.forEach(item => {
      lstCtietBcaoTemp.push({
        ...item,
        tongCong: item.soTien,
        nguonNsnn: item.nguonNsnn,
        nguonKhac: item.nguonKhac,
        lstCtietDvis: listCtietDvi,
        id: uuid.v4() + 'FE',
      })
    })
    const request1 = {
      id: null,
      fileDinhKems: [],
      listIdDeleteFiles: [],
      lstCtiets: lstCtietBcaoTemp,
      maDvi: this.maDviTao,
      maDviTien: this.maDviTien,
      maPa: maPa,
      maPaCha: this.maPaCha,
      namPa: this.namDtoan,
      maPhanGiao: "2",
      maLoaiDan: '1',
      trangThai: "1",
      thuyetMinh: "",
      idPaBTC: this.id,
      tabSelected: 'phuongAnGiaoDuToan',
    };

    const request2 = {
      id: null,
      fileDinhKems: [],
      listIdDeleteFiles: [],
      lstCtiets: lstCtietBcaoTemp,
      maDvi: this.maDviTao,
      maDviTien: this.maDviTien,
      maPa: maPa,
      maPaCha: this.maPaCha,
      namPa: this.namDtoan,
      maPhanGiao: "2",
      maLoaiDan: '2',
      trangThai: "1",
      thuyetMinh: "",
      idPaBTC: this.id,
      tabSelected: 'phuongAnGiaoDieuChinh',
    };

    if (loaiPa) {
      if (loaiPa === 1) {
        this.dataChange.emit(request1);
      }

      if (loaiPa === 2) {
        this.dataChange.emit(request2);
      }
    }
  };

  async taoMoiBaoCao(loaiPa) {
    const listCtietDvi: any[] = [];
    let maBcao
    await this.giaoDuToanChiService.SinhMaBaoCao().toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          maBcao = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
          return;
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        return;
      },
    );


    // this.lstDvi.forEach(item => {
    // })
    listCtietDvi.push({
      id: uuid.v4() + 'FE',
      maDviNhan: this.userInfo.MA_DVI,
      soTranChi: 0,
    })

    const lstCtietBcaoTemp: any[] = [];
    // gui du lieu trinh duyet len server
    this.lstCtietBcao.forEach(item => {
      lstCtietBcaoTemp.push({
        ...item,
        dtoanGiao: item.soTien,
        nguonNsnn: item.nguonNsnn,
        nguonKhac: item.nguonKhac,
        tongCong: item.soTien,
        lstCtietDvis: listCtietDvi,
        id: uuid.v4() + 'FE',
      })
    })
    const request1 = {
      id: null,
      fileDinhKems: [],
      listIdDeleteFiles: [],
      lstCtiets: lstCtietBcaoTemp,
      lstCtiets1: lstCtietBcaoTemp,
      maDvi: this.maDviTao,
      maDviTien: this.maDviTien,
      maBcao: maBcao,
      maPa: this.maPa,
      maPaCha: this.maPaCha,
      namPa: this.namDtoan,
      soQd: this.soQd,
      maPhanGiao: "2",
      maLoaiDan: '1',
      trangThai: "1",
      thuyetMinh: "",
      idPaBTC: this.id,
      tabSelected: 'addBaoCao',
    };

    const request2 = {
      id: null,
      fileDinhKems: [],
      listIdDeleteFiles: [],
      lstCtiets: lstCtietBcaoTemp,
      lstCtiets1: lstCtietBcaoTemp,
      maDvi: this.maDviTao,
      maDviTien: this.maDviTien,
      maBcao: maBcao,
      maPa: this.maPa,
      maPaCha: this.maPaCha,
      namPa: this.namDtoan,
      soQd: this.soQd,
      maPhanGiao: "2",
      maLoaiDan: '2',
      trangThai: "1",
      thuyetMinh: "",
      idPaBTC: this.id,
      tabSelected: 'addBaoCao',
    };

    if (loaiPa) {
      if (loaiPa === 1) {
        localStorage.setItem("idChiTiet", this.id);
        this.dataChange.emit(request1);
      }

      if (loaiPa === 2) {
        localStorage.setItem("idChiTiet", this.id);
        this.dataChange.emit(request2);
      }
    }
  };



  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  }

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  }
}

