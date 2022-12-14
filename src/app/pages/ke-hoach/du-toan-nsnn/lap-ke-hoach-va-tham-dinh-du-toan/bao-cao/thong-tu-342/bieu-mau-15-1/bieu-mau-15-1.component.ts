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
// import { DANH_MUC } from './bieu-mau-15-1.constant';

export class ItemData {
  id: string;
  stt: string;
  maLvuc: string;
  thienTsoBcTdiem: number;
  thienTsoBcTqGiao: number;
  thienQlPcap: number;
  thienLuongBac: number;
  thienPcapLuong: number;
  thienDgopLuong: number;
  thienKhac: number;
  dtoanTsoBcheTqGiao: number;
  dtoanQluongPcap: number;
  dtoanLuongBac: number;
  dtoanPcapLuong: number;
  dtoanDgopLuong: number;
  dtoanKhac: number;
  uocThTsoBcTqGiao: number;
  uocThTsoBcTdiem: number;
  uocThQlPcap: number;
  uocThLuongBac: number;
  uocThPCapLuong: number;
  uocThDgopLuong: number;
  uocThKhac: number;
  namKhTsoBcTqGiao: number;
  namKhQlPcap: number;
  namKhLuongBac: number;
  namKhPcapLuong: number;
  namKhDgopLuong: number;
  namKhKhac: number;
  checked: boolean;
}


