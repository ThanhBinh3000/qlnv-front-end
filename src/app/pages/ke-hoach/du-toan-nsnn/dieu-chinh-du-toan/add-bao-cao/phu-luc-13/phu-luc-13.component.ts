import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { NgxSpinnerService } from 'ngx-spinner';
import { addChild, deleteRow, displayNumber, exchangeMoney, getHead, getName, getTail, mulNumber, sortByIndex, sortWithoutIndex, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DANH_MUC } from './phu-luc-13.constant';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';

export class ItemData {
  level: any;
  id: string;
  stt: string;
  tenNoiDung: string;
  maNoiDung: string;
  dToanNamTruoc: number;
  dToanDaGiao: number;
  dToanTongSo: number;
  TongNCDtoanKp: number;
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
  selector: 'app-phu-luc-13',
  templateUrl: './phu-luc-13.component.html',
  styleUrls: ['../add-bao-cao.component.scss'],
})
export class PhuLuc13Component implements OnInit {
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
  total: ItemData = new ItemData();
  tongDieuChinhTang: number;
  tongDieuChinhGiam: number;
  dToanVuTang: number;
  dToanVuGiam: number;

  constructor(
    private spinner: NgxSpinnerService,
    public userService: UserService,
    private modal: NzModalService,
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
    private dieuChinhDuToanService: DieuChinhService,
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

    if (this.lstCtietBcao.length == 0) {
      this.noiDungs.forEach(e => {
        this.lstCtietBcao.push({
          ...new ItemData(),
          id: uuid.v4() + 'FE',
          stt: e.ma,
          tenNoiDung: e.giaTri,
          maNoiDung: e.ma,
        })
      })
      this.setLevel();
      this.lstCtietBcao.forEach(item => {
        item.tenNoiDung += getName(item.level, item.maNoiDung);
      })
    } else if (!this.lstCtietBcao[0]?.stt) {
      this.lstCtietBcao.forEach(item => {
        item.stt = item.maNoiDung;
      })
    }

    if (this.lstCtietBcao.length > 0) {
      if (!this.lstCtietBcao[0]?.stt) {
        this.lstCtietBcao = sortWithoutIndex(this.lstCtietBcao, 'maNoiDung');
      } else {
        this.lstCtietBcao = sortByIndex(this.lstCtietBcao);
      }
    }
    
    this.getTotal();
    this.tinhTong();
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

  setLevel() {
    this.lstCtietBcao.forEach(item => {
      const str: string[] = item.stt.split('.');
      item.level = str.length - 2;
    })
  }

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
      xau = chiSo[n];
    }
    if (n == 1) {
      xau = "-";
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

  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  };

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
    stt = getHead(stt);
    while (stt != '0') {
      const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
      const data = this.lstCtietBcao[index];
      this.lstCtietBcao[index] = {
        ...new ItemData(),
        id: data.id,
        stt: data.stt,
        tenNoiDung: data.tenNoiDung,
        level: data.level,
        maNoiDung: data.maNoiDung,
      }
      this.lstCtietBcao.forEach(item => {
        if (getHead(item.stt) == stt) {
          this.lstCtietBcao[index].TongNCDtoanKp = Number(sumNumber([this.lstCtietBcao[index].TongNCDtoanKp, item.TongNCDtoanKp]))
          this.lstCtietBcao[index].dToanNamTruoc = Number(sumNumber([this.lstCtietBcao[index].dToanNamTruoc, item.dToanNamTruoc]))
          this.lstCtietBcao[index].dToanDaGiao = Number(sumNumber([this.lstCtietBcao[index].dToanDaGiao, item.dToanDaGiao]))
          this.lstCtietBcao[index].dToanTongSo = Number(sumNumber([this.lstCtietBcao[index].dToanTongSo, item.dToanTongSo]))
          this.lstCtietBcao[index].dtoanDnghiDchinh = Number(sumNumber([this.lstCtietBcao[index].dtoanDnghiDchinh, item.dtoanDnghiDchinh]))
          this.lstCtietBcao[index].dtoanVuTvqtDnghi = Number(sumNumber([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]))
        }
      })
      stt = getHead(stt);
    }
    this.getTotal();
    // this.tinhTong();
  };

  addLine(data: any) {
    let parentItem: ItemData = this.lstCtietBcao.find(e => getHead(e.stt) == data.stt);
    parentItem = {
      ...new ItemData(),
      id: uuid.v4() + 'FE',
      maNoiDung: "",
      level: data.level + 1,
      tenNoiDung: "",
    }
    this.lstCtietBcao = addChild(data.id, parentItem, this.lstCtietBcao);
    this.updateEditCache();
  };

  addLow(id: string, initItem: ItemData) {
    this.lstCtietBcao = addChild(id, initItem, this.lstCtietBcao);
  };

  checkDelete(stt: string) {
    const level = stt.split('.').length - 2;
    if (level == 1) {
      return true;
    }
    return false;
  };

  deleteLine(id: string) {
    const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    const nho: string = this.lstCtietBcao[index].stt;
    const head: string = getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    const stt: string = this.lstCtietBcao[index].stt;
    //xóa phần tử và con của nó
    this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    const lstIndex: number[] = [];
    for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
      if (getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, -1);
    this.sum(stt);
    this.getTotal();
    this.updateEditCache();
  };

  //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
  replaceIndex(lstIndex: number[], heSo: number) {
    if (heSo == -1) {
      lstIndex.reverse();
    }
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
      const str = getHead(this.lstCtietBcao[item].stt) + "." + (getTail(this.lstCtietBcao[item].stt) + heSo).toString();
      const nho = this.lstCtietBcao[item].stt;
      this.lstCtietBcao.forEach(item => {
        item.stt = item.stt.replace(nho, str);
      })
    })
  }

  handleCancel() {
    this._modalRef.close();
  };

  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  };

  changeModel(id: string): void {
    this.editCache[id].data.dToanTongSo = sumNumber([this.editCache[id].data.dToanNamTruoc, this.editCache[id].data.dToanDaGiao]);
    this.editCache[id].data.dtoanDnghiDchinh = this.editCache[id].data.TongNCDtoanKp - this.editCache[id].data.dToanTongSo;
  };

  getLowStatus(str: string) {
    return this.lstCtietBcao.findIndex(e => getHead(e.stt) == str) != -1;
  };

  checkEdit(stt: string) {
    const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
    return lstTemp.every(e => !e.stt.startsWith(stt));
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  };

  saveEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.getTotal()
    this.updateEditCache();
  };

  cancelEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id);
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCtietBcao[index] },
      edit: false
    };
  };
  checkAdd(stt: string) {

    if (
      stt == "0.1" ||
      stt == "0.2" ||
      stt == "0.3" ||
      stt == "0.4"
    ) {
      return true;
    }
    return false;
  };

  getTotal() {
    this.total = new ItemData();
    this.lstCtietBcao.forEach(item => {
      if (item.level == 0) {
        this.total.dToanNamTruoc = sumNumber([this.total.dToanNamTruoc, item.dToanNamTruoc])
        this.total.dToanDaGiao = sumNumber([this.total.dToanDaGiao, item.dToanDaGiao])
        this.total.dToanTongSo = sumNumber([this.total.dToanTongSo, item.dToanTongSo])
        this.total.TongNCDtoanKp = sumNumber([this.total.TongNCDtoanKp, item.TongNCDtoanKp])
        this.total.dtoanDnghiDchinh = sumNumber([this.total.dtoanDnghiDchinh, item.dtoanDnghiDchinh])
        this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi])
      }
    })
  };


  tinhTong() {
    this.tongDieuChinhGiam = 0;
    this.tongDieuChinhTang = 0;
    this.dToanVuTang = 0;
    this.dToanVuGiam = 0;
    this.lstCtietBcao.forEach(item => {
      const str = item.stt
      if (!(this.lstCtietBcao.findIndex(e => getHead(e.stt) == str) != -1)) {
        if (item.dtoanDnghiDchinh < 0) {
          Number(this.tongDieuChinhGiam += Number(item?.dtoanDnghiDchinh));
        } else {
          Number(this.tongDieuChinhTang += Number(item?.dtoanDnghiDchinh));
        }

        if (item.dtoanVuTvqtDnghi < 0) {
          Number(this.dToanVuGiam += Number(item?.dtoanVuTvqtDnghi));
        } else {
          Number(this.dToanVuTang += Number(item?.dtoanVuTvqtDnghi));
        }
      }
    })
  };


}
