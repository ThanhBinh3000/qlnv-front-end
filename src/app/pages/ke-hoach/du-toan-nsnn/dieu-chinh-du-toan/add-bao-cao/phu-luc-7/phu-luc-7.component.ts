import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, exchangeMoney, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from "uuid";
export class ItemData {
  // level: any;
  // checked: boolean;
  // id: string;
  // qlnvKhvonphiDchinhCtietId: string;
  // stt: string;
  // noiDung: string;
  // dviTinh: string;
  // sluongDuocGiao: number;
  // sluongThien: number;
  // soLuongUocThien: number;
  // tongCong: number;
  // dinhMuc: number;
  // thanhTien: number;
  // dtoanDaGiaoLke: number;
  // dtoanDchinh: number;
  // dtoanVuTvqtDnghi: number;
  // kphiConThieu: number;
  // maNoiDung: string;


  id: string;
  qlnvKhvonphiDchinhCtietId: string;
  stt: string;
  dmucHang: string;
  khoachQdGiaoNvu: string;
  khoachLuong: number;
  tdiemBcaoLuong: number;
  tdiemBcaoDtoan: number;
  tdiemBcaoCcu: string;
  dkienThienLuong: number;
  dkienThienDtoan: number;
  ncauDtoan: number;
  dtoanLkeDaGiao: number;
  dtoanDnghiDchinh: number;
  dtoanVuTvqtDnghi: number;
  ghiChu: string;
  dtoanNamConThieu: number;
  checked: boolean;
}

export const AMOUNT1 = {
  allowZero: true,
  allowNegative: true,
  precision: 4,
  prefix: '',
  thousands: '.',
  decimal: ',',
  align: "left",
  nullable: true,
  inputMode: CurrencyMaskInputMode.NATURAL,
}

