import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, GDT, LA_MA, Utils } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { GIAO_DU_TOAN, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../giao-du-toan-chi-nsnn.constant';
import { NOI_DUNG } from './nhan-du-toan-chi-NSNN-cho-cac-don-vi.constant';

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
  selector: 'app-nhan-du-toan-chi-NSNN-cho-cac-don-vi',
  templateUrl: './nhan-du-toan-chi-NSNN-cho-cac-don-vi.component.html',
  styleUrls: ['./nhan-du-toan-chi-NSNN-cho-cac-don-vi.component.scss']
})
export class NhanDuToanChiNSNNChoCacDonViComponent implements OnInit {
  //thong tin dang nhap
  id!: any;
  userInfo: any;
  //thong tin chung bao cao
  ngayNhap: string;
  maBaoCao: string;
  soQd: ItemCongVan;
  maDviTao: string;
  maPa: string;
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
  roles: string[] = [];
  //file
  fileDetail: NzUploadFile;
  // khac
  statusBtnNew: boolean;
  userRole: string;
  editMoneyUnit = false;

  constructor(
    private userService: UserService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private spinner: NgxSpinnerService,
    private routerActive: ActivatedRoute,
    private datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private router: Router,
    private notification: NzNotificationService,
    private location: Location,
    private danhMucService: DanhMucHDVService,
    private dataSource: DataService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    this.id = this.routerActive.snapshot.paramMap.get('id');
    this.userInfo = this.userService.getUserLogin();
    this.roles = this.userInfo?.roles;
    this.maDviTao = this.userInfo?.MA_DVI;
    //lay danh sach danh muc
    await this.danhMucService.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          // this.lstDvi = this.donVis.filter(e => e.parent?.maDvi === this.maDviTao);
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    if (this.id) {
      this.getDetailReport();
    }

    this.spinner.hide();
  }

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
    await this.quanLyVonPhiService.QDGiaoChiTiet(this.id, "1").toPromise().then(
      async (data) => {
        if (data.statusCode == 0) {
          this.lstCtietBcao = data.data.lstCtiets;
          this.sortByIndex();
          this.soQd = data.data.soQd;
          this.maPa = data.data.maPa;
          this.maGiao = data.data.maGiao;
          this.namDtoan = data.data.namDtoan;
          this.ngayNhap = this.datepipe.transform(data.data.ngayTao, Utils.FORMAT_DATE_STR);
          this.maDviTao = data.data.maDviNhan;
          this.tenDvi = this.donVis.find(e => e.maDvi == this.maDviTao)?.tenDvi
          this.lstDvi = this.donVis.filter(e => e?.maDviCha === this.maDviTao);
          this.trangThai = this.trangThais.find(e => e.id == data.data.trangThai)?.tenDm;
          this.maDviTien = data.data.maDviTien
          if (data.data.trangThai == '1') {
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
    this.router.navigate([
      MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN,
    ]);
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

  sortByIndex() {
    this.setDetail();
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


  getStatusName() {
    return this.trangThais.find(e => e.id == this.trangThai)?.tenDm;
  }

  checkAddReport() {
    return this.roles.includes(GDT.GIAO_PA_PBDT);
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
    this.quanLyVonPhiService.trinhDuyetPhuongAnGiao(request).toPromise().then(
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
    const maPaCha = this.maPa
    let maPa
    await this.quanLyVonPhiService.maPhuongAnGiao(this.maLoai).toPromise().then(
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
      maPaCha: maPaCha,
      namPa: this.namDtoan,
      maPhanGiao: "2",
      maLoaiDan: '1',
      trangThai: "1",
      thuyetMinh: "",
      idPaBTC: this.id
    };

    const request2 = {
      id: null,
      fileDinhKems: [],
      listIdDeleteFiles: [],
      lstCtiets: lstCtietBcaoTemp,
      maDvi: this.maDviTao,
      maDviTien: this.maDviTien,
      maPa: maPa,
      maPaCha: maPaCha,
      namPa: this.namDtoan,
      maPhanGiao: "2",
      maLoaiDan: '2',
      trangThai: "1",
      thuyetMinh: "",
      idPaBTC: this.id
    };

    if (loaiPa) {
      if (loaiPa === 1) {
        this.dataSource.changeData(request1),
          this.router.navigate([
            MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi',
          ])
        return
      }

      if (loaiPa === 2) {
        this.dataSource.changeData(request2),
          this.router.navigate([
            MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi',
          ])
        return
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
