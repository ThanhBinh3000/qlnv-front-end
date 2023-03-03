import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { DieuChinhService } from 'src/app/services/quan-ly-von-phi/dieuChinhDuToan.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { displayNumber, exchangeMoney, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from "uuid";
export class ItemData {
  level: any;
  checked: boolean;
  id: string;
  qlnvKhvonphiDchinhCtietId: string;
  stt: string;
  noiDung: string;
  dviTinh: string;
  sluongDuocGiao: number;
  sluongThucTe: number;
  sluongUocThien: number;
  tongCong: number;
  dinhMuc: number;
  thanhTien: number;
  dtoanDaGiaoLke: number;
  dtoanDchinh: number;
  dtoanVuTvqtDnghi: number;
  kphiThieu: number;
  maNoiDung: string;
}

@Component({
  selector: 'app-phu-luc-3',
  templateUrl: './phu-luc-3.component.html',
  styleUrls: ['./phu-luc-3.component.scss']
})
export class PhuLuc3Component implements OnInit {
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
  formDetail: any;
  maDviTao: any;
  userInfo: any;
  lstTaiSans: any[] = [];
  total: ItemData = new ItemData();
  soLaMa: any[] = LA_MA;
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

    if (this.lstCtietBcao.length == 0) {
      // this.linhVucChis.forEach(e => {
      this.lstCtietBcao.push({
        ...new ItemData(),
        id: uuid.v4() + 'FE',
        stt: "0.1",
        maNoiDung: this.userInfo.MA_DVI,
        noiDung: this.userInfo.TEN_DVI,
      })
      // })
      // this.setLevel();
      // this.lstCtietBcao.forEach(item => {
      //   item.tenDanhMuc += this.getName(item.level, item.maDanhMuc);
      // })
    } else if (!this.lstCtietBcao[0]?.stt) {
      this.lstCtietBcao.forEach(item => {
        item.stt = item.maNoiDung;
      })
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
    console.log(taiSan);
    this.editCache[id].data.dviTinh = taiSan[0].donViTinh;
    this.editCache[id].data.noiDung = taiSan[0].giaTri;

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
      this.total.dinhMuc = sumNumber([this.total.dinhMuc, item.dinhMuc]);
      this.total.thanhTien = sumNumber([this.total.thanhTien, item.thanhTien]);
      this.total.dtoanDaGiaoLke = sumNumber([this.total.dtoanDaGiaoLke, item.dtoanDaGiaoLke]);
      this.total.dtoanDchinh = sumNumber([this.total.dtoanDchinh, item.dtoanDchinh]);
      this.total.dtoanVuTvqtDnghi = sumNumber([this.total.dtoanVuTvqtDnghi, item.dtoanVuTvqtDnghi]);
      this.total.kphiThieu = sumNumber([this.total.kphiThieu, item.kphiThieu]);
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
      if (item.dtoanDchinh > MONEY_LIMIT) {
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
        item.dtoanVuTvqtDnghi = item.dtoanVuTvqtDnghi;
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
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.updateEditCache();
    this.sum(this.lstCtietBcao[index].stt);
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

  sum(stt: string) {
    // stt = this.getHead(stt);
    // while (stt != '0') {
    //   const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
    //   const data = this.lstCtietBcao[index];
    //   this.lstCtietBcao[index] = {
    //     ...new ItemData(),
    //     id: data.id,
    //     stt: data.stt,
    //     tenDanhMuc: data.tenDanhMuc,
    //     level: data.level,
    //     // ttienTd: data.ttienTd,
    //     danhMuc: data.danhMuc,
    //     // sluongNamDtoan:data.sluongNamDtoan,
    //     // ttienNamDtoan: data.ttienNamDtoan,
    //     // thienNamTruoc: data.thienNamTruoc,
    //     // dtoanNamHtai: data.dtoanNamHtai,
    //     // uocNamHtai: data.uocNamHtai,
    //     // dmucNamDtoan: data.dmucNamDtoan,
    //   }
    //   this.lstCtietBcao.forEach(item => {
    //     if (this.getHead(item.stt) == stt) {
    //       this.lstCtietBcao[index].ttienNamDtoan = sumNumber([this.lstCtietBcao[index].ttienNamDtoan, item.ttienNamDtoan]);
    //       this.lstCtietBcao[index].thienNamTruoc = sumNumber([this.lstCtietBcao[index].thienNamTruoc, item.thienNamTruoc]);
    //       this.lstCtietBcao[index].dtoanNamHtai = sumNumber([this.lstCtietBcao[index].dtoanNamHtai, item.dtoanNamHtai]);
    //       this.lstCtietBcao[index].uocNamHtai = sumNumber([this.lstCtietBcao[index].uocNamHtai, item.uocNamHtai]);
    //       // this.lstCtietBcao[index].dmucNamDtoan = sumNumber([this.lstCtietBcao[index].dmucNamDtoan, item.dmucNamDtoan]);
    //       this.lstCtietBcao[index].ttienTd = sumNumber([this.lstCtietBcao[index].ttienTd, item.ttienTd]);
    //     }
    //   })
    //   stt = this.getHead(stt);
    // }
    // // this.getTotal();
    // this.tinhTong();
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
    // this.editCache[id].data.tongNcauDtoanN = this.editCache[id].data.tdiemBcaoDtoan + this.editCache[id].data.dkienThienDtoan + this.editCache[id].data.dtoanThieuNtruoc;
    // // this.editCache[id].data.dtoanDchinh = Number((this.editCache[id].data.ncauChiN1 / this.editCache[id].data.uocThienN).toFixed(3));
    this.editCache[id].data.tongCong = this.editCache[id].data.sluongThucTe + this.editCache[id].data.sluongUocThien;
    this.editCache[id].data.thanhTien = this.editCache[id].data.tongCong * this.editCache[id].data.dinhMuc;
    this.editCache[id].data.dtoanDchinh = this.editCache[id].data.dtoanDaGiaoLke - this.editCache[id].data.thanhTien;
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
    if (this.formDetail?.isSynthetic == true) {

    }
    const item: ItemData = {
      id: uuid.v4(),
      stt: "0",
      checked: false,
      dinhMuc: 0,
      dtoanDchinh: 0,
      dtoanDaGiaoLke: 0,
      dtoanVuTvqtDnghi: 0,
      dviTinh: "",
      kphiThieu: 0,
      maNoiDung: "",
      qlnvKhvonphiDchinhCtietId: "",
      sluongDuocGiao: 0,
      sluongThucTe: 0,
      sluongUocThien: 0,
      noiDung: "",
      thanhTien: 0,
      tongCong: 0,
      level: 0,
    };

    this.lstCtietBcao.splice(id, 0, item);
    this.editCache[item.id] = {
      edit: true,
      data: { ...item }
    };
  };

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
      // xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
      xau = null;
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



}

