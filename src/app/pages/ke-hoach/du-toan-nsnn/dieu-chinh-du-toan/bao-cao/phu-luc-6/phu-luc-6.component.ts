import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
// import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';

import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, NOT_OK, OK } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { DialogThemKhoanMucComponent } from '../../dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { LINH_VUC } from './phu-luc6.constant';

export class ItemData {

  id: any;
  stt: string;
  level: number;
  loaiMatHang: number;
  maDviTinh: number;
  maVtu: string;
  loaiDmuc: string;

  slHangTte: number;
  kphiDmuc: number;
  kphiTtien: number;
  cphiTcong: number;
  cphiNtruoc: number;
  cphiNnay: number;
  chenhLech: number;
  kphiQtoan: number;
  kphiChuaQtoanCong: number;
  kphiChuaQtoanKpTkiem: number;
  kphiChuaQtoanKpTchi: number;
  dtoan2021ThanhQtoan2020: number;
  soChuaQtoan: number;
  checked!: boolean;
  idDm: number;
}

@Component({
  selector: 'app-phu-luc-6',
  templateUrl: './phu-luc-6.component.html',
})
export class PhuLuc6Component implements OnInit {
  @Input() data;
  @Output() dataChange = new EventEmitter();
  //danh muc
  donVis: any = [];
  // lstMatHang: any[] = LINH_VUC;
  lstMatHang: any[] = [];
  donViTinhs: any[] = [];
  lstCtietBcao: ItemData[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  soLaMa: any[] = LA_MA;

  //thong tin chung
  id: any;
  namBcao: number;
  maBieuMau: string;
  thuyetMinh: string;
  maDviTien: string;
  listIdDelete = "";
  trangThaiPhuLuc = '1';
  initItem: ItemData = {
    idDm: null,
    id: null,
    stt: "0",
    level: 0,
    maVtu: "",
    loaiDmuc: "",
    loaiMatHang: 0,
    maDviTinh: null,
    slHangTte: null,
    kphiDmuc: null,
    kphiTtien: null,
    cphiTcong: null,
    cphiNtruoc: null,
    cphiNnay: null,
    chenhLech: null,
    kphiQtoan: null,
    kphiChuaQtoanCong: null,
    kphiChuaQtoanKpTkiem: null,
    kphiChuaQtoanKpTchi: null,
    dtoan2021ThanhQtoan2020: null,
    soChuaQtoan: null,
    checked: false,
  };
  total: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    idDm: null,
    maVtu: "",
    loaiDmuc: "",
    loaiMatHang: 0,
    maDviTinh: null,
    slHangTte: null,
    kphiDmuc: null,
    kphiTtien: null,
    cphiTcong: null,
    cphiNtruoc: null,
    cphiNnay: null,
    chenhLech: null,
    kphiQtoan: null,
    kphiChuaQtoanCong: null,
    kphiChuaQtoanKpTkiem: null,
    kphiChuaQtoanKpTchi: null,
    dtoan2021ThanhQtoan2020: null,
    soChuaQtoan: null,
    checked: false,
  };
  //trang thai cac nut
  status = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  dsDinhMucN: any[] = [];
  dsDinhMucX: any[] = [];
  maDviTao!: string;
  listVatTu: any[] = [];
  listVatTuFull: any[] = [];

  listVatTuNhap: any[] = [
    {
      id: "1000",
      tenDm: "Nhập",
      maCha: "111",
      level: 1,
      maVtu: "1000",
      maDviTinh: "",
      loaiDmuc: "nhap"
    },
  ]

  listVatTuXuat: any[] = [
    {
      id: "2000",
      tenDm: "Xuất bán",
      maCha: "111",
      level: 1,
      maVtu: "2000",
      maDviTinh: "",
      loaiDmuc: "xuat"
    },
  ]

  listVatTuVTCT: any[] = [
    {
      id: "3000",
      tenDm: "VTCT",
      maCha: "111",
      level: 1,
      maVtu: "3000",
      maDviTinh: "",
      loaiDmuc: ""
    },
  ]

  allChecked = false;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  editMoneyUnit = false;
  isDataAvailable = false;


  constructor(private router: Router,
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
    private location: Location,
    private fb: FormBuilder,
    private modal: NzModalService,
  ) {
  }

  async ngOnInit() {
    this.initialization().then(() => {
      this.isDataAvailable = true;
    })
  };

