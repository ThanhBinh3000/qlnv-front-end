import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA, MONEY_LIMIT, sumNumber } from "src/app/Utility/utils";
import * as uuid from "uuid";
// import { DANH_MUC } from './bieu-mau-18.constant';

export class ItemData {
  id: string;
  khvonphiLapThamDinhCtietId: string;
  stt: string;
  maKho: string;
  tenNhaKho: string;
  khoiTich: number;
  tenHang: string;
  maHang: string;
  soLuong: number;
  giaTri: number;
  checked: boolean;
}


@Component({
  selector: 'app-bao-hiem-hang',
  templateUrl: './bao-hiem-hang.component.html',
  styleUrls: ['../../bao-cao.component.scss']
})
export class BaoHiemHangComponent implements OnInit {
  @Input() dataInfo;
  //thong tin chi tiet cua bieu mau
  formDetail: any;
  total: ItemData = new ItemData();
  maDviTien: string = '1';
  thuyetMinh: string;
  //danh muc
  linhVucChis: any[] = [];
  listDanhMucKho: any[] = [];
  listDiemKho: any[] = [];
  listKho: any[] = [];
  listKhoFull: any[] = [];
  soLaMa: any[] = LA_MA;
  lstCtietBcao: ItemData[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  //trang thai cac nut
  status = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  statusPrint: boolean;
  editMoneyUnit = false;
  isDataAvailable = false;
  //nho dem
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  listIdDelete = "";
  allChecked = false;
  maDviTao!: any;

  listVattu: any[] = [];
  lstVatTuFull: any[] = [];
  lstDviFull: any[] = [];
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private lapThamDinhService: LapThamDinhService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucHDVService,
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
    this.thuyetMinh = this.formDetail?.thuyetMinh;
    this.status = this.dataInfo?.status;
    this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
    this.statusPrint = this.dataInfo?.statusBtnPrint;
    this.maDviTao = this.dataInfo?.maDvi;
    await this.getDmKho();
    await this.quanLyVonPhiService.getDmucDviTrucThuocTCDT().toPromise().then(res => {
      if (res.statusCode == 0) {
        const listDsDvi = res.data.children
        // this.listDanhSachCuc = res.data;
        // listDsDvi.forEach(item => {
        //     item.children.forEach(child => {
        //         listDsDvi.push(child)
        //         child.children.forEach(children => {
        //             listDsDvi.push(child)
        //         })
        //     })
        // })
        // this.listDanhSachCuc = listDsDvi;
        // =============
        const lstDviFullTemp = res.data;
        const lstTenKhoFull = []
        this.lstDviFull.push(res.data)
        lstDviFullTemp.children.forEach(item => {
          this.lstDviFull.push(item)
          item.children.forEach(child => {
            this.lstDviFull.push(child)
            child.children.forEach(children => {
              this.lstDviFull.push(children)

            })
          })
        })

        lstDviFullTemp.children.forEach(itm => {
          itm.children.forEach(itm1 => {
            itm1.children.forEach(itm2 => {
              itm2.children.forEach(itm3 => {
                lstTenKhoFull.push(itm3)
              })
            })
          })
        })

        lstTenKhoFull.forEach(item => {
          this.lstDviFull.push(item)
        })

      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    await this.addListKho();
    this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
      this.lstCtietBcao.push({
        ...item,
      })
    })
    await this.danhMucService.dMVatTu().toPromise().then(res => {
      if (res.statusCode == 0) {
        this.listVattu = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
    await this.addVatTu()
    this.getTotal();
    this.updateEditCache();
    this.getStatusButton();
    this.spinner.hide();
  }

  addListKho() {
    this.listDanhMucKho.forEach(itm => {
      itm.children.forEach(item => {
        this.listDiemKho.push({
          ...item,
          id: `${item.id}`
        })
      })
    })
    this.listDiemKho.forEach(item => {
      this.listKhoFull.push(item)
      item.children.forEach(itmCon => {
        this.listKhoFull.push(itmCon)
      })
    })

  }


  changeVatTu(maDanhMuc: any, id: any) {
    this.editCache[id].data.tenHang = this.lstVatTuFull.find(vt => vt.ma === maDanhMuc)?.ten;
  }

  changeDiemKho(maKho: any) {
    const maKhoNum = Number(maKho)
    const nhaKho = this.listDiemKho.find(itm => itm.id == maKhoNum)?.children;

    nhaKho.forEach(itemChild => {
      itemChild.id = `${itemChild.id}`
    })
    this.listKho = nhaKho

  };

  async addVatTu() {

    const vatTuTemp = []
    this.listVattu.forEach(vatTu => {
      if (vatTu.child) {
        vatTu.child.forEach(vatTuCon => {
          vatTuTemp.push({
            ...vatTuCon,
          })
        })
      }
    })

    this.lstVatTuFull = vatTuTemp;
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
    this.getTotal()
  }

  deleteLine(id: any) {
    const index: number = this.lstCtietBcao.findIndex(e => e.id === id);
    const nho: string = this.lstCtietBcao[index].stt;
    //xóa phần tử và con của nó
    this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
    // this.replaceIndex(lstIndex, -1);
    this.getTotal();
    this.updateEditCache();
  }

  async getDmKho() {
    await this.quanLyVonPhiService.dmKho(this.maDviTao).toPromise().then(res => {
      if (res.statusCode == 0) {
        this.listDanhMucKho = res.data;
      } else {
        this.notification.error(MESSAGE.ERROR, res?.msg);
      }
    }, err => {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    })
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
    this.getTotal();
    this.updateEditCache();
  }

  changeModel(id: string): void {

  }

  sum(stt: string) {
    this.getTotal();
  }

  getTotal() {
    this.total = new ItemData();
    this.total.giaTri = 0
    this.lstCtietBcao.forEach(item => {
      this.total.giaTri = sumNumber([this.total.giaTri, item.giaTri]);
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

  displayNumber(num: number): string {
    return displayNumber(num)
  }

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  }

  handleCancel() {
    this._modalRef.close();
  }

  deleteById(id: any): void {
    this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
    if (typeof id == "number") {
      this.listIdDelete += id + ","
    }
  }

  addNewReport(id: any) {
    const item: ItemData = {
      id: uuid.v4(),
      khvonphiLapThamDinhCtietId: "",
      stt: "0",
      maKho: "",
      tenNhaKho: "",
      khoiTich: 0,
      tenHang: "",
      maHang: "",
      soLuong: 0,
      giaTri: 0,
      checked: false,
    };

    this.lstCtietBcao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };

  }

  updateSingleChecked(): void {
    if (this.lstCtietBcao.every(item => !item.checked)) {
      this.allChecked = false;
    } else if (this.lstCtietBcao.every(item => item.checked)) {
      this.allChecked = true;
    }
  };

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

}

