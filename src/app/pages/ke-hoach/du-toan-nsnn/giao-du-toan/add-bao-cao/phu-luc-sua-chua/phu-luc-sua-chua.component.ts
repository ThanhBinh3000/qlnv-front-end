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
import { displayNumber, exchangeMoney, mulNumber, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from "uuid";

// export class ItemData {
//   id: string;
//   qlnvKhvonphiDchinhCtietId: string;
//   stt: string;
//   tenTaiSan: string;
//   dvTinh: string;
//   sluongDuocGiao: number;
//   sluongThien: number;
//   sluongUocTh: number;
//   tongCongTh: number;
//   dgiaTh: number;
//   thanhTienTh: number;
//   dtoanSuDung: number;
//   dtoanDaGiao: number;
//   tongCongDtoan: number;
//   dieuChinhDtoan: number;
//   vuTvqtDnghiDtoan: number;
//   kphiConThieu: number;
//   maTaiSan: string;
//   checked: boolean;
// }

export class ItemData {
  id: string;
  checked: boolean;
  stt: string;
  maTaiSan: string;
  tenTaiSan: string;
  dvTinh: string;
  sluongTsDenTd: number;
  sluongTsDaNhan: number;
  sluongTsDaPd: number;
  sluongTsCong: number;
  sluongTsTcDinhMuc: number;
  dToanDnghiSl: number;
  dToanDnghiMucGia: number;
  dToanDnghiThanhTien: number;
  dToanKpNamTruoc: number;
  dToanKpDaGiao: number;
  dToanKpCong: number;
  dToanDieuChinh: number;
  dToanVuDnghi: number;
  thuyetMinh: string;
  ghiChu: string;
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
  selector: 'app-phu-luc-sua-chua',
  templateUrl: './phu-luc-sua-chua.component.html',
  styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLucSuaChuaComponent implements OnInit {
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
  scrollX: string;
  BOX_NUMBER_WIDTH = 350;
  statusCanhBao = true;
  messageChenhLech
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
    await this.getListTaiSan();

    if (this.status) {
      this.scrollX = (400 + this.BOX_NUMBER_WIDTH * 9).toString() + 'px';
    } else {
      this.scrollX = (350 + this.BOX_NUMBER_WIDTH * 9).toString() + 'px';
    }

    // this.sortByIndex();
    this.getTotal();
    this.tinhTong();
    this.updateEditCache();
    this.getStatusButton();
    this.spinner.hide();
  };

  onChangeTaiSan(event, id) {
    const taiSan = this.lstTaiSans.filter(item => item.ma == event)
    this.editCache[id].data.dvTinh = taiSan[0].donViTinh;
    this.editCache[id].data.tenTaiSan = taiSan[0].giaTri;

  }

  async getListTaiSan() {
    const data = await this.danhMucService.danhMucChungGetAll('BC_DC_PL2');
    if (data) {
      data.data.forEach(
        item => {
          this.lstTaiSans.push({
            ...item,
            // level: item.ma?.split('.').length - 2,
            donViTinh: "cái"
          })
        }
      )
    }
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
      this.total.dToanDnghiMucGia = sumNumber([this.total.dToanDnghiMucGia, item.dToanDnghiMucGia]);
      this.total.dToanDnghiThanhTien = sumNumber([this.total.dToanDnghiThanhTien, item.dToanDnghiThanhTien]);
      this.total.dToanKpNamTruoc = sumNumber([this.total.dToanKpNamTruoc, item.dToanKpNamTruoc]);
      this.total.dToanKpDaGiao = sumNumber([this.total.dToanKpDaGiao, item.dToanKpDaGiao]);
      this.total.dToanKpCong = sumNumber([this.total.dToanKpCong, item.dToanKpCong]);
      this.total.dToanDieuChinh = sumNumber([this.total.dToanDieuChinh, item.dToanDieuChinh]);
      this.total.dToanVuDnghi = sumNumber([this.total.dToanVuDnghi, item.dToanVuDnghi]);
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
      if (item.dToanDnghiMucGia > MONEY_LIMIT) {
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
        item.dToanVuDnghi = item.dToanDieuChinh;
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
    if (this.editCache[id].data.dToanDnghiSl > (this.editCache[id].data.sluongTsTcDinhMuc - this.editCache[id].data.sluongTsCong)) {
      this.notification.warning(
        MESSAGE.WARNING,
        "Dự toán số lượng đề nghị trang bị không được lớn hơn hiệu của tiêu chuẩn định mức và tổng số lượng tài sản hiện có"
      ).onClose.subscribe(() => {
        this.statusCanhBao = false
      })
      return
    } else {
      this.statusCanhBao = true
    }
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.updateEditCache();
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
    this.tongDieuChinhGiam = 0;
    this.tongDieuChinhTang = 0;
    this.dToanVuTang = 0;
    this.dToanVuGiam = 0;
    this.lstCtietBcao.forEach(item => {
      if (item.dToanDieuChinh < 0) {
        this.tongDieuChinhGiam += Number(item.dToanDieuChinh);
      } else {
        this.tongDieuChinhTang += Number(item.dToanDieuChinh);
      }

      if (item.dToanVuDnghi < 0) {
        this.dToanVuGiam += Number(item.dToanVuDnghi);
      } else {
        this.dToanVuTang += Number(item.dToanVuDnghi);
      }
    })
  };

  changeModel(id: string): void {
    // this.editCache[id].data.tongNcauDtoanN = this.editCache[id].data.tdiemBcaoDtoan + this.editCache[id].data.dkienThienDtoan + this.editCache[id].data.dtoanThieuNtruoc;
    // // this.editCache[id].data.dtoanDchinh = Number((this.editCache[id].data.ncauChiN1 / this.editCache[id].data.uocThienN).toFixed(3));
    // this.editCache[id].data.tongCongTh = this.editCache[id].data.sluongThien + this.editCache[id].data.sluongUocTh;
    // this.editCache[id].data.thanhTienTh = this.editCache[id].data.tongCongTh * this.editCache[id].data.dgiaTh;
    // this.editCache[id].data.tongCongDtoan = this.editCache[id].data.dtoanSuDung + this.editCache[id].data.dtoanDaGiao;
    // this.editCache[id].data.dieuChinhDtoan = this.editCache[id].data.thanhTienTh - this.editCache[id].data.tongCongDtoan;

    this.editCache[id].data.sluongTsCong = sumNumber([this.editCache[id].data.sluongTsDenTd, this.editCache[id].data.sluongTsDaNhan, this.editCache[id].data.sluongTsDaPd]);

    this.editCache[id].data.dToanDnghiThanhTien = mulNumber(this.editCache[id].data.dToanDnghiSl, this.editCache[id].data.dToanDnghiMucGia);

    this.editCache[id].data.dToanKpCong = sumNumber([this.editCache[id].data.dToanKpNamTruoc, this.editCache[id].data.dToanKpDaGiao]);

    this.editCache[id].data.dToanDieuChinh = this.editCache[id].data.dToanDnghiThanhTien - this.editCache[id].data.dToanKpCong;

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
      maTaiSan: "",
      tenTaiSan: "",
      dvTinh: "",
      sluongTsDenTd: 0,
      sluongTsDaNhan: 0,
      sluongTsDaPd: 0,
      sluongTsCong: 0,
      sluongTsTcDinhMuc: 5,
      dToanDnghiSl: 0,
      dToanDnghiMucGia: 0,
      dToanDnghiThanhTien: 0,
      dToanKpNamTruoc: 0,
      dToanKpDaGiao: 0,
      dToanKpCong: 0,
      dToanDieuChinh: 0,
      dToanVuDnghi: 0,
      thuyetMinh: "",
      ghiChu: "",
    };

    this.lstCtietBcao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
  }



}