@Component({
  selector: 'app-phu-luc-7',
  templateUrl: './phu-luc-7.component.html',
  styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc7Component implements OnInit {
  @Input() dataInfo;
  donViTiens: any[] = DON_VI_TIEN;
  isDataAvailable = false;
  editMoneyUnit = false;
  status = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  statusPrint: boolean;
  namBcao: number;
  maDviTien: string = '1';
  thuyetMinh: string;
  editRecommendedValue: boolean;
  viewRecommendedValue: boolean;
  lstCtietBcao: ItemData[] = [];
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  listIdDelete = "";
  allChecked = false;
  amount = AMOUNT;
  amount1 = AMOUNT1;
  formDetail: any;
  maDviTao: any;
  userInfo: any;
  lstTaiSans: any[] = [];
  total: ItemData = new ItemData();
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private dieuChinhDuToanService: DieuChinhService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    public userService: UserService,
    private danhMucService: DanhMucDungChungService,
  ) { }

  async ngOnInit() {
    this.initialization().then(() => {
      this.isDataAvailable = true;
    })
  }

  async initialization() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.formDetail = this.dataInfo?.data;
    this.maDviTao = this.dataInfo?.maDvi;
    this.thuyetMinh = this.formDetail?.thuyetMinh;
    this.status = this.dataInfo?.status;
    this.namBcao = this.dataInfo?.namBcao;
    this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
    this.statusPrint = this.dataInfo?.statusBtnPrint;
    this.editRecommendedValue = this.dataInfo?.editRecommendedValue;
    this.viewRecommendedValue = this.dataInfo?.viewRecommendedValue;
    this.formDetail?.lstCtietDchinh.forEach(item => {
      this.lstCtietBcao.push({
        ...item,
      })
    })

    // this.sortByIndex();
    this.getTotal();
    this.tinhTong();
    this.updateEditCache();
    this.getStatusButton();
    this.spinner.hide();
  };

  updateAllChecked(): void {
    if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
      this.lstCtietBcao = this.lstCtietBcao.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
        ...item,
        checked: false
      }));
    }
  }

  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  };

  getTotal() {
    this.total = new ItemData();
    this.lstCtietBcao.forEach(item => {
      this.total.khoachLuong = sumNumber([this.total.khoachLuong, item.khoachLuong]);
      this.total.tdiemBcaoLuong = sumNumber([this.total.tdiemBcaoLuong, item.tdiemBcaoLuong]);
      this.total.tdiemBcaoDtoan = sumNumber([this.total.tdiemBcaoDtoan, item.tdiemBcaoDtoan]);
      this.total.dkienThienLuong = sumNumber([this.total.dkienThienLuong, item.dkienThienLuong]);
      this.total.dkienThienDtoan = sumNumber([this.total.dkienThienDtoan, item.dkienThienDtoan]);
      this.total.ncauDtoan = sumNumber([this.total.ncauDtoan, item.ncauDtoan]);
      this.total.dtoanLkeDaGiao = sumNumber([this.total.dtoanLkeDaGiao, item.dtoanLkeDaGiao]);
      this.total.dtoanDnghiDchinh = sumNumber([this.total.dtoanDnghiDchinh, item.dtoanDnghiDchinh]);
      this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
      this.total.dtoanNamConThieu = sumNumber([this.total.dtoanNamConThieu, item.dtoanNamConThieu]);
    })
  };

  getStatusButton() {
    if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }
  }

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  };

  // luu
  async save(trangThai: string, lyDoTuChoi: string) {
    let checkSaveEdit;
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
    const lstCtietBcaoTemp: ItemData[] = [];
    let checkMoneyRange = true;
    this.lstCtietBcao.forEach(item => {
      if (item.dtoanDnghiDchinh > MONEY_LIMIT) {
        checkMoneyRange = false;
        return;
      }
      lstCtietBcaoTemp.push({
        ...item,
      })
    })

    if (!checkMoneyRange) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
      return;
    }

    // replace nhung ban ghi dc them moi id thanh null
    lstCtietBcaoTemp.forEach(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
    })

    if (!this.viewRecommendedValue) {
      lstCtietBcaoTemp?.forEach(item => {
        item.dtoanVuTvqtDnghi = item.dtoanDnghiDchinh;
      })
    }

    const request = JSON.parse(JSON.stringify(this.formDetail));
    request.lstCtietDchinh = lstCtietBcaoTemp;
    request.trangThai = trangThai;

    if (lyDoTuChoi) {
      request.lyDoTuChoi = lyDoTuChoi;
    }

    this.spinner.show();
    this.dieuChinhDuToanService.updatePLDieuChinh(request).toPromise().then(
      async data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.formDetail = data.data;
          this._modalRef.close({
            formDetail: this.formDetail,
          });
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
        this.save(mcn, text);
      }
    });
  }
  doPrint() {

  };

  handleCancel() {
    this._modalRef.close();
  };

  deleteLine(id: any): void {
    this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
    if (typeof id == "number") {
      this.listIdDelete += id + ","
    }
  };

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  };

  checkEdit(stt: string) {
    const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
    return lstTemp.every(e => !e.stt.startsWith(stt));
  };

  updateSingleChecked(): void {
    if (this.lstCtietBcao.every(item => !item.checked)) {
      this.allChecked = false;
    } else if (this.lstCtietBcao.every(item => item.checked)) {
      this.allChecked = true;
    }
  };

  saveEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.updateEditCache();
    this.sum(this.lstCtietBcao[index].stt);
    this.tinhTong();
    this.getTotal();
  };

  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  };

  sum(stt: string) {
    // stt = this.getHead(stt);
    // while (stt != '0') {
    //   const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
    //   const data = this.lstCtietBcao[index];
    //   this.lstCtietBcao[index] = {
    //     ...new ItemData(),
    //     id: data.id,
    //     stt: data.stt,
    //     tenDanhMuc: data.tenDanhMuc,
    //     level: data.level,
    //     // ttienTd: data.ttienTd,
    //     danhMuc: data.danhMuc,
    //     // sluongNamDtoan:data.sluongNamDtoan,
    //     // ttienNamDtoan: data.ttienNamDtoan,
    //     // thienNamTruoc: data.thienNamTruoc,
    //     // dtoanNamHtai: data.dtoanNamHtai,
    //     // uocNamHtai: data.uocNamHtai,
    //     // dmucNamDtoan: data.dmucNamDtoan,
    //   }
    //   this.lstCtietBcao.forEach(item => {
    //     if (this.getHead(item.stt) == stt) {
    //       this.lstCtietBcao[index].ttienNamDtoan = sumNumber([this.lstCtietBcao[index].ttienNamDtoan, item.ttienNamDtoan]);
    //       this.lstCtietBcao[index].thienNamTruoc = sumNumber([this.lstCtietBcao[index].thienNamTruoc, item.thienNamTruoc]);
    //       this.lstCtietBcao[index].dtoanNamHtai = sumNumber([this.lstCtietBcao[index].dtoanNamHtai, item.dtoanNamHtai]);
    //       this.lstCtietBcao[index].uocNamHtai = sumNumber([this.lstCtietBcao[index].uocNamHtai, item.uocNamHtai]);
    //       // this.lstCtietBcao[index].dmucNamDtoan = sumNumber([this.lstCtietBcao[index].dmucNamDtoan, item.dmucNamDtoan]);
    //       this.lstCtietBcao[index].ttienTd = sumNumber([this.lstCtietBcao[index].ttienTd, item.ttienTd]);
    //     }
    //   })
    //   stt = this.getHead(stt);
    // }
    // // this.getTotal();
    // this.tinhTong();
  };

  cancelEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id);
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCtietBcao[index] },
      edit: false
    };
    this.tinhTong();
  };

  tongDieuChinhTang: number;
  tongDieuChinhGiam: number;
  dToanVuTang: number;
  dToanVuGiam: number;
  tinhTong() {
    // this.tongSo = 0;
    // this.tongSoTd = 0;
    // this.tongThienNamTruoc = 0;
    // this.tongDuToan = 0;
    // this.tongUoc = 0;
    // this.tongDmuc = 0;
    // this.lstCtietBcao.forEach(item => {
    //   if (item.level == "0") {
    //     this.tongSo += item.ttienNamDtoan;
    //     this.tongSoTd += item.ttienTd;
    //     this.tongThienNamTruoc += item.thienNamTruoc;
    //     this.tongDuToan += item.dtoanNamHtai;
    //     this.tongUoc += item.uocNamHtai;
    //     this.tongDmuc += item.dmucNamDtoan;
    //   }
    // })
    this.tongDieuChinhGiam = 0;
    this.tongDieuChinhTang = 0;
    this.dToanVuTang = 0;
    this.dToanVuGiam = 0;
    this.lstCtietBcao.forEach(item => {
      if (item.dtoanDnghiDchinh < 0) {
        this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinh);
      } else {
        this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinh);
      }

      if (item.dtoanVuTvqtDnghi < 0) {
        this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi);
      } else {
        this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi);
      }
    })
  };

  changeModel(id: string): void {
    this.editCache[id].data.ncauDtoan = this.editCache[id].data.tdiemBcaoDtoan + this.editCache[id].data.dkienThienDtoan;
    this.editCache[id].data.dtoanDnghiDchinh = this.editCache[id].data.ncauDtoan - this.editCache[id].data.dtoanLkeDaGiao;
  };

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
  };

  addLine(id: number): void {
    const item: ItemData = {
      id: uuid.v4(),
      stt: "0",
      checked: false,
      dmucHang: "",
      khoachQdGiaoNvu: "",
      khoachLuong: 0,
      tdiemBcaoLuong: 0,
      tdiemBcaoDtoan: 0,
      tdiemBcaoCcu: "",
      dkienThienDtoan: 0,
      dkienThienLuong: 0,
      ncauDtoan: 0,
      dtoanLkeDaGiao: 0,
      dtoanDnghiDchinh: 0,
      dtoanVuTvqtDnghi: 0,
      ghiChu: "",
      dtoanNamConThieu: 0,
      qlnvKhvonphiDchinhCtietId: "",
    };

    this.lstCtietBcao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
  }



}


