import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, exchangeMoney, mulNumber, sumNumber } from 'src/app/Utility/func';
import { DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from 'uuid';

export class ItemData {
  id: any;
  danhMuc: string;
  maDmuc: string;
  tenDanhMuc: string;
  maDviTinh: string;
  namDtDmuc: number;
  namDtSluong: number;
  namDtTtien: number;
  stt: string;
  level: any;
  checked: boolean;
}

@Component({
  selector: 'app-phu-luc-02',
  templateUrl: './phu-luc-02.component.html',
  styleUrls: ['./phu-luc-02.component.scss']
})

export class PhuLuc02Component implements OnInit {
  @Input() dataInfo;
  //thong tin chung bao cao
  maDviTien: string = '1';
  formDetail: any;
  thuyetMinh: string;
  lstCtietBcao: ItemData[] = [];
  maDviTao: any;
  total = new ItemData();
  namBcao: number;
  //danh muc
  donViTiens: any[] = DON_VI_TIEN;
  lstVatTuFull = [];
  dsDinhMuc: any[] = [];
  soLaMa: any[] = LA_MA;
  //trang thai cac nut
  editMoneyUnit = false;
  status = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  statusPrint: boolean;
  isDataAvailable = false;
  allChecked = false;

  initItem: ItemData = new ItemData();
  //nho dem
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  userInfo: any;
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private lapThamDinhService: LapThamDinhService,
    private giaoDuToanService: GiaoDuToanChiService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    public userService: UserService,
  ) {
  }


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
    // this.status = false;
    this.namBcao = this.dataInfo?.namBcao;
    this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
    this.statusBtnOk = this.dataInfo?.statusBtnOk;
    this.statusPrint = this.dataInfo?.statusBtnPrint;
    this.formDetail?.lstCtietBcaos.forEach(item => {
      this.lstCtietBcao.push({
        ...item,
      })
    })
    await this.getDinhMuc();
    this.lstCtietBcao.forEach(item => {
      if (!item.tenDanhMuc) {
        const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.danhMuc && e.loaiBaoQuan == item.maDmuc);
        item.tenDanhMuc = dinhMuc?.tenDinhMuc;
        item.namDtDmuc = dinhMuc?.tongDmuc;
        item.maDviTinh = dinhMuc?.donViTinh;
        item.namDtTtien = mulNumber(item.namDtDmuc, item.namDtSluong);
      }
    })

    this.sortByIndex();
    this.getTotal();
    this.updateEditCache();
    this.getStatusButton();

    this.spinner.hide();
  }

  async getDinhMuc() {
    const request = {
      loaiDinhMuc: '03',
      maDvi: this.maDviTao,
    }
    await this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
      res => {
        if (res.statusCode == 0) {
          this.dsDinhMuc = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    )
  }

  setIndex() {
    const lstVtuTemp = this.lstCtietBcao.filter(e => !e.maDmuc);
    for (let i = 0; i < lstVtuTemp.length; i++) {
      const stt = '0.' + (i + 1).toString();
      const index = this.lstCtietBcao.findIndex(e => e.id == lstVtuTemp[i].id);
      this.lstCtietBcao[index].stt = stt;
      const lstDmTemp = this.lstCtietBcao.filter(e => e.danhMuc == lstVtuTemp[i].danhMuc && !!e.maDmuc);
      for (let j = 0; j < lstDmTemp.length; j++) {
        const ind = this.lstCtietBcao.findIndex(e => e.id == lstDmTemp[j].id);
        this.lstCtietBcao[ind].stt = stt + '.' + (j + 1).toString();
      }
    }
    lstVtuTemp.forEach(item => {
      this.sum(item.stt + '.1');
    })
  }

  sortByIndex() {
    if (this.lstCtietBcao?.length > 0 && !this.lstCtietBcao[0].stt) {
      this.setIndex();
    }
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

  // lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
  getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
  }
  // lấy phần đuôi của stt
  getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
  }

  // chuyển đổi stt đang được mã hóa thành dạng I, II, a, b, c, ...
  getChiMuc(str: string): string {
    str = str.substring(str.indexOf('.') + 1, str.length);
    let xau = "";
    const chiSo: any = str.split('.');
    const n: number = chiSo.length - 1;
    if (n == 0) {
      xau = chiSo[n];
    }
    if (n == 1) {
      xau = "-";
    }
    return xau;
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
      if (item.namDtTtien > MONEY_LIMIT) {
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

    const request = JSON.parse(JSON.stringify(this.formDetail));
    request.lstCtietBcaos = lstCtietBcaoTemp;
    request.trangThai = trangThai;

    if (lyDoTuChoi) {
      request.lyDoTuChoi = lyDoTuChoi;
    }

    this.spinner.show();
    this.giaoDuToanService.updateCTietBcao(request).toPromise().then(
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

  // luu thay doi
  saveEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.updateEditCache();
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
  }

  checkEdit(stt: string) {
    const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
    return lstTemp.every(e => !e.stt.startsWith(stt));
  }

  checkDelete(stt: string) {
    const level = stt.split('.').length - 2;
    if (level == 0) {
      return true;
    }
    return false;
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

  // click o checkbox single
  updateSingleChecked(): void {
    if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.allChecked = false;
    }
  }

  // click o checkbox all
  updateAllChecked(): void {
    this.lstCtietBcao.forEach(item => {
      item.checked = this.allChecked;
    })
  }

  deleteLine(id: string) {
    const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    const nho: string = this.lstCtietBcao[index].stt;
    const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    const stt: string = this.lstCtietBcao[index].stt;
    //xóa phần tử và con của nó
    this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    const lstIndex: number[] = [];
    for (let i = this.lstCtietBcao.length - 1; i >= index; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, -1);
    this.sum(stt);
    this.getTotal();
    this.updateEditCache();
  }

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


  selectGoods() {
    const modalTuChoi = this.modal.create({
      nzTitle: 'Danh sách hàng hóa',
      nzContent: DialogDanhSachVatTuHangHoaComponent,
      nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
      nzMaskClosable: false,
      nzClosable: false,
      nzWidth: '900px',
      nzFooter: null,
      nzComponentParams: {},
    });
    modalTuChoi.afterClose.subscribe(async (data) => {
      if (data) {
        if (this.lstCtietBcao.findIndex(e => e.danhMuc == data.ma) == -1) {
          //tim so thu tu cho loai vat tu moi
          let index = 1;
          this.lstCtietBcao.forEach(item => {
            if (item.danhMuc && !item.maDmuc) {
              index += 1;
            }
          })
          const stt = '0.' + index.toString();
          //them vat tu moi vao bang
          this.lstCtietBcao.push({
            ... new ItemData(),
            id: uuid.v4() + 'FE',
            stt: stt,
            danhMuc: data.ma,
            tenDanhMuc: data.ten,
            level: 0,
          })
          const lstTemp = this.dsDinhMuc.filter(e => e.cloaiVthh == data.ma);
          for (let i = 1; i <= lstTemp.length; i++) {
            this.lstCtietBcao.push({
              ...new ItemData(),
              id: uuid.v4() + 'FE',
              stt: stt + '.' + i.toString(),
              danhMuc: data.ma,
              maDmuc: lstTemp[i - 1].loaiBaoQuan,
              tenDanhMuc: lstTemp[i - 1].tenDinhMuc,
              maDviTinh: lstTemp[i - 1].donViTinh,
              level: 1,
              namDtDmuc: lstTemp[i - 1].tongDmuc,
            })
          }
          this.updateEditCache();
        }
      }
    });
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
        danhMuc: data.danhMuc,
        maDmuc: data.maDmuc,
        tenDanhMuc: data.tenDanhMuc,
        level: data.level,
      }
      this.lstCtietBcao.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          this.lstCtietBcao[index].namDtSluong = sumNumber([this.lstCtietBcao[index].namDtSluong, item.namDtSluong]);
          this.lstCtietBcao[index].namDtTtien = sumNumber([this.lstCtietBcao[index].namDtTtien, item.namDtTtien]);

        }
      })
      stt = this.getHead(stt);
    }
    this.getTotal();
  }

  getTotal() {
    this.total = new ItemData();
    this.lstCtietBcao.forEach(item => {
      if (item.level == 0) {
        this.total.namDtTtien = sumNumber([this.total.namDtTtien, item.namDtTtien]);
      }
    })
  }

  changeModel(id: string): void {
    this.editCache[id].data.namDtTtien = mulNumber(this.editCache[id].data.namDtDmuc, this.editCache[id].data.namDtSluong);
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

  getStatusButton() {
    if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }
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
