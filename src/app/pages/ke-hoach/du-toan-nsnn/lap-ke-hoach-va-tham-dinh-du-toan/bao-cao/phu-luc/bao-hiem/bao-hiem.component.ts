import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { UserService } from 'src/app/services/user.service';
import { AMOUNT, displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, LA_MA, mulNumber, sumNumber, Utils } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { DANH_MUC } from './bao-hiem.constant';

export class ItemData {
  id: string;
  stt: string;
  level: number;
  maVtu: string;
  tenVtu: string;
  maDviTinh: string;
  slTuM3: number;
  slDuoiM3: number;
  slTong: number;
  gtTuM3: number;
  gtDuoiM3: number;
  gtTong: number;
}


@Component({
  selector: 'app-bao-hiem',
  templateUrl: './bao-hiem.component.html',
  styleUrls: ['../../bao-cao.component.scss']
})
export class BaoHiemComponent implements OnInit {
  @Input() dataInfo;
  //thong tin chi tiet cua bieu mau
  formDetail: any;
  total: ItemData = new ItemData();
  maDviTien: string = '1';
  thuyetMinh: string;
  namBcao: number;
  //danh muc
  duAns: any[] = DANH_MUC;
  soLaMa: any[] = LA_MA;
  lstCtietBcao: ItemData[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  //trang thai cac nut
  status = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  statusPrint: boolean;
  statusBtnHs: boolean;
  editMoneyUnit = false;
  isDataAvailable = false;
  //nho dem
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  tongHsoBh: number;
  hsBhDuoi: number;
  hsBhTu: number;
  userInfo: any;
  disableHs: boolean = true;
  amount = AMOUNT;
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private lapThamDinhService: LapThamDinhService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private userService: UserService,
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
    this.statusPrint = this.dataInfo?.statusBtnPrint;
    this.userInfo = this.userService.getUserLogin()
    this.hsBhDuoi = this.formDetail?.hsBhDuoi;
    this.hsBhTu = this.formDetail?.hsBhTu;

    this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
      this.lstCtietBcao.push({
        ...item,
      })
    })
    if (this.lstCtietBcao.length == 0) {
      this.duAns.forEach(e => {
        this.lstCtietBcao.push({
          ...new ItemData(),
          id: uuid.v4() + 'FE',
          stt: e.ma,
          tenVtu: e.giaTri,
          maVtu: e.ma,
          maDviTinh: "",
          slTuM3: 0,
          slDuoiM3: 0,
          slTong: 0,
          gtTuM3: 0,
          gtDuoiM3: 0,
          gtTong: 0,
        })
      })
      if (this.dataInfo?.extraData && this.dataInfo.extraData.length > 0) {
        this.dataInfo.extraData.forEach(item => {
          this.lstCtietBcao.push({
            ...new ItemData(),
            id: uuid.v4() + 'FE',
            stt: item.stt,
            level: item.level,
            maVtu: item.maVtu,
            tenVtu: item.tenVtu,
            maDviTinh: item.maDviTinh,
            slTuM3: item.slTuM3,
            slDuoiM3: item.slDuoiM3,
            slTong: item.slTong,
            gtTuM3: item.gtTuM3,
            gtDuoiM3: item.gtDuoiM3,
            gtTong: item.gtTong,
          })
        })
      }
      this.setLevel();
    } else if (!this.lstCtietBcao[0]?.stt) {
      this.lstCtietBcao.forEach(item => {
        item.stt = item.maVtu;
      })
    }
    this.sortByIndex();
    this.sum1();
    this.getTotal();
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

    if (this.userInfo.sub.includes("canbo") && (Utils.statusSave.includes(this.formDetail.trangThai))) {
      this.disableHs = true;
      this.statusBtnHs = true;
    } else {
      this.disableHs = true;
      this.statusBtnHs = false;
    }
  }

  // luu
  async save(trangThai: string) {
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
      // if (item.ncauChiTongSo > MONEY_LIMIT) {
      //     checkMoneyRange = false;
      //     return;
      // }
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

    const request = JSON.parse(JSON.stringify(this.formDetail));
    request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
    request.trangThai = trangThai;
    request.hsBhDuoi = this.hsBhDuoi;
    request.hsBhTu = this.hsBhTu;
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
        this.onSubmit(mcn, text);
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
      // xau = '(' + chiSo[n] + ')';
      xau = chiSo[n];
    }
    if (n == 2) {
      // xau = chiSo[n];
      xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    }
    if (n == 3) {
      // xau = String.fromCharCode(k + 96);
      xau = "-"
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
    if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
      this.editCache[id].edit = true;
    } else {
      this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
      return;
    }
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
    this.getTotal();
  }

  setLevel() {
    this.lstCtietBcao.forEach(item => {
      const str: string[] = item.stt.split('.');
      item.level = str.length - 2;
    })
  }

  addLine(stt: string) {
    let index = -1;
    for (let i = this.lstCtietBcao.length - 1; i > 0; i--) {
      if (this.lstCtietBcao[i].stt.startsWith(stt)) {
        index = i;
        break;
      }
    }
    const tail = stt == this.lstCtietBcao[index].stt ? '1' : (this.getTail(this.lstCtietBcao[index].stt) + 1).toString();
    const item: ItemData = {
      ... new ItemData(),
      id: uuid.v4() + 'FE',
      stt: stt + '.' + tail,
    }
    const str: string[] = item.stt.split('.');
    item.level = str.length - 2;
    this.lstCtietBcao.splice(index + 1, 0, item);
    this.editCache[item.id] = {
      edit: false,
      data: { ...item }
    };
  }


  changeModel(id: string): void {
    this.editCache[id].data.slTong = sumNumber([this.editCache[id].data.slTuM3, this.editCache[id].data.slDuoiM3]);
    this.editCache[id].data.gtTong = sumNumber([this.editCache[id].data.gtTuM3, this.editCache[id].data.gtDuoiM3]);
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
        maVtu: data.maVtu,
        tenVtu: data.tenVtu,
        level: data.level,
      }
      this.lstCtietBcao.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          this.lstCtietBcao[index].gtTuM3 = sumNumber([this.lstCtietBcao[index].gtTuM3, item.gtTuM3]);
          this.lstCtietBcao[index].gtDuoiM3 = sumNumber([this.lstCtietBcao[index].gtDuoiM3, item.gtDuoiM3]);
          this.lstCtietBcao[index].gtTong = sumNumber([this.lstCtietBcao[index].gtTuM3, this.lstCtietBcao[index].gtDuoiM3]);
        }
      })
      stt = this.getHead(stt);
    }
    this.getTotal();
  }

  sum1() {
    this.lstCtietBcao.forEach(item => {
      let stt = this.getHead(item.stt);
      while (stt != '0') {
        const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
        const data = this.lstCtietBcao[index];
        this.lstCtietBcao[index] = {
          ...new ItemData(),
          id: data.id,
          stt: data.stt,
          maVtu: data.maVtu,
          tenVtu: data.tenVtu,
          level: data.level,
        }
        this.lstCtietBcao.forEach(item => {
          if (this.getHead(item.stt) == stt) {
            this.lstCtietBcao[index].gtTuM3 = sumNumber([this.lstCtietBcao[index].gtTuM3, item.gtTuM3]);
            this.lstCtietBcao[index].gtDuoiM3 = sumNumber([this.lstCtietBcao[index].gtDuoiM3, item.gtDuoiM3]);
            this.lstCtietBcao[index].gtTong = sumNumber([this.lstCtietBcao[index].gtTuM3, this.lstCtietBcao[index].gtDuoiM3]);
          }
        })
        stt = this.getHead(stt);
      }
      this.getTotal();
    })
  }

  getTotal() {
    this.total = new ItemData();
    this.lstCtietBcao.forEach(item => {
      if (item.level == 0) {
        this.total.gtTuM3 = sumNumber([this.total.gtTuM3, item.gtTuM3]);
        this.total.gtDuoiM3 = sumNumber([this.total.gtDuoiM3, item.gtDuoiM3]);
        this.total.gtTong = sumNumber([this.total.gtTuM3, this.total.gtDuoiM3]);
      }
    })
    this.SaveHs();
    // this.tongHsoBh = this.hsBhDuoi * this.total.gtDuoiM3 + this.hsBhTu * this.total.gtTuM3;
  }

  checkEdit(stt: string) {
    const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
    return lstTemp.every(e => !e.stt.startsWith(stt));
  }

  checkAdd(data: ItemData) {
    if (data.stt.includes('0.2.2.') && (data.level == 2 && data.maVtu)) {
      return true;
    }
    return false;
  }
  checkDelete(maDa: string) {
    if (!maDa) {
      return true;
    }
    return false;
  }

  //xóa dòng
  deleteLine(stt: string) {
    const head = this.getHead(stt);
    const tail = this.getTail(stt);
    this.lstCtietBcao = this.lstCtietBcao.filter(e => e.stt !== stt);
    this.lstCtietBcao.forEach(item => {
      if (item.stt.startsWith(head) && item.stt != head && this.getTail(item.stt) > tail) {
        item.stt = head + '.' + (this.getTail(item.stt) - 1).toString();
      }
    })
    this.sum(stt);
    this.updateEditCache();
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
        item.stt = item.stt.replace(nho, str);
      })
    })
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

  displayNumber(num: number): string {
    return displayNumber(num);
  }

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  }

  handleCancel() {
    this._modalRef.close();
  }

  suaHeSo() {
    this.disableHs = false;
  }

  SaveHs() {
    this.disableHs = true;
    this.tongHsoBh = mulNumber(divNumber(this.hsBhTu, 100), this.total.gtTuM3) + mulNumber(divNumber(this.hsBhDuoi, 100), this.total.gtDuoiM3);
  }
}