  async initialization() {
    this.spinner.show();
    this.id = this.data?.id;
    this.maBieuMau = this.data?.maBieuMau;
    this.maDviTien = "1";
    this.thuyetMinh = this.data?.thuyetMinh;
    this.trangThaiPhuLuc = this.data?.trangThai;
    this.namBcao = this.data?.namHienHanh;
    this.status = this.data?.status;
    this.statusBtnFinish = this.data?.statusBtnFinish;
    this.maDviTao = this.data?.maDviTao;
    await this.getDinhMucPL6N();
    await this.getDinhMucPL6X();
    await this.getListVtu()
    await this.addListVatTu()
    this.data?.lstCtietDchinh.forEach(item => {
      this.lstCtietBcao.push({
        ...item,
      })
    })
    this.data?.lstCtietDchinh.forEach(item => {
      this.dsDinhMucN.forEach(itm => {
        if (itm.id = item.maNdung) {
          item.kphiDmuc = itm.thienDinhMuc
        }
      })
    })
    this.data?.lstCtietDchinh.forEach(item => {
      this.dsDinhMucX.forEach(itm => {
        if (itm.id = item.maNdung) {
          item.kphiDmuc = itm.thienDinhMuc
        }
      })
    })
    if (this.lstCtietBcao.length > 0) {
      if (!this.lstCtietBcao[0].stt) {
        this.sortWithoutIndex();
      } else {
        this.sortByIndex();
      }
    }
    this.getTotal();
    this.updateEditCache();

    //lay danh sach danh muc don vi
    await this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    await this.danhMucService.dMDviTinh().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donViTinhs = data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );


    this.changeNam();
    this.tinhToan();
    this.getStatusButton();

