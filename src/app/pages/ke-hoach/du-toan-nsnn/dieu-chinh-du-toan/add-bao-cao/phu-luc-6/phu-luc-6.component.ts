import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { displayNumber, exchangeMoney, mulNumber, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from 'uuid';
import { CurrencyMaskInputMode } from 'ngx-currency';
export class ItemData {
  level: any;
  checked: boolean;
  id: string;
  qlnvKhvonphiDchinhCtietId: string;
  stt: string;
  noiDung: string;
  maDviTinh: string;
  sluongKhGiao: number;
  sluongThienTte: number;
  sluongThienUocThien: number;
  sluongThienCong: number;
  sluongThienDmuc: number;
  sluongThienTtien: number;
  dtoanGiaoLke: number;
  dtoanDchinh: number;
  dtoanVuTvqtDnghi: number;
  kphiThieu: number;
  maNdung: string;
  maDmuc: string;
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
  selector: 'app-phu-luc-6',
  templateUrl: './phu-luc-6.component.html',
  styleUrls: ['./phu-luc-6.component.scss']
})
export class PhuLuc6Component implements OnInit {
  @Input() dataInfo;
  donViTiens: any[] = DON_VI_TIEN;
  editMoneyUnit = false;
  maDviTien: string = '1';
  lstCtietBcao: ItemData[] = [];
  formDetail: any;
  thuyetMinh: string;
  status = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  statusPrint: boolean;
  listVattu: any[] = [];
  lstVatTuFull = [];
  isDataAvailable = false;
  dsDinhMuc: any[] = [];
  dsDinhMucX: any[] = [];
  dsDinhMucN: any[] = [];
  maDviTao: any;
  soLaMa: any[] = LA_MA;
  allChecked = false;
  amount = AMOUNT;
  amount1 = AMOUNT1;
  tongSo: number;
  tongSoTd: number;
  tongThienNamTruoc: number;
  tongDuToan: number;
  tongUoc: number;
  tongDmuc: number;
  editAppraisalValue: boolean;
  viewAppraisalValue: boolean;

  //nho dem
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  tongDieuChinhTang: number;
  tongDieuChinhGiam: number;
  dToanVuTang: number;
  dToanVuGiam: number;
  total: ItemData = new ItemData();
  namBcao: number;
  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private dieuChinhService: DieuChinhService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private danhMucService: DanhMucHDVService,
    private quanLyVonPhiService: QuanLyVonPhiService,
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
    this.maDviTao = this.dataInfo?.maDvi;
    this.thuyetMinh = this.formDetail?.thuyetMinh;
    this.status = this.dataInfo?.status;
    this.namBcao = this.dataInfo?.namBcao;
    this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
    this.statusPrint = this.dataInfo?.statusBtnPrint;
    this.editAppraisalValue = this.dataInfo?.editRecommendedValue;
    this.viewAppraisalValue = this.dataInfo?.viewRecommendedValue;
    this.formDetail?.lstCtietDchinh.forEach(item => {
      this.lstCtietBcao.push({
        ...item,
      })
    })
    // await this.getDinhMucPL2N();
    await this.getDinhMucPL2X();

    this.dsDinhMuc = this.dsDinhMucX

    this.lstCtietBcao.forEach(item => {
      if (!item.noiDung) {
        const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.maNdung && e.loaiDinhMuc == item.maDmuc);
        item.noiDung = dinhMuc?.tenDinhMuc;
        item.sluongThienDmuc = dinhMuc?.tongDmuc;
        item.maDviTinh = dinhMuc?.donViTinh;
        item.sluongThienTtien = mulNumber(item.sluongThienDmuc, item.sluongThienCong);
      } else {
        const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.maNdung && e.loaiDinhMuc == item.maDmuc);
        // item.noiDung = dinhMuc?.tenDinhMuc;
        item.sluongThienDmuc = dinhMuc?.tongDmuc;
        item.maDviTinh = dinhMuc?.donViTinh;
        item.sluongThienTtien = mulNumber(item.sluongThienDmuc, item.sluongThienCong);
      }
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
    this.sortByIndex();
    this.sum1();
    this.tinhTong();
    this.updateEditCache();
    this.getStatusButton();

