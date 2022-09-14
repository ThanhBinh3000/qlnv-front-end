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
import { displayNumber, DON_VI_TIEN, exchangeMoney, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from "uuid";

export class ItemData {
  id!: any;
  stt!: number;
  maDvi: string;
  khoachQdGiaoNvu: number;
  khoachLuong: number;
  tdiemBcaoLuong: number;
  tdiemBcaoDtoan: number;
  tdiemBcaoCcu: string;
  dkienThienLuong: number;
  dkienThienDtoan: number;
  dtoanThieuNtruoc: number;
  tongNcauDtoanN: number;
  dtoanLke: number;
  dtoanDchinh: number;
  ghiChu: string;
  checked!: boolean;
}
@Component({
  selector: 'app-phu-luc3',
  templateUrl: './phu-luc3.component.html',
  styleUrls: ['./phu-luc3.component.scss'],
})
export class PhuLuc3Component implements OnInit {
  @Input() data;
  @Output() dataChange = new EventEmitter();
  //danh muc
  donVis: any = [];
  matHangs: any[] = [];
  nhomChis: any[] = [];
  lstDchinh: ItemData[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  maCucDtnnKvucs: any[] = [];
  //thong tin chung
  id: any;
  namHienHanh: number;
  maBieuMau: string;
  trangThaiPhuLuc = '1';
  trangThaiPhuLucGetDeTail!: string;
  initItem: ItemData = {
    id: null,
    stt: 0,
    maDvi: "",
    khoachQdGiaoNvu: null,
    khoachLuong: null,
    tdiemBcaoLuong: null,
    tdiemBcaoDtoan: null,
    tdiemBcaoCcu: "",
    dkienThienLuong: null,
    dkienThienDtoan: null,
    dtoanThieuNtruoc: null,
    tongNcauDtoanN: null,
    dtoanLke: null,
    dtoanDchinh: null,
    ghiChu: "",
    checked: false,
  };

  namBcao: number;
  thuyetMinh: string;
  maDviTien: any;
  listIdDelete = "";
  //trang thai cac nut
  status = false;
  capDv: any;
  allChecked = false;                         // check all checkbox
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};     // phuc vu nut chinh
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  idItem: any;
  editMoneyUnit = false;
  constructor(
    private spinner: NgxSpinnerService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
    private location: Location,
    private modal: NzModalService,
  ) {
  }


  async ngOnInit() {
    this.spinner.show();
    this.id = this.data?.id;
    this.maBieuMau = this.data?.maBieuMau;
    this.maDviTien = this.data?.maDviTien;
    this.thuyetMinh = this.data?.thuyetMinh;
    this.trangThaiPhuLuc = this.data?.trangThai;
    this.trangThaiPhuLucGetDeTail = this.data?.lstDchinhs?.trangThai;
    this.namHienHanh = this.data?.namHienHanh;
    this.namBcao = this.data?.namBcao;
    // this.lstDchinh = this.data?.lstCtiet;
    this.status = this.data?.status;
    this.statusBtnFinish = this.data?.statusBtnFinish;
    this.data?.lstCtietDchinh.forEach(item => {
      this.lstDchinh.push({
        ...item,
        tongNcauDtoanN: item.tongNcauDtoanN,
      })
    })
    this.updateEditCache();
    //lay danh sach danh muc don vi
    await this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          this.maCucDtnnKvucs = this.donVis.filter(item => item.capDvi === '3')
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
    if (this.data?.statusBtnOk && (this.trangThaiPhuLuc == "2" || this.trangThaiPhuLuc == "5")) {
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
          const obj = {
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
          }
          this.dataChange.emit(obj);
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

  // them dong moi
  addLine(id: number): void {
    const item: ItemData = {
      id: uuid.v4(),
      stt: 0,
      maDvi: '',
      khoachQdGiaoNvu: null,
      khoachLuong: null,
      tdiemBcaoLuong: null,
      tdiemBcaoDtoan: null,
      tdiemBcaoCcu: "",
      dkienThienLuong: null,
      dkienThienDtoan: null,
      dtoanThieuNtruoc: null,
      tongNcauDtoanN: null,
      dtoanLke: null,
      dtoanDchinh: null,
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
    let count = 0;
    for (let itm of this.lstDchinh) {
      if (this.lstDchinh.length > 1 && this.lstDchinh.find(i => !i.maDvi)) {
        if (itm.maDvi == this.editCache[id].data.maDvi) {
          count++;
        }
      }
    }
    if (count >= 1) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.LOCAL_EXIST);
      return;
    }
    if (
      (!this.editCache[id].data.dkienThienDtoan && this.editCache[id].data.dkienThienDtoan !== 0) ||
      (!this.editCache[id].data.dkienThienLuong && this.editCache[id].data.dkienThienLuong !== 0) ||
      (!this.editCache[id].data.dtoanDchinh && this.editCache[id].data.dtoanDchinh !== 0) ||
      (!this.editCache[id].data.dtoanLke && this.editCache[id].data.dtoanLke !== 0) ||
      (!this.editCache[id].data.dtoanThieuNtruoc && this.editCache[id].data.dtoanThieuNtruoc !== 0) ||
      (!this.editCache[id].data.khoachLuong && this.editCache[id].data.khoachLuong !== 0) ||
      (!this.editCache[id].data.khoachQdGiaoNvu) ||
      (!this.editCache[id].data.tdiemBcaoCcu) ||
      (!this.editCache[id].data.maDvi) ||
      (!this.editCache[id].data.tdiemBcaoDtoan && this.editCache[id].data.tdiemBcaoDtoan !== 0) ||
      (!this.editCache[id].data.tdiemBcaoLuong && this.editCache[id].data.tdiemBcaoLuong !== 0) ||
      (!this.editCache[id].data.tongNcauDtoanN && this.editCache[id].data.tongNcauDtoanN !== 0)

    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
      return;
    }
    if (
      this.editCache[id].data.dkienThienDtoan < 0 ||
      this.editCache[id].data.dkienThienLuong < 0 ||
      this.editCache[id].data.dtoanLke < 0 ||
      this.editCache[id].data.dtoanThieuNtruoc < 0 ||
      this.editCache[id].data.khoachLuong < 0 ||
      this.editCache[id].data.tdiemBcaoDtoan < 0 ||
      this.editCache[id].data.tdiemBcaoLuong < 0 ||
      this.editCache[id].data.tongNcauDtoanN < 0
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
      return;
    }
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
    this.editCache[id].data.tongNcauDtoanN = this.editCache[id].data.tdiemBcaoDtoan + this.editCache[id].data.dkienThienDtoan + this.editCache[id].data.dtoanThieuNtruoc;
    // this.editCache[id].data.dtoanDchinh = Number((this.editCache[id].data.ncauChiN1 / this.editCache[id].data.uocThienN).toFixed(3));
    this.editCache[id].data.dtoanDchinh = this.editCache[id].data.tongNcauDtoanN - this.editCache[id].data.dtoanLke;
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

      const tongNcauDtoanN = item.tongNcauDtoanN
      if (item.tdiemBcaoDtoan > MONEY_LIMIT ||
        item.dkienThienDtoan > MONEY_LIMIT || item.dtoanThieuNtruoc > MONEY_LIMIT || item.tongNcauDtoanN > MONEY_LIMIT || item.dtoanLke > MONEY_LIMIT || item.dtoanDchinh > MONEY_LIMIT
      ) {
        checkMoneyRange = false;
        return;
      }
      lstCtietBcaoTemp.push({
        ...item,
        tongNcauDtoanN: tongNcauDtoanN,
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
          const obj = {
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
  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  }
  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  }


}