    this.spinner.hide();
  }

  async getListVtu() {
    //lay danh sach vat tu
    await this.danhMucService.dMVatTu().toPromise().then(res => {
      if (res.statusCode == 0) {
        this.listVatTu = res.data;

      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
  };


  async addListVatTu() {
    const lstVtuCon1 = []
    const lstVtuCon2 = []

    const lstVtuCon3 = []
    const lstVtuCon4 = []

    const lstVtuCon5 = []
    const lstVtuCon6 = []

    this.listVatTu.forEach(vtu => {
      this.listVatTuNhap.push({
        id: vtu.ma,
        maVtu: vtu.ma,
        tenDm: vtu.ten,
        maDviTinh: vtu.maDviTinh,
        maCha: '1000',
        level: Number(vtu.cap) + 1,
        loaiDmuc: "nhap"
      });

      vtu?.child.forEach(vtuCon => {
        const maCha = vtuCon?.ma.slice(0, -2)
        lstVtuCon1.push({
          id: vtuCon.ma,
          maVtu: vtuCon.ma,
          tenDm: vtuCon.ten,
          maDviTinh: vtuCon.maDviTinh,
          maCha: maCha,
          level: Number(vtuCon.cap) + 1,
          loaiDmuc: "nhap"
        })

        vtuCon?.child.forEach(vtuConn => {
          const maCha = vtuConn?.ma.slice(0, -2)
          lstVtuCon2.push({
            id: vtuConn.ma,
            maVtu: vtuConn.ma,
            tenDm: vtuConn.ten,
            maDviTinh: vtuConn.maDviTinh,
            maCha: maCha,
            level: Number(vtuConn.cap) + 1,
            loaiDmuc: "nhap"
          })
        })
      })
    })
    const mangGop12 = lstVtuCon1.concat(lstVtuCon2)
    this.listVatTuNhap = this.listVatTuNhap.concat(mangGop12)

    // lst xuat
    this.listVatTu.forEach(vtu => {
      this.listVatTuXuat.push({
        id: vtu.ma + 1,
        maVtu: vtu.ma,
        tenDm: vtu.ten,
        maDviTinh: vtu.maDviTinh,
        maCha: '2000',
        level: Number(vtu.cap) + 1,
        loaiDmuc: "xuat"
      });

      vtu?.child.forEach(vtuCon => {
        const maCha = vtuCon?.ma.slice(0, -2) + 1
        lstVtuCon3.push({
          id: vtuCon.ma + 1,
          maVtu: vtuCon.ma,
          tenDm: vtuCon.ten,
          maDviTinh: vtuCon.maDviTinh,
          maCha: maCha,
          level: Number(vtuCon.cap) + 1,
          loaiDmuc: "xuat"
        })

        vtuCon?.child.forEach(vtuConn => {
          const maCha = vtuConn?.ma.slice(0, -2) + 1
          lstVtuCon4.push({
            id: vtuConn.ma + 1,
            maVtu: vtuConn.ma,
            tenDm: vtuConn.ten,
            maDviTinh: vtuConn.maDviTinh,
            maCha: maCha,
            level: Number(vtuConn.cap) + 1,
            loaiDmuc: "xuat"
          })
        })
      })
    })

    const mangGop34 = lstVtuCon3.concat(lstVtuCon4)
    this.listVatTuXuat = this.listVatTuXuat.concat(mangGop34)

    // lst VTCT
    this.listVatTu.forEach(vtu => {
      this.listVatTuVTCT.push({
        id: vtu.ma + 2,
        maVtu: vtu.ma,
        tenDm: vtu.ten,
        maDviTinh: vtu.maDviTinh,
        maCha: '3000',
        level: Number(vtu.cap) + 1,
        loaiDmuc: "",
      });

      vtu?.child.forEach(vtuCon => {
        const maCha = vtuCon?.ma.slice(0, -2) + 2
        lstVtuCon5.push({
          id: vtuCon.ma + 2,
          maVtu: vtuCon.ma,
          tenDm: vtuCon.ten,
          maDviTinh: vtuCon.maDviTinh,
          maCha: maCha,
          level: Number(vtuCon.cap) + 1,
          loaiDmuc: "",
        })

        vtuCon?.child.forEach(vtuConn => {
          const maCha = vtuConn?.ma.slice(0, -2) + 2
          lstVtuCon6.push({
            id: vtuConn.ma + 2,
            maVtu: vtuConn.ma,
            tenDm: vtuConn.ten,
            maDviTinh: vtuConn.maDviTinh,
            maCha: maCha,
            level: Number(vtuConn.cap) + 1,
            loaiDmuc: "",
          })
        })
      })
    })

    const mangGop56 = lstVtuCon5.concat(lstVtuCon6)
    this.listVatTuVTCT = this.listVatTuVTCT.concat(mangGop56)



    this.listVatTuFull = this.listVatTuNhap.concat(this.listVatTuXuat)
    this.listVatTuFull = this.listVatTuFull.concat(this.listVatTuVTCT)
    this.listVatTuFull.push(
      {
        id: "111",
        tenDm: "Tổng cộng năm",
        maCha: 0,
        level: 0,
        maVtu: "800",
      },
      {
        id: "2",
        tenDm: "Thiếu năm chuyển sang",
        maCha: 0,
        level: 0,
        maVtu: "107",
      },
      {
        id: "21",
        tenDm: "VTCT Thiếu năm chuyển sang",
        idCha: "2",
        level: 1,
        maVtu: "108",
      },
      {
        id: "22",
        tenDm: "Nhập thiếu chuyển sang",
        idCha: "2",
        level: 1,
        maVtu: "109",
      },
      {
        id: "23",
        tenDm: "Xuất thiếu chuyển sang",
        idCha: "2",
        level: 1,
        maVtu: "120",
      },
    )
    this.listVatTuFull.forEach(item => {
      if (item.level.length == 2) {
        item.level = item.level.slice(0, -1)
      }
    })
    // gan lai noi dung
    this.lstMatHang = this.listVatTuFull;
  }

  getDinhMucPL6N() {
    const request = {
      loaiDinhMuc: '01',
      maDvi: this.maDviTao,
    }
    this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
      res => {
        if (res.statusCode == 0) {
          this.dsDinhMucN = res.data;
          this.dsDinhMucN.forEach(item => {
            if (!item.loaiVthh.startsWith('02')) {
              item.tongDmuc = divNumber(item.tongDmuc, 1000);
            }
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    )
  }
  getDinhMucPL6X() {
    const request = {
      loaiDinhMuc: '02',
      maDvi: this.maDviTao,
    }
    this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
      res => {
        if (res.statusCode == 0) {
          this.dsDinhMucX = res.data;
          this.dsDinhMucX.forEach(item => {
            if (!item.loaiVthh.startsWith('02')) {
              item.tongDmuc = divNumber(item.tongDmuc, 1000);
            }
          })
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    )
  }

  changeNam() {
    const a = LINH_VUC.find(el => el.tenDm.includes("Tổng cộng năm"))
    a.tenDm = "Tổng cộng năm " + this.namBcao
    const b = LINH_VUC.find(el => el.id == 2)
    b.tenDm = "Thiếu năm " + (this.namBcao - 1) + " chuyển sang " + this.namBcao
    const b1 = LINH_VUC.find(el => el.id == 21)
    b1.tenDm = "VTCT thiếu năm " + (this.namBcao - 1) + " chuyển sang " + this.namBcao
    const b2 = LINH_VUC.find(el => el.id == 22)
    b2.tenDm = "Nhập thiếu " + (this.namBcao - 1) + " chuyển sang " + this.namBcao
    const b3 = LINH_VUC.find(el => el.id == 23)
    b3.tenDm = "Xuất thiếu " + (this.namBcao - 1) + " chuyển sang " + this.namBcao
  }

  getStatusButton() {
    if (this.data?.statusBtnOk && (this.trangThaiPhuLuc == "2" || this.trangThaiPhuLuc == "5")) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }
  }

  // luu
  async save(trangThai: string) {
    let checkSaveEdit;
    if (!this.maDviTien) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    //check xem tat ca cac dong du lieu da luu chua?
    //chua luu thi bao loi, luu roi thi cho di
    this.lstCtietBcao.forEach(element => {
      if (this.editCache[element.id].edit === true) {
        checkSaveEdit = false
      }
    });
    if (checkSaveEdit == false) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
    //tinh lai don vi tien va kiem tra gioi han cua chung
    const lstCtietBcaoTemp: any = [];
    let checkMoneyRange = true;
    this.lstCtietBcao.forEach(item => {
      if (
        item.kphiDmuc > MONEY_LIMIT ||
        item.kphiTtien > MONEY_LIMIT ||
        item.cphiTcong > MONEY_LIMIT ||
        item.cphiNtruoc > MONEY_LIMIT ||
        item.cphiNnay > MONEY_LIMIT ||
        item.chenhLech > MONEY_LIMIT ||
        item.kphiQtoan > MONEY_LIMIT ||
        item.kphiChuaQtoanCong > MONEY_LIMIT ||
        item.kphiChuaQtoanKpTchi > MONEY_LIMIT ||
        item.kphiChuaQtoanKpTkiem > MONEY_LIMIT ||
        item.soChuaQtoan > MONEY_LIMIT ||
        item.dtoan2021ThanhQtoan2020 > MONEY_LIMIT
      ) {
        checkMoneyRange = false;
        return;
      }
      lstCtietBcaoTemp.push({
        ...item,
      })
    })

    if (!checkMoneyRange == true) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
      return;
    }
    // replace nhung ban ghi dc them moi id thanh null
    lstCtietBcaoTemp.forEach(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
    })
    const request = {
      id: this.id,
      lstCtietDchinh: lstCtietBcaoTemp,
      maBieuMau: this.maBieuMau,
      maDviTien: this.maDviTien,
      giaoCho: this.data?.giaoCho,
      lyDoTuChoi: this.data?.lyDoTuChoi,
      thuyetMinh: this.thuyetMinh,
      trangThai: trangThai,
      maLoai: this.data?.maLoai,
    };
    this.quanLyVonPhiService.updatePLDieuChinh(request).toPromise().then(
      async data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          // const obj = {
          //   trangThai: '-1',
          //   lyDoTuChoi: null,
          // };
          this.dataChange.emit(data.data);
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );

    this.spinner.hide();
  }

  //show popup tu choi dùng cho nut ok - not ok
  async pheDuyetChiTiet(mcn: string) {
    this.spinner.show();
    if (mcn == OK) {
      await this.onSubmit(mcn, null);
    } else if (mcn == NOT_OK) {
      const modalTuChoi = this.modal.create({
        nzTitle: 'Not OK',
        nzContent: DialogTuChoiComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: '900px',
        nzFooter: null,
        nzComponentParams: {},
      });
      modalTuChoi.afterClose.toPromise().then(async (text) => {
        if (text) {
          await this.onSubmit(mcn, text);
        }
      });
    }
    this.spinner.hide();
  }

  // chuc nang check role
  async onSubmit(mcn: string, lyDoTuChoi: string) {
    if (this.id) {
      const requestGroupButtons = {
        id: this.id,
        trangThai: mcn,
        lyDoTuChoi: lyDoTuChoi,
      };
      this.spinner.show();
      await this.quanLyVonPhiService.approveDieuChinhPheDuyet(requestGroupButtons).toPromise().then(async (data) => {
        if (data.statusCode == 0) {
          this.trangThaiPhuLuc = mcn;
          this.getStatusButton();
          // const obj = {
          //   trangThai: mcn,
          //   lyDoTuChoi: lyDoTuChoi,
          // }
          this.dataChange.emit(data.data);
          if (mcn == '0') {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
          }
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      }, err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
      this.spinner.hide();
    } else {
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
    }
  }

  //show popup tu choi
  tuChoi(mcn: string) {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Từ chối',
      nzContent: DialogTuChoiComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (text) => {
      if (text) {
        this.onSubmit(mcn, text);
      }
    });
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
    };
    // if (n == 3) {
    //   xau = String.fromCharCode(k + 96);
    // }
    if (n == 3) {
      xau = "-";
    }
    if (n == 4) {
      xau = "+";
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
  //tìm vị trí cần để thêm mới
  findVt(str: string): number {
    const start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
    let index: number = start;
    for (let i = start + 1; i < this.lstCtietBcao.length; i++) {
      if (this.lstCtietBcao[i].stt.startsWith(str)) {
        index = i;
      }
    }
    return index;
  }
  //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
  replaceIndex(lstIndex: number[], heSo: number) {
    if (heSo == -1) {
      lstIndex.reverse();
    }
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
      const str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
      const nho = this.lstCtietBcao[item].stt;
      this.lstCtietBcao.forEach(item => {
        item.stt.replace(nho, str);
      })
    })
  }
  //thêm ngang cấp
  addSame(id: any, initItem: ItemData) {
    const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    const tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
    const ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    const lstIndex: number[] = [];
    for (let i = this.lstCtietBcao.length - 1; i > ind; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, 1);
    let dm: number;
    this.dsDinhMucN.forEach(itm => {
      if (itm.cloaiVthh == initItem.maVtu && initItem.loaiDmuc == "nhap") {
        //  dm = (parseInt(itm.nvuCmon, 10) + parseInt(itm.cucDhanh, 10) + parseInt(itm.ttoanCnhan, 10))
        dm = itm.tongDmuc;
      }
    })
    this.dsDinhMucX.forEach(itm => {
      if (itm.cloaiVthh == initItem.maVtu && initItem.loaiDmuc == "xuat") {
        //  dm = (parseInt(itm.nvuCmon, 10) + parseInt(itm.cucDhanh, 10) + parseInt(itm.ttoanCnhan, 10))
        dm = itm.tongDmuc;
      }
    })
    // them moi phan tu
    if (initItem?.id) {
      const item: ItemData = {
        ...initItem,
        stt: head + "." + (tail + 1).toString(),
        kphiDmuc: dm != 0 ? dm : null,
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      const item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: head + "." + (tail + 1).toString(),
        kphiDmuc: dm != 0 ? dm : null,
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }

  // gan editCache.data == lstCtietBcao
  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }
  //thêm cấp thấp hơn
  addLow(id: any, initItem: ItemData) {
    const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    let index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    let stt: string;
    if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
      stt = data.stt + '.1';
    } else {
      index = this.findVt(data.stt);
      for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
        if (this.getHead(this.lstCtietBcao[i].stt) == data.stt) {
          stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
          break;
        }
      }
    }

    let dm: number;
    this.dsDinhMucN.forEach(itm => {
      if (itm.cloaiVthh == initItem.maVtu && initItem.loaiDmuc == "nhap") {
        //  dm = (parseInt(itm.nvuCmon, 10) + parseInt(itm.cucDhanh, 10) + parseInt(itm.ttoanCnhan, 10))
        dm = itm.tongDmuc;
      }
    })
    this.dsDinhMucX.forEach(itm => {
      if (itm.cloaiVthh == initItem.maVtu && initItem.loaiDmuc == "xuat") {
        //  dm = (parseInt(itm.nvuCmon, 10) + parseInt(itm.cucDhanh, 10) + parseInt(itm.ttoanCnhan, 10))
        dm = itm.tongDmuc;
      }
    })
    // them moi phan tu
    if (initItem?.id) {
      const item: ItemData = {
        ...initItem,
        stt: stt,
        kphiDmuc: dm != 0 ? dm : null,
      }
      this.lstCtietBcao.splice(index + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
        this.sum(stt);
        this.updateEditCache();
      }
      const item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: stt,
        kphiDmuc: dm != 0 ? dm : null,
      }
      this.lstCtietBcao.splice(index + 1, 0, item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }

  }
  //xóa dòng
  deleteLine(id: any) {
    const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    const nho: string = this.lstCtietBcao[index].stt;
    const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    const stt: string = this.lstCtietBcao[index].stt;
    //xóa phần tử và con của nó
    this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    const lstIndex: number[] = [];
    for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }

    this.replaceIndex(lstIndex, -1);
    this.sum(stt);
    this.updateEditCache();
  }

  // start edit
  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id);
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCtietBcao[index] },
      edit: false
    };
  }

  // luu thay doi
  saveEdit(id: string): void {
    // if (
    //   // (!this.editCache[id].data.loaiMatHang && this.editCache[id].data.loaiMatHang !== 0) ||
    //   (!this.editCache[id].data.maDviTinh) ||
    //   (!this.editCache[id].data.cphiTcong && this.editCache[id].data.cphiTcong !== 0) ||
    //   (!this.editCache[id].data.cphiNtruoc && this.editCache[id].data.cphiNtruoc !== 0) ||
    //   (!this.editCache[id].data.cphiNnay && this.editCache[id].data.cphiNnay !== 0) ||
    //   (!this.editCache[id].data.kphiQtoan && this.editCache[id].data.kphiQtoan !== 0) ||
    //   (!this.editCache[id].data.kphiChuaQtoanCong && this.editCache[id].data.kphiChuaQtoanCong !== 0) ||
    //   (!this.editCache[id].data.kphiChuaQtoanKpTchi && this.editCache[id].data.kphiChuaQtoanKpTchi !== 0) ||
    //   (!this.editCache[id].data.kphiChuaQtoanKpTkiem && this.editCache[id].data.kphiChuaQtoanKpTkiem !== 0) ||
    //   (!this.editCache[id].data.soChuaQtoan && this.editCache[id].data.soChuaQtoan !== 0) ||
    //   (!this.editCache[id].data.dtoan2021ThanhQtoan2020 && this.editCache[id].data.dtoan2021ThanhQtoan2020 !== 0)
    // ) {
    //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
    //   return;
    // }
    if (
      // this.editCache[id].data.cphiTcong <0 ||
      this.editCache[id].data.cphiNtruoc < 0 ||
      this.editCache[id].data.cphiNnay < 0 ||
      this.editCache[id].data.kphiQtoan < 0 ||
      // this.editCache[id].data.kphiChuaQtoanCong <0 ||
      this.editCache[id].data.kphiChuaQtoanKpTchi < 0 ||
      this.editCache[id].data.kphiChuaQtoanKpTkiem < 0 ||
      // this.editCache[id].data.soChuaQtoan <0 ||
      this.editCache[id].data.dtoan2021ThanhQtoan2020 < 0
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE)
      return
    }
    this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.updateEditCache();
  }


  updateChecked(id: any) {
    const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    //đặt các phần tử con có cùng trạng thái với nó
    this.lstCtietBcao.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
        item.checked = data.checked;
      }
    })
    //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    let index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
    if (index == -1) {
      this.allChecked = this.checkAllChild('0');
    } else {
      let nho: boolean = this.lstCtietBcao[index].checked;
      while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
        this.lstCtietBcao[index].checked = !nho;
        index = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(this.lstCtietBcao[index].stt));
        if (index == -1) {
          this.allChecked = !nho;
          break;
        }
        nho = this.lstCtietBcao[index].checked;
      }
    }
  }
  //kiểm tra các phần tử con có cùng được đánh dấu hay ko
  checkAllChild(str: string): boolean {
    let nho = true;
    this.lstCtietBcao.forEach(item => {
      if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
        nho = item.checked;
      }
    })
    return nho;
  }


  updateAllChecked() {
    this.lstCtietBcao.forEach(item => {
      item.checked = this.allChecked;
    })
  }

  deleteAllChecked() {
    const lstId: any[] = [];
    this.lstCtietBcao.forEach(item => {
      if (item.checked) {
        lstId.push(item.id);
      }
    })
    lstId.forEach(item => {
      if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
        this.deleteLine(item);
      }
    })
  }

  //thêm phần tử đầu tiên khi bảng rỗng
  addFirst(initItem: ItemData) {
    let dm: number;
    this.dsDinhMucN.forEach(itm => {
      if (itm.cloaiVthh == initItem.maVtu && initItem.loaiDmuc == "nhap") {
        dm = itm.tongDmuc;
      }
    })
    this.dsDinhMucX.forEach(itm => {
      if (itm.cloaiVthh == initItem.maVtu && initItem.loaiDmuc == "xuat") {
        dm = itm.tongDmuc;
      }
    })
    if (initItem?.id) {
      const item: ItemData = {
        ...initItem,
        stt: "0.1",
        kphiDmuc: dm != 0 ? dm : null,
      }
      this.lstCtietBcao.push(item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      const item: ItemData = {
        ...initItem,
        level: 0,
        id: uuid.v4() + 'FE',
        stt: "0.1",
        kphiDmuc: dm != 0 ? dm : null,
      }
      this.lstCtietBcao.push(item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
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
      item.level = this.lstMatHang.find(e => e.id == item.loaiMatHang)?.level;
    })
  }

  getIdCha(maKM: any) {
    return this.lstMatHang.find(e => e.id == maKM)?.maCha;
  }

  sortWithoutIndex() {
    this.setDetail();
    let level = 0;
    let lstCtietBcaoTemp: ItemData[] = this.lstCtietBcao;
    this.lstCtietBcao = [];
    const data: ItemData = lstCtietBcaoTemp.find(e => e.level == 0);
    this.addFirst(data);
    lstCtietBcaoTemp = lstCtietBcaoTemp.filter(e => e.id != data.id);
    let lstTemp: ItemData[] = lstCtietBcaoTemp.filter(e => e.level == level);
    while (lstTemp.length != 0 || level == 0) {
      lstTemp.forEach(item => {
        const idCha = this.getIdCha(Number(item.loaiMatHang));
        let index: number = this.lstCtietBcao.findIndex(e => Number(e.loaiMatHang) === idCha);
        if (index != -1) {
          this.addLow(this.lstCtietBcao[index].id, item);
        } else {
          index = this.lstCtietBcao.findIndex(e => this.getIdCha(Number(e.loaiMatHang)) === idCha);
          this.addSame(this.lstCtietBcao[index].id, item);
        }
      })
      level += 1;
      lstTemp = lstCtietBcaoTemp.filter(e => e.level == level);
    }
  }

  addLine(id: any) {
    const loaiMatHang: any = this.lstCtietBcao.find(e => e.id == id)?.loaiMatHang;
    const maVtu: any = this.lstCtietBcao.find(e => e.id == id)?.maVtu;
    const loaiDmuc: any = this.lstCtietBcao.find(e => e.id == id)?.loaiDmuc;
    const obj = {
      maKhoanMuc: loaiMatHang,
      lstKhoanMuc: this.lstMatHang,
      maVtu: maVtu,
      loaiDmuc: loaiDmuc
    }

    const modalIn = this.modal.create({
      nzTitle: 'Danh sách lĩnh vực',
      nzContent: DialogThemKhoanMucComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '65%',
      nzFooter: null,
      nzComponentParams: {
        obj: obj
      },
    });
    modalIn.afterClose.subscribe((res) => {
      if (res) {
        const index: number = this.lstCtietBcao.findIndex(e => e.loaiMatHang == res.maKhoanMuc);
        if (index == -1) {
          const data: any = {
            ...this.initItem,
            loaiMatHang: res.maKhoanMuc,
            level: this.lstMatHang.find(e => e.id == loaiMatHang)?.level,
            maVtu: res.maVtu,
            loaiDmuc: res.loaiDmuc,
          };
          if (this.lstCtietBcao.length == 0) {
            this.addFirst(data);
          } else {
            this.addSame(id, data);
          }
        }
        id = this.lstCtietBcao.find(e => e.loaiMatHang == res.maKhoanMuc)?.id;
        res.lstKhoanMuc.forEach(item => {
          if (this.lstCtietBcao.findIndex(e => e.loaiMatHang == item.id) == -1) {
            const data: ItemData = {
              ...this.initItem,
              loaiMatHang: item.id,
              level: item.level,
              maDviTinh: item.maDviTinh,
              maVtu: item.maVtu,
              loaiDmuc: item.loaiDmuc,
            };
            this.addLow(id, data);
          }
        })
        this.tinhToan();
        this.updateEditCache();
      }
    });

  }

  getLowStatus(str: string) {
    const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
    if (index == -1) {
      return false;
    }
    return true;
  }

  sum(stt: string) {
    stt = this.getHead(stt);
    while (stt != '0') {
      const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
      const data = this.lstCtietBcao[index];
      this.lstCtietBcao[index] = {
        ...this.initItem,
        id: data.id,
        stt: data.stt,
        loaiMatHang: data.loaiMatHang,
        checked: data.checked,
        level: data.level,
      }
      this.lstCtietBcao.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          this.lstCtietBcao[index].slHangTte += item.slHangTte;
          this.lstCtietBcao[index].kphiTtien += item.kphiTtien;
          this.lstCtietBcao[index].cphiTcong += item.cphiTcong;
          this.lstCtietBcao[index].cphiNtruoc += item.cphiNtruoc;
          this.lstCtietBcao[index].cphiNnay += item.cphiNnay;
          this.lstCtietBcao[index].chenhLech += item.chenhLech;
          this.lstCtietBcao[index].kphiQtoan += item.kphiQtoan;
          this.lstCtietBcao[index].kphiChuaQtoanCong += item.kphiChuaQtoanCong;
          this.lstCtietBcao[index].kphiChuaQtoanKpTkiem += item.kphiChuaQtoanKpTkiem;
          this.lstCtietBcao[index].kphiChuaQtoanKpTchi += item.kphiChuaQtoanKpTchi;
          this.lstCtietBcao[index].soChuaQtoan += item.soChuaQtoan;
          this.lstCtietBcao[index].dtoan2021ThanhQtoan2020 += item.dtoan2021ThanhQtoan2020;
          if (!isNaN(item.kphiDmuc)) {
            this.lstCtietBcao[index].kphiDmuc += item.kphiDmuc;
          }
        }
      })
      stt = this.getHead(stt);
    }
    this.getTotal();
  }

  getTotal() {
    this.total.slHangTte = 0;
    this.total.kphiDmuc = 0;
    this.total.kphiTtien = 0;
    this.total.cphiTcong = 0;
    this.total.cphiNtruoc = 0;
    this.total.cphiNnay = 0;
    this.total.chenhLech = 0;
    this.total.kphiQtoan = 0;
    this.total.kphiChuaQtoanCong = 0;
    this.total.kphiChuaQtoanKpTkiem = 0;
    this.total.kphiChuaQtoanKpTchi = 0;
    this.total.soChuaQtoan = 0;
    this.total.dtoan2021ThanhQtoan2020 = 0;
    this.lstCtietBcao.forEach(item => {
      if (item.level == 0) {
        this.total.slHangTte += item.slHangTte;
        this.total.kphiDmuc += item.kphiDmuc;
        this.total.kphiTtien += item.kphiTtien;
        this.total.cphiTcong += item.cphiTcong;
        this.total.cphiNtruoc += item.cphiNtruoc;
        this.total.cphiNnay += item.cphiNnay;
        this.total.chenhLech += item.chenhLech;
        this.total.kphiQtoan += item.kphiQtoan;
        this.total.kphiChuaQtoanCong += item.kphiChuaQtoanCong;
        this.total.kphiChuaQtoanKpTkiem += item.kphiChuaQtoanKpTkiem;
        this.total.kphiChuaQtoanKpTchi += item.kphiChuaQtoanKpTchi;
        this.total.soChuaQtoan += item.soChuaQtoan;
        this.total.dtoan2021ThanhQtoan2020 += item.dtoan2021ThanhQtoan2020;
      }
    })
    if (
      this.total.slHangTte == 0 ||
      this.total.kphiDmuc == 0 ||
      this.total.kphiTtien == 0 ||
      this.total.cphiTcong == 0 ||
      this.total.cphiNtruoc == 0 ||
      this.total.cphiNnay == 0 ||
      this.total.chenhLech == 0 ||
      this.total.kphiQtoan == 0 ||
      this.total.kphiChuaQtoanCong == 0 ||
      this.total.kphiChuaQtoanKpTkiem == 0 ||
      this.total.kphiChuaQtoanKpTchi == 0 ||
      this.total.soChuaQtoan == 0 ||
      this.total.dtoan2021ThanhQtoan2020 == 0
    ) {
      this.total.slHangTte = null,
        this.total.kphiDmuc = null,
        this.total.kphiTtien = null,
        this.total.cphiTcong = null,
        this.total.cphiNtruoc = null,
        this.total.cphiNnay = null,
        this.total.chenhLech = null,
        this.total.kphiQtoan = null,
        this.total.kphiChuaQtoanCong = null,
        this.total.kphiChuaQtoanKpTkiem = null,
        this.total.kphiChuaQtoanKpTchi = null,
        this.total.soChuaQtoan = null,
        this.total.dtoan2021ThanhQtoan2020 = null
    }
  }

  // action print
  doPrint() {
    const WindowPrt = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    );
    let printContent = '';
    printContent = printContent + '<div>';
    printContent =
      printContent + document.getElementById('tablePrint').innerHTML;
    printContent = printContent + '</div>';
    WindowPrt.document.write(printContent);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }


  // gia tri cac o input thay doi thi tinh toan lai
  changeModel(id: string): void {
    if (this.editCache[id].data.kphiDmuc == null) {
      this.editCache[id].data.kphiDmuc = 0
    }
    this.editCache[id].data.soChuaQtoan = Number(this.editCache[id].data.kphiChuaQtoanCong) - Number(this.editCache[id].data.dtoan2021ThanhQtoan2020);
    this.editCache[id].data.kphiChuaQtoanCong = Number(this.editCache[id].data.kphiChuaQtoanKpTkiem) + Number(this.editCache[id].data.kphiChuaQtoanKpTchi);
    this.editCache[id].data.chenhLech = Number(this.editCache[id].data.kphiTtien) - Number(this.editCache[id].data.cphiTcong);
    this.editCache[id].data.cphiTcong = Number(this.editCache[id].data.cphiNtruoc) + Number(this.editCache[id].data.cphiNnay);
    this.editCache[id].data.kphiTtien = Number(this.editCache[id].data.slHangTte) * Number(this.editCache[id].data.kphiDmuc);
  }

  // getDsDinhMucN() {
  //   const requestDinhMuc = {
  //     idDmChi: null,
  //     maDvi: this.maDviTao,
  //     paggingReq: {
  //       limit: 20,
  //       page: 1
  //     },
  //     parentId: null,
  //     str: null,
  //     trangThai: null,
  //     typeChi: null
  //   };
  //   this.quanLyVonPhiService.getDinhMucNhapXuat(requestDinhMuc).toPromise().then(
  //     async (data) => {
  //       const contentData = await data?.data?.content;
  //       if (contentData.length != 0) {
  //         this.dsDinhMucN = contentData;
  //       }
  //     },
  //     err => {
  //       this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
  //     },
  //   );
  // };
  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  }

  displayNumber1(num: number): string {
    return displayNumber(num);
  }

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  }

  async tinhToan() {
    this.lstCtietBcao.forEach(item => {
      if (item.kphiDmuc) {
        item.kphiTtien = item.slHangTte * item.kphiDmuc;
        item.chenhLech = item.kphiTtien - item.cphiTcong;
      } else {
        item.kphiDmuc = 0;
        item.kphiTtien = item.slHangTte * item.kphiDmuc;
        item.chenhLech = item.kphiTtien - item.cphiTcong;
      }
    })
  };
}
