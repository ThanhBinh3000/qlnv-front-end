import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { deleteRow, displayNumber, exchangeMoney, sortByIndex, sortWithoutIndex } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { UserService } from 'src/app/services/user.service';
import { DANH_MUC } from './phu-luc-11.constant';
import { CurrencyMaskInputMode } from 'ngx-currency';


export class ItemData {
  level: any;
  checked: boolean;
  id: string;
  stt: string;
  tenNoiDung: string;
  maNoiDung: string;
  doiTuong: string;
  thoiGianHoc: number;
  sLuongTrongNuoc: number;
  sLuongNgoaiNuoc: number;
  sLuongTongSo: number;
  KinhPhiHoTro: number;
  TongNCDtoanKp: number;
  dToanNamTruoc: number;
  dToanDaGiao: number;
  dToanTongSo: number;
  dtoanDnghiDchinh: number;
  dtoanVuTvqtDnghi: number;
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
  selector: 'app-phu-luc-11',
  templateUrl: './phu-luc-11.component.html',
  styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc11Component implements OnInit {
  @Input() dataInfo;
  isDataAvailable = false;
  editMoneyUnit = false;
  status = false;
  donViTiens: any[] = DON_VI_TIEN;
  maDviTien: string = '1';
  scrollX: string;
  editRecommendedValue: boolean;
  viewRecommendedValue: boolean;
  userInfo: any;
  formDetail: any;
  maDviTao: any;
  thuyetMinh: string;
  namBcao: number;
  statusBtnOk: boolean;
  statusBtnFinish: boolean;
  statusPrint: boolean;
  // noiDungs: any[] = [];
  lstCtietBcao: ItemData[] = [];
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  noiDungs: any[] = DANH_MUC;
  BOX_NUMBER_WIDTH = 300;
  soLaMa: any[] = LA_MA;
  amount = AMOUNT;
  amount1 = AMOUNT1;

  constructor(
    private spinner: NgxSpinnerService,
    public userService: UserService,
    private modal: NzModalService,
    private _modalRef: NzModalRef,
  ) { }

  ngOnInit() {
    this.initialization().then(() => {
      this.isDataAvailable = true;
    })
  }
  async initialization() {
    this.spinner.show();
    // const category = await this.danhMucService.danhMucChungGetAll('BC_DC_PL10');
    // if (category) {
    //   category.data.forEach(
    //     item => {
    //       this.noiDungs.push({
    //         ...item,
    //         level: item.ma?.split('.').length - 2,
    //         giaTri: getName(this.namBcao, item.giaTri),
    //       })
    //     }
    //   )
    // }
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
        checked: false
      })
    })

    if (this.lstCtietBcao.length > 0) {
      if (!this.lstCtietBcao[0]?.stt) {
        this.lstCtietBcao = sortWithoutIndex(this.lstCtietBcao, 'maNoiDung');
      } else {
        this.lstCtietBcao = sortByIndex(this.lstCtietBcao);
      }
    }
    // this.getTotal();
    // this.tinhTong();
    this.lstCtietBcao.forEach(item => {
      item.tenNoiDung = this.noiDungs.find(e => e.ma == item.maNoiDung)?.giaTri;
    })

    if (this.status) {
      this.scrollX = (350 + this.BOX_NUMBER_WIDTH * 12).toString() + 'px';
    } else {
      this.scrollX = (350 + this.BOX_NUMBER_WIDTH * 12).toString() + 'px';
    }

    this.updateEditCache();
    this.getStatusButton();
    this.spinner.hide();
  };

  getStatusButton() {
    if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }
  };

  getIndex(str: string): string {
    str = str.substring(str.indexOf('.') + 1, str.length);
    let xau = "";
    const chiSo: string[] = str.split('.');
    const n: number = chiSo.length - 1;
    let k: number = parseInt(chiSo[n], 10);
    if (n == 0) {
      xau = String.fromCharCode(k + 64);
    }
    if (n == 1) {
      for (let i = 0; i < this.soLaMa.length; i++) {
        while (k >= this.soLaMa[i].gTri) {
          xau += this.soLaMa[i].kyTu;
          k -= this.soLaMa[i].gTri;
        }
      }
    }
    if (n == 2) {
      xau = chiSo[n];
    }
    if (n == 3) {
      xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    }
    if (n == 4) {
      xau = String.fromCharCode(k + 96);
    }
    if (n == 5) {
      xau = "-";
    }
    return xau;
  }

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  };

  deleteAllChecked() {
    const lstId: any[] = [];
    this.lstCtietBcao.forEach(item => {
      if (item.checked) {
        lstId.push(item.id);
      }
    })
    lstId.forEach(item => {
      if (this.lstCtietBcao.findIndex(e => e.id == item) != 0) {
        this.deleteLine(item);
      }
    })
  };

  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  };

  async save(trangThai: string, lyDoTuChoi: string) {

  };

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
  };

  doPrint() {

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
    //     congTrinh: data.congTrinh,
    //     level: data.level,
    //     // ttienTd: data.ttienTd,
    //     maCongTrinh: data.maCongTrinh,
    //     // sluongNamDtoan:data.sluongNamDtoan,
    //     // ttienNamDtoan: data.ttienNamDtoan,
    //     // thienNamTruoc: data.thienNamTruoc,
    //     // dtoanNamHtai: data.dtoanNamHtai,
    //     // uocNamHtai: data.uocNamHtai,
    //     // dmucNamDtoan: data.dmucNamDtoan,
    //   }
    //   this.lstCtietBcao.forEach(item => {
    //     if (this.getHead(item.stt) == stt) {
    //       this.lstCtietBcao[index].kh2021 = Number(sumNumber([this.lstCtietBcao[index].kh2021, item.kh2021]));
    //       this.lstCtietBcao[index].dtoanGiaoLke = Number(sumNumber([this.lstCtietBcao[index].dtoanGiaoLke, item.dtoanGiaoLke]));
    //       this.lstCtietBcao[index].gtriCtrinh = Number(sumNumber([this.lstCtietBcao[index].gtriCtrinh, item.gtriCtrinh]));
    //       this.lstCtietBcao[index].dtoanDchinhDnghi = Number(sumNumber([this.lstCtietBcao[index].dtoanDchinhDnghi, item.dtoanDchinhDnghi]));
    //       this.lstCtietBcao[index].kh2021SauDchinh = Number(sumNumber([this.lstCtietBcao[index].kh2021SauDchinh, item.kh2021SauDchinh]));
    //       this.lstCtietBcao[index].dtoanDnghiDchinhLnay = Number(sumNumber([this.lstCtietBcao[index].dtoanDnghiDchinhLnay, item.dtoanDnghiDchinhLnay]));
    //       this.lstCtietBcao[index].dtoanVuTvqtDnghi = Number(sumNumber([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]));
    //     }
    //   })
    //   stt = this.getHead(stt);
    // }
    // // this.getTotal();
    // this.tinhTong();
  };

  addLine(id: string) {
    // const maNdung: string = this.lstCtietBcao.find(e => e.id == id)?.maCongTrinh;
    // const obj = {
    //   ma: maNdung,
    //   lstDanhMuc: this.noiDungs,
    // }

    // const modalIn = this.modal.create({
    //   nzTitle: 'Danh sách nội dung ',
    //   nzContent: DialogChonDanhMucComponent,
    //   nzMaskClosable: false,
    //   nzClosable: false,
    //   nzWidth: '65%',
    //   nzFooter: null,
    //   nzComponentParams: {
    //     obj: obj
    //   },
    // });
    // modalIn.afterClose.subscribe((res) => {
    //   if (res) {
    //     const index: number = this.lstCtietBcao.findIndex(e => e.maCongTrinh == res.ma);
    //     if (index == -1) {
    //       const data: ItemData = {
    //         ...new ItemData(),
    //         maCongTrinh: res.ma,
    //         level: this.noiDungs.find(e => e.ma == res.ma)?.level,
    //         congTrinh: this.noiDungs.find(e => e.ma == res.ma)?.giaTri,
    //       };
    //       if (this.lstCtietBcao.length == 0) {
    //         this.lstCtietBcao = addHead(data, this.lstCtietBcao);
    //       } else {
    //         this.addSame(id, data);
    //       }
    //     }
    //     id = this.lstCtietBcao.find(e => e.maCongTrinh == res.ma)?.id;
    //     res.lstDanhMuc.forEach(item => {
    //       if (this.lstCtietBcao.findIndex(e => e.maCongTrinh == item.ma) == -1) {
    //         const data: ItemData = {
    //           ...new ItemData(),
    //           maCongTrinh: item.ma,
    //           level: item.level,
    //           congTrinh: item.giaTri,
    //         };
    //         this.addLow(id, data);
    //       }
    //     })
    //     this.updateEditCache();
    //   }
    // });
  };

  deleteLine(id: string) {
    const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
    this.lstCtietBcao = deleteRow(id, this.lstCtietBcao);
    // this.sum(stt);
    this.updateEditCache();
  };

  handleCancel() {
    this._modalRef.close();
  };

  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  };

  changeModel(id: string): void {
    // this.editCache[id].data.tongNcauDtoanN = this.editCache[id].data.tdiemBcaoDtoan + this.editCache[id].data.dkienThienDtoan + this.editCache[id].data.dtoanThieuNtruoc;
    // // this.editCache[id].data.dtoanDchinh = Number((this.editCache[id].data.ncauChiN1 / this.editCache[id].data.uocThienN).toFixed(3));
    // this.editCache[id].data.kh2021SauDchinh = this.editCache[id].data.kh2021 + this.editCache[id].data.dtoanDchinhDnghi;
    // this.editCache[id].data.dtoanDnghiDchinhLnay = this.editCache[id].data.kh2021SauDchinh - this.editCache[id].data.dtoanGiaoLke;
  };


}
