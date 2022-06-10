import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { divMoney, mulMoney } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DON_VI_TIEN } from "../../../../../Utility/utils";
import { DialogTuChoiComponent } from './../../../../../components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MONEY_LIMIT } from './../../../../../Utility/utils';

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
  selector: 'app-phu-luc8',
  templateUrl: './phu-luc8.component.html',
  styleUrls: ['./phu-luc8.component.scss'],
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
  trangThaiPhuLuc: string = '1';
  trangThaiPhuLucGetDeTail!: string;
  initItem: ItemData = {
    id: null,
    stt: 0,
    maCongTrinh: "",
    kh2021: 0,
    lkeVcap: 0,
    gtriCtrinh: 0,
    dxuatDchinhTong: 0,
    dxuatDchinhTang: 0,
    dxuatDchinhGiam: 0,
    kh2021SauDchinh: 0,
    ghiChu: "",
    checked: false,
  };

  namBcao: number = 2022;
  thuyetMinh: string;
  maDviTien: any;
  listIdDelete: string = "";
  //trang thai cac nut
  status: boolean = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  allChecked = false;                         // check all checkbox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh

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
    this.id = this.data?.id;
    this.maBieuMau = this.data?.maBieuMau;
    this.maDviTien = this.data?.maDviTien;
    this.thuyetMinh = this.data?.thuyetMinh;
    this.trangThaiPhuLuc = this.data?.trangThai;
    this.trangThaiPhuLucGetDeTail = this.data?.lstDchinhs?.trangThai;
    this.namHienHanh = this.data?.namHienHanh;
    // this.lstDchinh = this.data?.lstCtiet;
    this.status = this.data?.status;
    this.statusBtnFinish = this.data?.statusBtnFinish;
    this.data?.lstCtietDchinh.forEach(item => {
      this.lstDchinh.push({
        ...item,
        kh2021: divMoney(item.kh2021, this.maDviTien),
        lkeVcap: divMoney(item.lkeVcap, this.maDviTien),
        gtriCtrinh: divMoney(item.gtriCtrinh, this.maDviTien),
        dxuatDchinhTong: divMoney(item.dxuatDchinhTong, this.maDviTien),
        dxuatDchinhTang: divMoney(item.dxuatDchinhTang, this.maDviTien),
        dxuatDchinhGiam: divMoney(item.dxuatDchinhGiam, this.maDviTien),
        kh2021SauDchinh: divMoney(item.kh2021SauDchinh, this.maDviTien),
      })
    })
    this.updateEditCache();

    this.danhMucService.dMNoiDung().toPromise().then(
      (res) => {
        if (res.statusCode == 0) {
          this.congTrinhs = res.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
    //get danh muc dự án
    this.danhMucService.dMLoaiChi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.nhomChis = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
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
  }

  getStatusButton() {
    if (this.data?.statusBtnOk && (this.trangThaiPhuLuc == "2" || this.trangThaiPhuLuc == "5") || (this.trangThaiPhuLuc == "4" || this.trangThaiPhuLucGetDeTail == "7")) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }
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
          let obj = {
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
          }
          this.dataChange.emit(obj);
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
    let item: ItemData = {
      id: uuid.v4(),
      stt: 0,
      maCongTrinh: '',
      kh2021: 0,
      lkeVcap: 0,
      gtriCtrinh: 0,
      dxuatDchinhTong: 0,
      dxuatDchinhTang: 0,
      dxuatDchinhGiam: 0,
      kh2021SauDchinh: 0,
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
    if (!this.editCache[id].data.maCongTrinh
      || (!this.editCache[id].data.dxuatDchinhGiam && this.editCache[id].data.dxuatDchinhGiam !== 0)
      || (!this.editCache[id].data.dxuatDchinhTang && this.editCache[id].data.dxuatDchinhTang !== 0)
      || (!this.editCache[id].data.dxuatDchinhTong && this.editCache[id].data.dxuatDchinhTong !== 0)
      || (!this.editCache[id].data.gtriCtrinh && this.editCache[id].data.gtriCtrinh !== 0)
      || (!this.editCache[id].data.dxuatDchinhGiam && this.editCache[id].data.dxuatDchinhGiam !== 0)
      || (!this.editCache[id].data.dxuatDchinhTang && this.editCache[id].data.dxuatDchinhTang !== 0)
      || (!this.editCache[id].data.dxuatDchinhTong && this.editCache[id].data.dxuatDchinhTong !== 0)
      || (!this.editCache[id].data.kh2021SauDchinh && this.editCache[id].data.kh2021SauDchinh !== 0)
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
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
    let lstCtietBcaoTemp: any = [];
    let checkMoneyRange = true;
    this.lstDchinh.forEach(item => {
      let kh2021 = mulMoney(item.kh2021, this.maDviTien)
      let lkeVcap = mulMoney(item.lkeVcap, this.maDviTien)
      let gtriCtrinh = mulMoney(item.gtriCtrinh, this.maDviTien)
      let dxuatDchinhTong = mulMoney(item.dxuatDchinhTong, this.maDviTien)
      let dxuatDchinhTang = mulMoney(item.dxuatDchinhTang, this.maDviTien)
      let dxuatDchinhGiam = mulMoney(item.dxuatDchinhGiam, this.maDviTien)
      let kh2021SauDchinh = mulMoney(item.kh2021SauDchinh, this.maDviTien)
      if (kh2021 > MONEY_LIMIT || lkeVcap > MONEY_LIMIT ||
        gtriCtrinh > MONEY_LIMIT || dxuatDchinhTong > MONEY_LIMIT || dxuatDchinhTang > MONEY_LIMIT || dxuatDchinhGiam > MONEY_LIMIT || kh2021SauDchinh > MONEY_LIMIT
      ) {
        checkMoneyRange = false;
        return;
      }
      lstCtietBcaoTemp.push({
        ...item,
        kh2021: kh2021,
        lkeVcap: lkeVcap,
        gtriCtrinh: gtriCtrinh,
        dxuatDchinhTong: dxuatDchinhTong,
        dxuatDchinhTang: dxuatDchinhTang,
        dxuatDchinhGiam: dxuatDchinhGiam,
        kh2021SauDchinh: kh2021SauDchinh,
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
    let request = {
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
          let obj = {
            trangThai: '-1',
            lyDoTuChoi: null,
          };
          this.dataChange.emit(obj);
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
}