    this.spinner.hide();
  }

  async getDinhMucPL2N() {
    const request = {
      loaiDinhMuc: '01',
      maDvi: this.maDviTao,
    }

    await this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
      res => {
        if (res.statusCode == 0) {
          this.dsDinhMucN = res.data;
        } else {
          this.notification.error(MESSAGE.ERROR, res?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    )
  };
  async getDinhMucPL2X() {
    const request = {
      loaiDinhMuc: '02',
      maDvi: this.maDviTao,
    }
    await this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
      res => {
        if (res.statusCode == 0) {
          this.dsDinhMucX = res.data;
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
      const lstDmTemp = this.lstCtietBcao.filter(e => e.maNdung == lstVtuTemp[i].maNdung && !!e.maDmuc);
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

  checkDelete(stt: string) {
    const level = stt.split('.').length - 2;
    if (level == 0) {
      return true;
    }
    return false;
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
      if (item.sluongThienTtien > MONEY_LIMIT) {
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
      lstCtietBcaoTemp?.forEach(item => {
        item.dtoanVuTvqtDnghi = item.dtoanDchinh;
      })
    }

    const request = JSON.parse(JSON.stringify(this.formDetail));
    request.lstCtietDchinh = lstCtietBcaoTemp;
    request.trangThai = trangThai;
    if (lyDoTuChoi) {
      request.lyDoTuChoi = lyDoTuChoi;
    }
    this.spinner.show();
    this.dieuChinhService.updatePLDieuChinh(request).toPromise().then(
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
    await this.dieuChinhService.approveDieuChinhPheDuyet(requestGroupButtons).toPromise().then(async (data) => {
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
  };

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
  };

  // xoa tat ca cac dong duoc check
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

  // start edit
  startEdit(id: string): void {
    if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
      this.editCache[id].edit = true;
    } else {
      this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
      return;
    }
  }

  // luu thay doi
  saveEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.updateEditCache();
    this.sum(this.lstCtietBcao[index].stt);
  }

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id);
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCtietBcao[index] },
      edit: false
    };
    this.tinhTong();
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

  deleteLine(id: any) {
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
    this.tinhTong();
    this.sum(stt);
    this.updateEditCache();
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
        if (this.lstCtietBcao.findIndex(e => e.maNdung == data.ma) == -1) {
          //tim so thu tu cho loai vat tu moi
          let index = 1;
          this.lstCtietBcao.forEach(item => {
            if (item.maNdung && !item.maDmuc) {
              index += 1;
            }
          })
          const stt = '0.' + index.toString();
          //them vat tu moi vao bang
          this.lstCtietBcao.push({
            ... new ItemData(),
            id: uuid.v4() + 'FE',
            stt: stt,
            maNdung: data.ma,
            noiDung: data.ten,
            level: 0,
          })
          const lstTemp = this.dsDinhMuc.filter(e => e.cloaiVthh == data.ma);
          for (let i = 1; i <= lstTemp.length; i++) {
            this.lstCtietBcao.push({
              ...new ItemData(),
              id: uuid.v4() + 'FE',
              stt: stt + '.' + i.toString(),
              maNdung: data.ma,
              maDmuc: lstTemp[i - 1].loaiDinhMuc,
              noiDung: lstTemp[i - 1].tenDinhMuc,
              maDviTinh: lstTemp[i - 1].donViTinh,
              level: 1,
              sluongThienDmuc: lstTemp[i - 1].tongDmuc,
            })
          }
          this.updateEditCache();
        }
      }
    });
  }

  // tinh tong tu cap duoi
  sum(stt: string) {
    stt = this.getHead(stt);
    while (stt != '0') {
      const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
      const data = this.lstCtietBcao[index];
      this.lstCtietBcao[index] = {
        ...new ItemData(),
        id: data.id,
        stt: data.stt,
        noiDung: data.noiDung,
        level: data.level,
        // ttienTd: data.ttienTd,
        maNdung: data.maNdung,
        // sluongNamDtoan:data.sluongNamDtoan,
        // ttienNamDtoan: data.ttienNamDtoan,
        // thienNamTruoc: data.thienNamTruoc,
        // dtoanNamHtai: data.dtoanNamHtai,
        // uocNamHtai: data.uocNamHtai,
        // dmucNamDtoan: data.dmucNamDtoan,
      }
      this.lstCtietBcao.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          this.lstCtietBcao[index].sluongThienTtien = sumNumber([this.lstCtietBcao[index].sluongThienTtien, item.sluongThienTtien]);
          this.lstCtietBcao[index].dtoanGiaoLke = sumNumber([this.lstCtietBcao[index].dtoanGiaoLke, item.dtoanGiaoLke]);
          this.lstCtietBcao[index].dtoanDchinh = sumNumber([this.lstCtietBcao[index].dtoanDchinh, item.dtoanDchinh]);
          this.lstCtietBcao[index].dtoanVuTvqtDnghi = sumNumber([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
          this.lstCtietBcao[index].kphiThieu = sumNumber([this.lstCtietBcao[index].kphiThieu, item.kphiThieu]);
        }
      })
      stt = this.getHead(stt);
    }
    // this.getTotal();
    this.tinhTong();
  }
  // tinh tong tu cap duoi khong chuyen nstt
  sum1() {
    this.lstCtietBcao.forEach(itm => {
      let stt = this.getHead(itm.stt);
      while (stt != '0') {
        const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
        const data = this.lstCtietBcao[index];
        this.lstCtietBcao[index] = {
          ...new ItemData(),
          id: data.id,
          stt: data.stt,
          noiDung: data.noiDung,
          level: data.level,
          maNdung: data.maNdung,
          // sluongNamDtoan: data.sluongNamDtoan,
          // ttienNamDtoan: data.ttienNamDtoan,
          // thienNamTruoc: data.thienNamTruoc,
          // dtoanNamHtai: data.dtoanNamHtai,
          // uocNamHtai: data.uocNamHtai,
          // dmucNamDtoan: data.dmucNamDtoan,
          // ttienTd: data.ttienTd,
        }
        this.lstCtietBcao.forEach(item => {
          if (this.getHead(item.stt) == stt) {
            this.lstCtietBcao[index].sluongThienTtien = sumNumber([this.lstCtietBcao[index].sluongThienTtien, item.sluongThienTtien]);
            this.lstCtietBcao[index].dtoanGiaoLke = sumNumber([this.lstCtietBcao[index].dtoanGiaoLke, item.dtoanGiaoLke]);
            this.lstCtietBcao[index].dtoanDchinh = sumNumber([this.lstCtietBcao[index].dtoanDchinh, item.dtoanDchinh]);
            this.lstCtietBcao[index].dtoanVuTvqtDnghi = sumNumber([this.lstCtietBcao[index].dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
            this.lstCtietBcao[index].kphiThieu = sumNumber([this.lstCtietBcao[index].kphiThieu, item.kphiThieu]);
          }
        })
        stt = this.getHead(stt);
      }
      // this.getTotal();
      this.tinhTong();
    })

  }

  getTotal() {
    this.total = new ItemData();
    this.lstCtietBcao.forEach(item => {
      if (item.level == 0) {
        this.total.sluongThienTtien = sumNumber([this.total.sluongThienTtien, item.sluongThienTtien]);
        this.total.dtoanGiaoLke = sumNumber([this.total.dtoanGiaoLke, item.dtoanGiaoLke]);
        this.total.dtoanDchinh = sumNumber([this.total.dtoanDchinh, item.dtoanDchinh]);
        this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
        this.total.kphiThieu = sumNumber([this.total.kphiThieu, item.kphiThieu]);
      }
    })
  };

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
      if (item.dtoanDchinh < 0) {
        this.tongDieuChinhGiam += item.dtoanDchinh;
      } else {
        this.tongDieuChinhTang += item.dtoanDchinh;
      }

      if (item.dtoanVuTvqtDnghi < 0) {
        this.dToanVuGiam += item.dtoanVuTvqtDnghi;
      } else {
        this.dToanVuTang += item.dtoanVuTvqtDnghi;
      }
    })
  };

  changeModel(id: string): void {
    this.editCache[id].data.sluongThienCong = mulNumber(this.editCache[id].data.sluongThienTte, this.editCache[id].data.sluongThienUocThien);
    this.editCache[id].data.sluongThienTtien = mulNumber(this.editCache[id].data.sluongThienDmuc, this.editCache[id].data.sluongThienCong);
    this.editCache[id].data.dtoanDchinh = this.editCache[id].data.dtoanGiaoLke - this.editCache[id].data.sluongThienTtien
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

  //tìm vị trí cần để thêm mới
  findVt(str: string): number {
    const start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
    let index: number = start;
    for (let i = start + 1; i < this.lstCtietBcao.length; i++) {
      if (this.lstCtietBcao[i].stt.startsWith(str)) {
        index = i;
      }
    }
    return index;
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




