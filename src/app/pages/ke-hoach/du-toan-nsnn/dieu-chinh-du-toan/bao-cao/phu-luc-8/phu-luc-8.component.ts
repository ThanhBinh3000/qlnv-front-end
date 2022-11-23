import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, divMoney, DON_VI_TIEN, exchangeMoney, MONEY_LIMIT, mulMoney, NOT_OK, OK } from 'src/app/Utility/utils';
import * as uuid from "uuid";

export class ItemData {
  id!: any;
  stt!: number;
  maCongTrinh: string;
  kh2021: number;
  lkeVcap: number;
  gtriCtrinh: number;
  dxuatDchinhTong: number;
  dxuatDchinhTang: number;
  dxuatDchinhGiam: number;
  kh2021SauDchinh: number;
  ghiChu: string;
  checked!: boolean;
}

@Component({
  selector: 'app-phu-luc-8',
  templateUrl: './phu-luc-8.component.html',
})
export class PhuLuc8Component implements OnInit {
  @Input() data;
  @Output() dataChange = new EventEmitter();
  //danh muc
  donVis: any = [];
  congTrinhs: any[] = [];
  nhomChis: any[] = [];
  lstDchinh: ItemData[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  //thong tin chung
  id: any;
  namHienHanh: number;
  maBieuMau: string;
  trangThaiPhuLuc = '1';
  trangThaiPhuLucGetDeTail!: string;
  initItem: ItemData = {
    id: null,
    stt: 0,
    maCongTrinh: "",
    kh2021: null,
    lkeVcap: null,
    gtriCtrinh: null,
    dxuatDchinhTong: null,
    dxuatDchinhTang: null,
    dxuatDchinhGiam: null,
    kh2021SauDchinh: null,
    ghiChu: "",
    checked: false,
  };

  namBcao: number;
  thuyetMinh: string;
  maDviTien: string;
  listIdDelete = "";
  //trang thai cac nut
  status = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  allChecked = false;                         // check all checkbox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh
  editMoneyUnit = false;
  maDviTao!: string;
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
    this.trangThaiPhuLucGetDeTail = this.data?.lstDchinhs?.trangThai;
    this.namHienHanh = this.data?.namHienHanh;
    this.namBcao = this.data?.namBcao;
    this.maDviTao = this.data?.maDviTao;
    // this.lstDchinh = this.data?.lstCtiet;
    this.status = this.data?.status;
    this.statusBtnFinish = this.data?.statusBtnFinish;
    this.data?.lstCtietDchinh.forEach(item => {
      this.lstDchinh.push({
        ...item,
      })
    })
    this.updateEditCache();

    //lay danh sach danh muc don vi
    await this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.getStatusButton();
    this.spinner.hide();
  };

  getStatusButton() {
    if (this.data?.statusBtnOk && (this.trangThaiPhuLuc == "2" || this.trangThaiPhuLuc == "5")) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }
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
          // if (mcn == Utils.TT_BC_8 || mcn == Utils.TT_BC_5 || mcn == Utils.TT_BC_3) {
          // 	this.notification.success(MESSAGE.SUCCESS, MESSAGE.REVERT_SUCCESS);
          // } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
          // }
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

  // them dong moi
  addLine(id: number): void {
    const item: ItemData = {
      id: uuid.v4(),
      stt: 0,
      maCongTrinh: '',
      kh2021: null,
      lkeVcap: null,
      gtriCtrinh: null,
      dxuatDchinhTong: null,
      dxuatDchinhTang: null,
      dxuatDchinhGiam: null,
      kh2021SauDchinh: null,
      ghiChu: '',
      checked: false,
    };

    this.lstDchinh.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
  }

  // xoa dong
  deleteById(id: any): void {
    this.lstDchinh = this.lstDchinh.filter(item => item.id != id)
    if (typeof id == "number") {
      this.listIdDelete += id + ","
    }
  }

  // xóa với checkbox
  deleteSelected() {
    // add list delete id
    this.lstDchinh.filter(item => {
      if (item.checked == true && typeof item.id == "number") {
        this.listIdDelete += item.id + ","
      }
    })
    // delete object have checked = true
    this.lstDchinh = this.lstDchinh.filter(item => item.checked != true)
    this.allChecked = false;
  }

  updateAllChecked(): void {
    if (this.allChecked) {
      this.lstDchinh = this.lstDchinh.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstDchinh = this.lstDchinh.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.lstDchinh.every(item => !item.checked)) {
      this.allChecked = false;
    } else if (this.lstDchinh.every(item => item.checked)) {
      this.allChecked = true;
    }
  }

  redirectChiTieuKeHoachNam() {
    // this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
    this.location.back()
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.lstDchinh.findIndex(item => item.id === id);
    // if (!this.lstDchinh[index].maCucDtnnKvuc) {
    //     this.deleteById(id);
    //     return;
    // }
    this.editCache[id] = {
      data: { ...this.lstDchinh[index] },
      edit: false
    };
  }

  //update khi sửa
  saveEdit(id: string): void {
    // if (!this.editCache[id].data.maCongTrinh
    //   || (!this.editCache[id].data.dxuatDchinhGiam && this.editCache[id].data.dxuatDchinhGiam !== 0)
    //   || (!this.editCache[id].data.dxuatDchinhTang && this.editCache[id].data.dxuatDchinhTang !== 0)
    //   || (!this.editCache[id].data.gtriCtrinh && this.editCache[id].data.gtriCtrinh !== 0)
    //   || (!this.editCache[id].data.kh2021SauDchinh && this.editCache[id].data.kh2021SauDchinh !== 0)
    // ) {
    //   this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
    //   return;
    // }
    if (
      this.editCache[id].data.dxuatDchinhGiam < 0 ||
      this.editCache[id].data.dxuatDchinhTang < 0 ||
      this.editCache[id].data.gtriCtrinh < 0 ||
      this.editCache[id].data.kh2021SauDchinh < 0
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE)
      return
    }
    // this.changeModel(id);
    this.editCache[id].data.checked = this.lstDchinh.find(
      (item) => item.id === id,
    ).checked; // set checked editCache = checked lstDchinh
    const index = this.lstDchinh.findIndex((item) => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstDchinh[index], this.editCache[id].data); // set lai data cua lstDchinh[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
  }

  // gan editCache.data == lstDchinh
  updateEditCache(): void {
    this.lstDchinh.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  // gia tri cac o input thay doi thi tinh toan lai
  changeModel(id: string): void {
    this.editCache[id].data.dxuatDchinhTong = this.editCache[id].data.dxuatDchinhTang + this.editCache[id].data.dxuatDchinhGiam;
    this.editCache[id].data.kh2021SauDchinh = this.editCache[id].data.dxuatDchinhTong + this.editCache[id].data.kh2021;
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
    this.lstDchinh.forEach(element => {
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
    this.lstDchinh.forEach(item => {
      if (item.kh2021 > MONEY_LIMIT || item.lkeVcap > MONEY_LIMIT ||
        item.gtriCtrinh > MONEY_LIMIT || item.dxuatDchinhTong > MONEY_LIMIT || item.dxuatDchinhTang > MONEY_LIMIT || item.dxuatDchinhGiam > MONEY_LIMIT || item.kh2021SauDchinh > MONEY_LIMIT
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
  };

  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  }

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  }
}
