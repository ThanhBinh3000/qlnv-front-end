import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogChonDanhMucComponent } from 'src/app/components/dialog/dialog-chon-danh-muc/dialog-chon-danh-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { UserService } from 'src/app/services/user.service';
import { addChild, addHead, addParent, deleteRow, displayNumber, exchangeMoney, getHead, getName, sortByIndex, sortWithoutIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
export class ItemData {
  level: any;
  checked: boolean;
  id: string;
  qlnvKhvonphiDchinhCtietId: string;
  stt: string;
  congTrinh: string;
  kh2021: number;
  dtoanGiaoLke: number;
  gtriCtrinh: number;
  dtoanDchinhDnghi: number;
  kh2021SauDchinh: number;
  dtoanDnghiDchinhLnay: number;
  dtoanVuTvqtDnghi: number;
  ghiChu: string;
  maCongTrinh: string;
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
  selector: 'app-phu-luc-10',
  templateUrl: './phu-luc-10.component.html',
  styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc10Component implements OnInit {
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
  noiDungs: any[] = [];
  total: ItemData = new ItemData();
  soLaMa: any[] = LA_MA;
  tongDieuChinhTang: number;
  tongDieuChinhGiam: number;
  dToanVuTang: number;
  dToanVuGiam: number;
  scrollX: string;

  BOX_NUMBER_WIDTH = 250;
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private dieuChinhDuToanService: DieuChinhService,
    private notification: NzNotificationService,
    private modal: NzModalService,
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
    const category = await this.danhMucService.danhMucChungGetAll('BC_DC_PL10');
    if (category) {
      category.data.forEach(
        item => {
          this.noiDungs.push({
            ...item,
            level: item.ma?.split('.').length - 2,
            giaTri: getName(this.namBcao, item.giaTri),
          })
        }
      )
    }
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
        this.lstCtietBcao = sortWithoutIndex(this.lstCtietBcao, 'maCongTrinh');
      } else {
        this.lstCtietBcao = sortByIndex(this.lstCtietBcao);
      }
    }
    // this.sortByIndex();
    this.getTotal();
    this.tinhTong();
    this.lstCtietBcao.forEach(item => {
      item.congTrinh = this.noiDungs.find(e => e.ma == item.maCongTrinh)?.giaTri;
    })

    if (this.status) {
      this.scrollX = (550 + this.BOX_NUMBER_WIDTH * 10).toString() + 'px';
    } else {
      this.scrollX = (500 + this.BOX_NUMBER_WIDTH * 10).toString() + 'px';
    }

    this.updateEditCache();
    this.getStatusButton();
    this.spinner.hide();
  };

  getLowStatus(str: string) {
    return this.lstCtietBcao.findIndex(e => getHead(e.stt) == str) != -1;
  }

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
      if (item.level == 0) {
        this.total.kh2021 = sumNumber([this.total.kh2021, item.kh2021]);
        this.total.dtoanGiaoLke = sumNumber([this.total.dtoanGiaoLke, item.dtoanGiaoLke]);
        this.total.gtriCtrinh = sumNumber([this.total.gtriCtrinh, item.gtriCtrinh]);
        this.total.dtoanDchinhDnghi = sumNumber([this.total.dtoanDchinhDnghi, item.dtoanDchinhDnghi]);
        this.total.kh2021SauDchinh = sumNumber([this.total.kh2021SauDchinh, item.kh2021SauDchinh]);
        this.total.dtoanDnghiDchinhLnay = sumNumber([this.total.dtoanDnghiDchinhLnay, item.dtoanDnghiDchinhLnay]);
        this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
      }
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
      if (item.dtoanDnghiDchinhLnay > MONEY_LIMIT) {
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
        item.dtoanVuTvqtDnghi = item.dtoanDnghiDchinhLnay;
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

  deleteLine(id: string) {
    const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
    this.lstCtietBcao = deleteRow(id, this.lstCtietBcao);
    this.sum(stt);
    this.updateEditCache();
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  };

  checkEdit(stt: string) {
    const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
    return lstTemp.every(e => !e.stt.startsWith(stt));
  }

  updateSingleChecked(): void {
    if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.allChecked = false;
    }
  }

  saveEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.getTotal()
    this.updateEditCache();
  }

  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  };

  sum(stt: string) {
    stt = this.getHead(stt);
    while (stt != '0') {
      const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
      const data = this.lstCtietBcao[index];
      this.lstCtietBcao[index] = {
        ...new ItemData(),
        id: data.id,
        stt: data.stt,
        congTrinh: data.congTrinh,
        level: data.level,
        // ttienTd: data.ttienTd,
        maCongTrinh: data.maCongTrinh,
        // sluongNamDtoan:data.sluongNamDtoan,
        // ttienNamDtoan: data.ttienNamDtoan,
        // thienNamTruoc: data.thienNamTruoc,
        // dtoanNamHtai: data.dtoanNamHtai,
        // uocNamHtai: data.uocNamHtai,
        // dmucNamDtoan: data.dmucNamDtoan,
      }
      this.lstCtietBcao.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          this.lstCtietBcao[index].kh2021 = Number(sumNumber([this.lstCtietBcao[index].kh2021, item.kh2021]));
          this.lstCtietBcao[index].dtoanGiaoLke = Number(sumNumber([this.lstCtietBcao[index].dtoanGiaoLke, item.dtoanGiaoLke]));
          this.lstCtietBcao[index].gtriCtrinh = Number(sumNumber([this.lstCtietBcao[index].gtriCtrinh, item.gtriCtrinh]));
          this.lstCtietBcao[index].dtoanDchinhDnghi = Number(sumNumber([this.lstCtietBcao[index].dtoanDchinhDnghi, item.dtoanDchinhDnghi]));
          this.lstCtietBcao[index].kh2021SauDchinh = Number(sumNumber([this.lstCtietBcao[index].kh2021SauDchinh, item.kh2021SauDchinh]));
          this.lstCtietBcao[index].dtoanDnghiDchinhLnay = Number(sumNumber([this.lstCtietBcao[index].dtoanDnghiDchinhLnay, item.dtoanDnghiDchinhLnay]));
          this.lstCtietBcao[index].dtoanVuTvqtDnghi = Number(sumNumber([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]));
        }
      })
      stt = this.getHead(stt);
    }
    // this.getTotal();
    this.tinhTong();
  };

  cancelEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id);
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCtietBcao[index] },
      edit: false
    };
  }


  tinhTong() {
    this.tongDieuChinhGiam = 0;
    this.tongDieuChinhTang = 0;
    this.dToanVuTang = 0;
    this.dToanVuGiam = 0;
    this.lstCtietBcao.forEach(item => {
      const str = item.stt
      if (!(this.lstCtietBcao.findIndex(e => getHead(e.stt) == str) != -1)) {
        if (item.dtoanDnghiDchinhLnay < 0) {
          Number(this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinhLnay));
        } else {
          Number(this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinhLnay));
        }

        if (item.dtoanVuTvqtDnghi < 0) {
          Number(this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi));
        } else {
          Number(this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi));
        }
      }
    })
  };

  changeModel(id: string): void {
    // this.editCache[id].data.tongNcauDtoanN = this.editCache[id].data.tdiemBcaoDtoan + this.editCache[id].data.dkienThienDtoan + this.editCache[id].data.dtoanThieuNtruoc;
    // // this.editCache[id].data.dtoanDchinh = Number((this.editCache[id].data.ncauChiN1 / this.editCache[id].data.uocThienN).toFixed(3));
    this.editCache[id].data.kh2021SauDchinh = this.editCache[id].data.kh2021 + this.editCache[id].data.dtoanDchinhDnghi;
    this.editCache[id].data.dtoanDnghiDchinhLnay = this.editCache[id].data.kh2021SauDchinh - this.editCache[id].data.dtoanGiaoLke;
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
  }



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
  // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
  getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
  }
  // lấy phần đuôi của stt
  getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
  }

  checkDelete(stt: string) {
    const level = stt.split('.').length - 2;
    if (level == 0) {
      return true;
    }
    return false;
  };


  addLine(id: string) {
    const maNdung: string = this.lstCtietBcao.find(e => e.id == id)?.maCongTrinh;
    const obj = {
      ma: maNdung,
      lstDanhMuc: this.noiDungs,
    }

    const modalIn = this.modal.create({
      nzTitle: 'Danh sách nội dung ',
      nzContent: DialogChonDanhMucComponent,
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
        const index: number = this.lstCtietBcao.findIndex(e => e.maCongTrinh == res.ma);
        if (index == -1) {
          const data: ItemData = {
            ...new ItemData(),
            maCongTrinh: res.ma,
            level: this.noiDungs.find(e => e.ma == res.ma)?.level,
            congTrinh: this.noiDungs.find(e => e.ma == res.ma)?.giaTri,
          };
          if (this.lstCtietBcao.length == 0) {
            this.lstCtietBcao = addHead(data, this.lstCtietBcao);
          } else {
            this.addSame(id, data);
          }
        }
        id = this.lstCtietBcao.find(e => e.maCongTrinh == res.ma)?.id;
        res.lstDanhMuc.forEach(item => {
          if (this.lstCtietBcao.findIndex(e => e.maCongTrinh == item.ma) == -1) {
            const data: ItemData = {
              ...new ItemData(),
              maCongTrinh: item.ma,
              level: item.level,
              congTrinh: item.giaTri,
            };
            this.addLow(id, data);
          }
        })
        this.updateEditCache();
      }
    });

  };

  addSame(id: string, initItem: ItemData) {
    this.lstCtietBcao = addParent(id, initItem, this.lstCtietBcao);
  };


  addLow(id: string, initItem: ItemData) {
    this.lstCtietBcao = addChild(id, initItem, this.lstCtietBcao);
  };

}





