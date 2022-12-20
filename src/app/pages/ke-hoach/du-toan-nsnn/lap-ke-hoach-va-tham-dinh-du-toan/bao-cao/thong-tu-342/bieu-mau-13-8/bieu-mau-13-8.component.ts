import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { DANH_MUC_138 } from './bieu-mau-13-8.constant';

export class ItemData {
  id: string;
  stt: string;
  maNdung: string;
  tenDmuc: string;
  level: number;
  thienNtruoc: number;
  namDtoan: number;
  namUocThien: number;
  namKh: number;
  giaTriThamDinh: number;
  ghiChu: string;
}

@Component({
  selector: 'app-bieu-mau-13-8',
  templateUrl: './bieu-mau-13-8.component.html',
  styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau138Component implements OnInit {
  @Input() dataInfo;
  //thong tin chi tiet cua bieu mau
  formDetail: any;
  total: ItemData = new ItemData();
  maDviTien: string = '1';
  thuyetMinh: string;
  namBcao: number;
  //danh muc
  noiDungs: any[] = DANH_MUC_138;
  soLaMa: any[] = LA_MA;
  lstCtietBcao: ItemData[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  //trang thai cac nut
  status = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  viewAppraisalValue: boolean;
  editAppraisalValue: boolean;
  editMoneyUnit = false;
  isDataAvailable = false;
  //nho dem
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private lapThamDinhService: LapThamDinhService,
    private notification: NzNotificationService,
    private modal: NzModalService,
  ) {
  }


  async ngOnInit() {
    this.initialization().then(() => {
      this.isDataAvailable = true;
    })
  }

  async initialization() {
    this.spinner.show();
    this.formDetail = this.dataInfo?.data;
    this.namBcao = this.dataInfo?.namBcao;
    this.thuyetMinh = this.formDetail?.thuyetMinh;
    this.status = this.dataInfo?.status;
    this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
    this.viewAppraisalValue = this.dataInfo?.viewAppraisalValue;
    this.editAppraisalValue = this.dataInfo?.editAppraisalValue;
    this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
      this.lstCtietBcao.push({
        ...item,
      })
    })
    if (this.lstCtietBcao.length == 0) {
      this.noiDungs.forEach(e => {
        this.lstCtietBcao.push({
          ...new ItemData(),
          id: uuid.v4() + 'FE',
          stt: e.ma,
          maNdung: e.ma,
          tenDmuc: e.giaTri,
        })
      })
    }
    if (this.dataInfo?.extraData && this.dataInfo.extraData.length > 0) {
      this.lstCtietBcao = this.lstCtietBcao.filter(e => e.maNdung);
      this.dataInfo.extraData.forEach(item => {
        if (item.maNdung) {
          const index = this.lstCtietBcao.findIndex(e => e.maNdung == item.maNdung);
          this.lstCtietBcao[index].namKh = item.namKh;
          this.lstCtietBcao[index].giaTriThamDinh = item.giaTriThamDinh;
        } else {
          this.lstCtietBcao.push({
            ...new ItemData(),
            id: uuid.v4(),
            stt: item.stt,
            tenDmuc: item.tenNdung,
            thienNtruoc: item.thienNtruoc,
            namDtoan: item.namDtoan,
            namUocThien: item.namUocThien,
            namKh: item.namKh,
            giaTriThamDinh: item.giaTriThamDinh,
          })
        }
        this.sum(item.stt);
      })
    }
    this.sortByIndex();
    this.updateEditCache();
    this.getStatusButton();
    this.spinner.hide();
  }

  getStatusButton() {
    if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }
  }

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
      if (item.thienNtruoc > MONEY_LIMIT || item.namDtoan > MONEY_LIMIT ||
        item.namUocThien > MONEY_LIMIT || item.namKh > MONEY_LIMIT) {
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

    if (!this.viewAppraisalValue) {
      lstCtietBcaoTemp.forEach(item => {
        item.giaTriThamDinh = item.namKh;
      })
    }

    const request = JSON.parse(JSON.stringify(this.formDetail));
    request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
    request.trangThai = trangThai;

    if (lyDoTuChoi) {
      request.lyDoTuChoi = lyDoTuChoi;
    }

    this.spinner.show();
    this.lapThamDinhService.updateLapThamDinh(request).toPromise().then(
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

  // chuc nang check role
  async onSubmit(mcn: string, lyDoTuChoi: string) {
    if (!this.formDetail?.id) {
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
      return;
    }
    const requestGroupButtons = {
      id: this.formDetail.id,
      trangThai: mcn,
      lyDoTuChoi: lyDoTuChoi,
    };
    this.spinner.show();
    await this.lapThamDinhService.approveCtietThamDinh(requestGroupButtons).toPromise().then(async (data) => {
      if (data.statusCode == 0) {
        this.formDetail.trangThai = mcn;
        this.getStatusButton();
        if (mcn == "0") {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
        } else {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
        }
        this._modalRef.close({
          formDetail: this.formDetail,
        });
      } else {
        this.notification.error(MESSAGE.ERROR, data?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    });
    this.spinner.hide();
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
        this.save(mcn, text);
      }
    });
  }

  // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
  getChiMuc(str: string): string {
    str = str.substring(str.indexOf('.') + 1, str.length);
    let xau = "";
    const chiSo: string[] = str.split('.');
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
      xau = '';
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

  // gan editCache.data == lstCtietBcao
  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
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
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.updateEditCache();
  }

  sortByIndex() {
    this.setLevel();
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
    const lstTemp: ItemData[] = [];
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

  setLevel() {
    this.lstCtietBcao.forEach(item => {
      const str: string[] = item.stt.split('.');
      item.level = str.length - 2;
    })
  }

  sum(stt: string) {
    stt = this.getHead(stt);
    while (stt != '0') {
      const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
      const data = this.lstCtietBcao[index];
      this.lstCtietBcao[index] = {
        ...new ItemData(),
        id: data.id,
        stt: data.stt,
        maNdung: data.maNdung,
        tenDmuc: data.tenDmuc,
        level: data.level,
      }
      this.lstCtietBcao.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          this.lstCtietBcao[index].thienNtruoc = sumNumber([this.lstCtietBcao[index].thienNtruoc, item.thienNtruoc]);
          this.lstCtietBcao[index].namDtoan = sumNumber([this.lstCtietBcao[index].namDtoan, item.namDtoan]);
          this.lstCtietBcao[index].namUocThien = sumNumber([this.lstCtietBcao[index].namUocThien, item.namUocThien]);
          this.lstCtietBcao[index].namKh = sumNumber([this.lstCtietBcao[index].namKh, item.namKh]);
          this.lstCtietBcao[index].giaTriThamDinh = sumNumber([this.lstCtietBcao[index].giaTriThamDinh, item.giaTriThamDinh]);
        }
      })
      stt = this.getHead(stt);
    }
  }

  checkEdit(stt: string) {
    if (stt.startsWith('0.1.1.1') || stt.startsWith('0.1.1.2') || stt.startsWith('0.1.1.3')) {
      return false;
    }
    const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
    return lstTemp.every(e => !e.stt.startsWith(stt));
  }

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

  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  }

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  }

  handleCancel() {
    this._modalRef.close();
  }

}