@Component({
  selector: 'app-bieu-mau-15-1',
  templateUrl: './bieu-mau-15-1.component.html',
  styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau151Component implements OnInit {
  @Input() dataInfo;
  //thong tin chi tiet cua bieu mau
  formDetail: any;
  total: ItemData = new ItemData();
  maDviTien: string = '1';
  thuyetMinh: string;
  //danh muc
  // linhVucChis: any[] = DANH_MUC;
  linhVucChis: any[] = [];
  soLaMa: any[] = LA_MA;
  lstCtietBcao: ItemData[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  //trang thai cac nut
  status = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  editMoneyUnit = false;
  isDataAvailable = false;
  //nho dem
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  allChecked = false;
  listIdDelete = "";
  namBaoCao: string;
  namTruoc: string;
  namKeHoach: string;

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
    this.namBaoCao = this.dataInfo?.namBcao;
    this.namTruoc = (Number(this.namBaoCao) - 1).toString();
    this.namKeHoach = (Number(this.namBaoCao) + 1).toString();
    this.thuyetMinh = this.formDetail?.thuyetMinh;
    this.status = this.dataInfo?.status;
    this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
    this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
      this.lstCtietBcao.push({
        ...item,
        checked: false,
      })
    })
    // if (this.lstCtietBcao.length == 0) {
    //   this.linhVucChis.forEach(e => {
    //     debugger
    //     this.lstCtietBcao.push({
    //       ...new ItemData(),
    //       id: uuid.v4() + 'FE',
    //       stt: e.ma,
    //       maLvuc: e.ma,
    //       checked: false,
    //     })
    //   })
    // } else if (!this.lstCtietBcao[0]?.stt) {
    //   this.lstCtietBcao.forEach(item => {
    //     item.stt = item.maLvuc;
    //   })
    // }
    // this.sortByIndex();
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
      //   checkMoneyRange = false;
      //   return;
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

    this.spinner.show();
    this.lapThamDinhService.updateLapThamDinh(request).toPromise().then(
      async data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          this.formDetail = data.data;
          this._modalRef.close(this.formDetail);
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
        this._modalRef.close(this.formDetail);
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
      xau = chiSo[n];
    }
    if (n == 2) {
      xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    }
    if (n == 3) {
      xau = String.fromCharCode(k + 96);
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
    // this.sum(this.lstCtietBcao[index].stt);
    this.getTotal();
    this.updateEditCache();
  }


  changeModel(id: string): void {
    this.editCache[id].data.thienQlPcap = sumNumber([this.editCache[id].data.thienLuongBac, this.editCache[id].data.thienPcapLuong, this.editCache[id].data.thienDgopLuong, this.editCache[id].data.thienKhac]);
    this.editCache[id].data.dtoanQluongPcap = sumNumber([this.editCache[id].data.dtoanLuongBac, this.editCache[id].data.dtoanPcapLuong, this.editCache[id].data.dtoanDgopLuong, this.editCache[id].data.dtoanKhac]);
    this.editCache[id].data.uocThQlPcap = sumNumber([this.editCache[id].data.uocThLuongBac, this.editCache[id].data.uocThPCapLuong, this.editCache[id].data.uocThDgopLuong, this.editCache[id].data.uocThKhac]);
    this.editCache[id].data.namKhQlPcap = sumNumber([this.editCache[id].data.namKhLuongBac, this.editCache[id].data.namKhPcapLuong, this.editCache[id].data.namKhDgopLuong, this.editCache[id].data.namKhKhac]);
    // this.editCache[id].data.ncauChiTongSo = sumNumber([this.editCache[id].data.ncauChiTrongDoChiCs, this.editCache[id].data.ncauChiTrongDoChiMoi]);
  }

  getLowStatus(str: string) {
    const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
    if (index == -1) {
      return false;
    }
    return true;
  }

  // sum(stt: string) {
  //   stt = this.getHead(stt);
  //   while (stt != '0') {
  //     const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
  //     const data = this.lstCtietBcao[index];
  //     this.lstCtietBcao[index] = {
  //       ...new ItemData(),
  //       id: data.id,
  //       stt: data.stt,
  //       maLvuc: data.maLvuc,
  //       // level: data.level,
  //     }
  //     this.lstCtietBcao.forEach(item => {
  //       if (this.getHead(item.stt) == stt) {
  //         this.lstCtietBcao[index].thienTsoBcTqGiao = sumNumber([this.lstCtietBcao[index].thienTsoBcTqGiao, item.thienTsoBcTqGiao]);
  //         this.lstCtietBcao[index].ncauChiTrongDoChiCs = sumNumber([this.lstCtietBcao[index].ncauChiTrongDoChiCs, item.ncauChiTrongDoChiCs]);
  //         this.lstCtietBcao[index].ncauChiTrongDoChiMoi = sumNumber([this.lstCtietBcao[index].ncauChiTrongDoChiMoi, item.ncauChiTrongDoChiMoi]);
  //         this.lstCtietBcao[index].ncauChiChiaRaDtuPtrien = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaDtuPtrien, item.ncauChiChiaRaDtuPtrien]);
  //         this.lstCtietBcao[index].ncauChiChiaRaChiCs1 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiCs1, item.ncauChiChiaRaChiCs1]);
  //         this.lstCtietBcao[index].ncauChiChiaRaChiMoi1 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiMoi1, item.ncauChiChiaRaChiMoi1]);
  //         this.lstCtietBcao[index].ncauChiChiaRaChiTx = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiTx, item.ncauChiChiaRaChiTx]);
  //         this.lstCtietBcao[index].ncauChiChiaRaChiCs2 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiCs2, item.ncauChiChiaRaChiCs2]);
  //         this.lstCtietBcao[index].ncauChiChiaRaChiMoi2 = sumNumber([this.lstCtietBcao[index].ncauChiChiaRaChiMoi2, item.ncauChiChiaRaChiMoi2]);
  //       }
  //     })
  //     stt = this.getHead(stt);
  //   }
  //   this.getTotal();
  // }

  getTotal() {
    this.total = new ItemData();
    this.lstCtietBcao.forEach(item => {
      // if (item.level == 0) {
      this.total.thienTsoBcTdiem = sumNumber([this.total.thienTsoBcTdiem, item.thienTsoBcTdiem]);
      this.total.thienTsoBcTqGiao = sumNumber([this.total.thienTsoBcTqGiao, item.thienTsoBcTqGiao]);
      this.total.thienQlPcap = sumNumber([this.total.thienQlPcap, item.thienQlPcap]);
      this.total.thienLuongBac = sumNumber([this.total.thienLuongBac, item.thienLuongBac]);
      this.total.thienPcapLuong = sumNumber([this.total.thienPcapLuong, item.thienPcapLuong]);
      this.total.thienDgopLuong = sumNumber([this.total.thienDgopLuong, item.thienDgopLuong]);
      this.total.thienKhac = sumNumber([this.total.thienKhac, item.thienKhac]);
      this.total.dtoanTsoBcheTqGiao = sumNumber([this.total.dtoanTsoBcheTqGiao, item.dtoanTsoBcheTqGiao]);
      this.total.dtoanQluongPcap = sumNumber([this.total.dtoanQluongPcap, item.dtoanQluongPcap]);
      this.total.dtoanLuongBac = sumNumber([this.total.dtoanLuongBac, item.dtoanLuongBac]);
      this.total.dtoanPcapLuong = sumNumber([this.total.dtoanPcapLuong, item.dtoanPcapLuong]);
      this.total.dtoanDgopLuong = sumNumber([this.total.dtoanDgopLuong, item.dtoanDgopLuong]);
      this.total.dtoanKhac = sumNumber([this.total.dtoanKhac, item.dtoanKhac]);
      this.total.uocThTsoBcTqGiao = sumNumber([this.total.uocThTsoBcTqGiao, item.uocThTsoBcTqGiao]);
      this.total.uocThTsoBcTdiem = sumNumber([this.total.uocThTsoBcTdiem, item.uocThTsoBcTdiem]);
      this.total.uocThQlPcap = sumNumber([this.total.uocThQlPcap, item.uocThQlPcap]);
      this.total.uocThLuongBac = sumNumber([this.total.uocThLuongBac, item.uocThLuongBac]);
      this.total.uocThPCapLuong = sumNumber([this.total.uocThPCapLuong, item.uocThPCapLuong]);
      this.total.uocThDgopLuong = sumNumber([this.total.uocThDgopLuong, item.uocThDgopLuong]);
      this.total.uocThKhac = sumNumber([this.total.uocThKhac, item.uocThKhac]);
      this.total.namKhTsoBcTqGiao = sumNumber([this.total.namKhTsoBcTqGiao, item.namKhTsoBcTqGiao]);
      this.total.namKhQlPcap = sumNumber([this.total.namKhQlPcap, item.namKhQlPcap]);
      this.total.namKhLuongBac = sumNumber([this.total.namKhLuongBac, item.namKhLuongBac]);
      this.total.namKhPcapLuong = sumNumber([this.total.namKhPcapLuong, item.namKhPcapLuong]);
      this.total.namKhDgopLuong = sumNumber([this.total.namKhDgopLuong, item.namKhDgopLuong]);
      this.total.namKhKhac = sumNumber([this.total.namKhKhac, item.namKhKhac]);
      // }
    })
  }
  checkEdit(stt: string) {
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

  addLine(id: number): void {
    const item: ItemData = {
      id: uuid.v4(),
      stt: '',
      maLvuc: '',
      thienTsoBcTqGiao: null,
      thienTsoBcTdiem: null,
      thienQlPcap: null,
      thienLuongBac: null,
      thienPcapLuong: null,
      thienDgopLuong: null,
      thienKhac: null,
      dtoanTsoBcheTqGiao: null,
      dtoanQluongPcap: null,
      dtoanLuongBac: null,
      dtoanPcapLuong: null,
      dtoanDgopLuong: null,
      dtoanKhac: null,
      uocThTsoBcTqGiao: null,
      uocThTsoBcTdiem: null,
      uocThQlPcap: null,
      uocThLuongBac: null,
      uocThPCapLuong: null,
      uocThDgopLuong: null,
      uocThKhac: null,
      namKhTsoBcTqGiao: null,
      namKhQlPcap: null,
      namKhLuongBac: null,
      namKhPcapLuong: null,
      namKhDgopLuong: null,
      namKhKhac: null,
      // gtriTdinhTsoBcTqGiao: null,
      // gtriTdinhQlPcap: null,
      // gtriTdinhLuongBac: null,
      // gtriTdinhPcapLuong: null,
      // gtriTdinhDgopLuong: null,
      checked: false,
    };

    this.lstCtietBcao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
  }
  // check all
  updateAllChecked(): void {
    if (this.allChecked) {
      this.lstCtietBcao = this.lstCtietBcao.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.lstCtietBcao = this.lstCtietBcao.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  // check tung dong
  updateSingleChecked(): void {
    if (this.lstCtietBcao.every(item => !item.checked)) {
      this.allChecked = false;
    } else if (this.lstCtietBcao.every(item => item.checked)) {
      this.allChecked = true;
    }
  }

  // xoa 1 dong
  deleteLine(id: any) {
    const index: number = this.lstCtietBcao.findIndex(e => e.id === id);
    const nho: string = this.lstCtietBcao[index].stt;
    //xóa phần tử và con của nó
    this.lstCtietBcao = this.lstCtietBcao.filter(e => e.id !== id);
    // this.replaceIndex(lstIndex, -1);
    // this.updateEditCache();
  }

  // xoa het
  deleteAllChecked() {
    this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.checked);
    this.allChecked = false;
    // this.updateEditCache();
    // const lstId: any[] = [];
    // this.lstCtietBcao.forEach(item => {
    //   if (item.checked) {
    //     lstId.push(item.id);
    //   }
    // })
    // lstId.forEach(item => {
    //   if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
    //     this.deleteLine(item);
    //   }
    // })
  }

  // xoa theo id
  deleteById(id: any): void {
    this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
    if (typeof id == "number") {
      this.listIdDelete += id + ","
    }
  }

}
