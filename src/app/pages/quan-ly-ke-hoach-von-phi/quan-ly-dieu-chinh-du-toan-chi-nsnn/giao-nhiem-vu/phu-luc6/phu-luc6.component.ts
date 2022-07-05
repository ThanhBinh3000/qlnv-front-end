import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { divMoney, DON_VI_TIEN, LA_MA, MONEY_LIMIT, mulMoney } from "../../../../../Utility/utils";
import { LINH_VUC } from './phu-luc6.constant';

export class ItemData {

  id: any;
  stt: string;
  level: number;
  loaiMatHang: number;
  maDviTinh: number;
  slHangTte: number;
  kphiDmuc: number;
  kphiTtien: number;
  cphiTcong: number;
  cphiNtruoc: number;
  cphiNnay: number;
  chenhLech: number;
  kphiQtoan: number;
  kphiChuaQtoanCong: number;
  kphiChuaQtoanKpTkiem: number;
  kphiChuaQtoanKpTchi: number;
  dtoan2021ThanhQtoan2020: number;
  soChuaQtoan: number;
  checked!: boolean;
}

@Component({
  selector: 'app-phu-luc6',
  templateUrl: './phu-luc6.component.html',
  styleUrls: ['./phu-luc6.component.scss'],
})
export class PhuLuc6Component implements OnInit {
  @Input() data;
  @Output() dataChange = new EventEmitter();
  //danh muc
  donVis: any = [];
  lstMatHang: any[] = LINH_VUC;
  donViTinhs: any[] = [];
  lstCtietBcao: ItemData[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  soLaMa: any[] = LA_MA;

  //thong tin chung
  id: any;
  namBcao: number;
  maBieuMau: string;
  thuyetMinh: string;
  maDviTien: string = '1';
  listIdDelete: string = "";
  trangThaiPhuLuc: string = '1';
  initItem: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    loaiMatHang: 0,
    maDviTinh: 0,
    slHangTte: 0,
    kphiDmuc: 0,
    kphiTtien: 0,
    cphiTcong: 0,
    cphiNtruoc: 0,
    cphiNnay: 0,
    chenhLech: 0,
    kphiQtoan: 0,
    kphiChuaQtoanCong: 0,
    kphiChuaQtoanKpTkiem: 0,
    kphiChuaQtoanKpTchi: 0,
    dtoan2021ThanhQtoan2020: 0,
    soChuaQtoan: 0,
    checked: false,
  };
  total: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    loaiMatHang: 0,
    maDviTinh: 0,
    slHangTte: 0,
    kphiDmuc: 0,
    kphiTtien: 0,
    cphiTcong: 0,
    cphiNtruoc: 0,
    cphiNnay: 0,
    chenhLech: 0,
    kphiQtoan: 0,
    kphiChuaQtoanCong: 0,
    kphiChuaQtoanKpTkiem: 0,
    kphiChuaQtoanKpTchi: 0,
    dtoan2021ThanhQtoan2020: 0,
    soChuaQtoan: 0,
    checked: false,
  };
  //trang thai cac nut
  status: boolean = false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;

  allChecked = false;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

  constructor(private router: Router,
    private routerActive: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private quanLyVonPhiService: QuanLyVonPhiService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
    private location: Location,
    private fb: FormBuilder,
    private modal: NzModalService,
  ) {
  }

  async ngOnInit() {
    this.id = this.data?.id;
    this.maBieuMau = this.data?.maBieuMau;
    this.maDviTien = this.data?.maDviTien;
    this.thuyetMinh = this.data?.thuyetMinh;
    this.trangThaiPhuLuc = this.data?.trangThai;
    this.namBcao = this.data?.namHienHanh;
    this.status = this.data?.status;
    this.statusBtnFinish = this.data?.statusBtnFinish;
    this.data?.lstCtietDchinh.forEach(item => {
      this.lstCtietBcao.push({
        ...item,
        kphiDmuc: divMoney(item.kphiDmuc, this.maDviTien),
        kphiTtien: divMoney(item.kphiTtien, this.maDviTien),
        cphiTcong: divMoney(item.cphiTcong, this.maDviTien),
        cphiNtruoc: divMoney(item.cphiNtruoc, this.maDviTien),
        cphiNnay: divMoney(item.cphiNnay, this.maDviTien),
        chenhLech: divMoney(item.chenhLech, this.maDviTien),
        kphiQtoan: divMoney(item.kphiQtoan, this.maDviTien),
        kphiChuaQtoanCong: divMoney(item.kphiChuaQtoanCong, this.maDviTien),
        kphiChuaQtoanKpTchi: divMoney(item.kphiChuaQtoanKpTchi, this.maDviTien),
        kphiChuaQtoanKpTkiem: divMoney(item.kphiChuaQtoanKpTkiem, this.maDviTien),
        soChuaQtoan: divMoney(item.soChuaQtoan, this.maDviTien),
        dtoan2021ThanhQtoan2020: divMoney(item.dtoan2021ThanhQtoan2020, this.maDviTien),
      })
    })
    if (this.lstCtietBcao.length > 0) {
      if (!this.lstCtietBcao[0].stt) {
        this.sortWithoutIndex();
      } else {
        this.sortByIndex();
      }
    }
    this.getTotal();
    this.updateEditCache();

    //lay danh sach danh muc don vi
    await this.danhMucService.dMDonVi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    await this.danhMucService.dMDviTinh().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.donViTinhs = data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.getStatusButton();
    this.spinner.hide();
  }

  getStatusButton() {
    if (this.data?.statusBtnOk && (this.trangThaiPhuLuc == "2" || this.trangThaiPhuLuc == "5")) {
      this.statusBtnOk = false;
    } else {
      this.statusBtnOk = true;
    }
  }

  // luu
  async save(trangThai: string) {
    let checkSaveEdit;
    if (!this.maDviTien) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
      return;
    }
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
    let lstCtietBcaoTemp: any = [];
    let checkMoneyRange = true;
    this.lstCtietBcao.forEach(item => {
      let kphiDmuc = mulMoney(item.kphiDmuc, this.maDviTien);
      let kphiTtien = mulMoney(item.kphiTtien, this.maDviTien);
      let cphiTcong = mulMoney(item.cphiTcong, this.maDviTien);
      let cphiNtruoc = mulMoney(item.cphiNtruoc, this.maDviTien);
      let cphiNnay = mulMoney(item.cphiNnay, this.maDviTien);
      let chenhLech = mulMoney(item.chenhLech, this.maDviTien);
      let kphiQtoan = mulMoney(item.kphiQtoan, this.maDviTien);
      let kphiChuaQtoanCong = mulMoney(item.kphiChuaQtoanCong, this.maDviTien);
      let kphiChuaQtoanKpTchi = mulMoney(item.kphiChuaQtoanKpTchi, this.maDviTien);
      let kphiChuaQtoanKpTkiem = mulMoney(item.kphiChuaQtoanKpTkiem, this.maDviTien);
      let soChuaQtoan = mulMoney(item.soChuaQtoan, this.maDviTien);
      let dtoan2021ThanhQtoan2020 = mulMoney(item.dtoan2021ThanhQtoan2020, this.maDviTien);
      if (
        kphiDmuc > MONEY_LIMIT ||
        kphiTtien > MONEY_LIMIT ||
        cphiTcong > MONEY_LIMIT ||
        cphiNtruoc > MONEY_LIMIT ||
        cphiNnay > MONEY_LIMIT ||
        chenhLech > MONEY_LIMIT ||
        kphiQtoan > MONEY_LIMIT ||
        kphiChuaQtoanCong > MONEY_LIMIT ||
        kphiChuaQtoanKpTchi > MONEY_LIMIT ||
        kphiChuaQtoanKpTkiem > MONEY_LIMIT ||
        soChuaQtoan > MONEY_LIMIT ||
        dtoan2021ThanhQtoan2020 > MONEY_LIMIT
      ) {
        checkMoneyRange = false;
        return;
      }
      lstCtietBcaoTemp.push({
        ...item,
        kphiDmuc: kphiDmuc,
        kphiTtien: kphiTtien,
        cphiTcong: cphiTcong,
        cphiNtruoc: cphiNtruoc,
        cphiNnay: cphiNnay,
        chenhLech: chenhLech,
        kphiQtoan: kphiQtoan,
        kphiChuaQtoanCong: kphiChuaQtoanCong,
        kphiChuaQtoanKpTchi: kphiChuaQtoanKpTchi,
        kphiChuaQtoanKpTkiem: kphiChuaQtoanKpTkiem,
        soChuaQtoan: soChuaQtoan,
        dtoan2021ThanhQtoan2020: dtoan2021ThanhQtoan2020,
      })
    })

    if (!checkMoneyRange == true) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
      return;
    }
    // replace nhung ban ghi dc them moi id thanh null
    lstCtietBcaoTemp.forEach(item => {
      if (item.id?.length == 38) {
        item.id = null;
      }
    })
    let request = {
      id: this.id,
      lstCtietDchinh: lstCtietBcaoTemp,
      maBieuMau: this.maBieuMau,
      maDviTien: this.maDviTien,
      giaoCho: this.data?.giaoCho,
      lyDoTuChoi: this.data?.lyDoTuChoi,
      thuyetMinh: this.thuyetMinh,
      trangThai: trangThai,
      maLoai: this.data?.maLoai,
    };
    this.quanLyVonPhiService.updatePLDieuChinh(request).toPromise().then(
      async data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
          let obj = {
            trangThai: '-1',
            lyDoTuChoi: null,
          };
          this.dataChange.emit(obj);
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
    if (this.id) {
      const requestGroupButtons = {
        id: this.id,
        trangThai: mcn,
        lyDoTuChoi: lyDoTuChoi,
      };
      this.spinner.show();
      await this.quanLyVonPhiService.approveDieuChinhPheDuyet(requestGroupButtons).toPromise().then(async (data) => {
        if (data.statusCode == 0) {
          this.trangThaiPhuLuc = mcn;
          this.getStatusButton();
          let obj = {
            trangThai: mcn,
            lyDoTuChoi: lyDoTuChoi,
          }
          this.dataChange.emit(obj);
          if (mcn == '0') {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
          } else {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
          }
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      }, err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      });
      this.spinner.hide();
    } else {
      this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
    }
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
    var xau: string = "";
    let chiSo: any = str.split('.');
    var n: number = chiSo.length - 1;
    var k: number = parseInt(chiSo[n], 10);
    if (n == 0) {
      for (var i = 0; i < this.soLaMa.length; i++) {
        while (k >= this.soLaMa[i].gTri) {
          xau += this.soLaMa[i].kyTu;
          k -= this.soLaMa[i].gTri;
        }
      }
    };
    if (n == 1) {
      xau = chiSo[n];
    };
    // if (n == 2) {
    //   xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    // };
    // if (n == 3) {
    //   xau = String.fromCharCode(k + 96);
    // }
    if (n == 2) {
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
  //tìm vị trí cần để thêm mới
  findVt(str: string): number {
    var start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
    var index: number = start;
    for (var i = start + 1; i < this.lstCtietBcao.length; i++) {
      if (this.lstCtietBcao[i].stt.startsWith(str)) {
        index = i;
      }
    }
    return index;
  }
  //thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
  replaceIndex(lstIndex: number[], heSo: number) {
    //thay doi lai stt cac vi tri vua tim duoc
    lstIndex.forEach(item => {
      var str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
      var nho = this.lstCtietBcao[item].stt;
      this.lstCtietBcao.forEach(item => {
        item.stt = item.stt.replace(nho, str);
      })
    })
  }
  //thêm ngang cấp
  addSame(id: any, initItem: ItemData) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    var tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
    var ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    let lstIndex: number[] = [];
    for (var i = this.lstCtietBcao.length - 1; i > ind; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, 1);
    // them moi phan tu
    if (initItem.id) {
      let item: ItemData = {
        ...initItem,
        stt: head + "." + (tail + 1).toString(),
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: head + "." + (tail + 1).toString(),
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
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
  //thêm cấp thấp hơn
  addLow(id: any, initItem: ItemData) {
    var data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var stt: string;
    if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
      stt = data.stt + '.1';
    } else {
      index = this.findVt(data.stt);
      for (var i = this.lstCtietBcao.length - 1; i >= 0; i--) {
        if (this.getHead(this.lstCtietBcao[i].stt) == data.stt) {
          stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
          break;
        }
      }
    }


    // them moi phan tu
    if (initItem.id) {
      let item: ItemData = {
        ...initItem,
        stt: stt,
      }
      this.lstCtietBcao.splice(index + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == this.getHead(stt)) == -1) {
        this.sum(stt);
        this.updateEditCache();
      }
      let item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: stt,
      }
      this.lstCtietBcao.splice(index + 1, 0, item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }

  }
  //xóa dòng
  deleteLine(id: any) {
    var index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    var nho: string = this.lstCtietBcao[index].stt;
    var head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    var stt: string = this.lstCtietBcao[index].stt;
    //xóa phần tử và con của nó
    this.lstCtietBcao = this.lstCtietBcao.filter(e => !e.stt.startsWith(nho));
    //update lại số thức tự cho các phần tử cần thiết
    let lstIndex: number[] = [];
    for (var i = this.lstCtietBcao.length - 1; i >= index; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }

    this.replaceIndex(lstIndex, -1);
    this.sum(stt);
    this.updateEditCache();
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
    if (
      // (!this.editCache[id].data.loaiMatHang && this.editCache[id].data.loaiMatHang !== 0) ||
      (!this.editCache[id].data.maDviTinh) ||
      (!this.editCache[id].data.kphiDmuc && this.editCache[id].data.kphiDmuc !== 0) ||
      (!this.editCache[id].data.kphiTtien && this.editCache[id].data.kphiTtien !== 0) ||
      (!this.editCache[id].data.cphiTcong && this.editCache[id].data.cphiTcong !== 0) ||
      (!this.editCache[id].data.cphiNtruoc && this.editCache[id].data.cphiNtruoc !== 0) ||
      (!this.editCache[id].data.cphiNnay && this.editCache[id].data.cphiNnay !== 0) ||
      (!this.editCache[id].data.chenhLech && this.editCache[id].data.chenhLech !== 0) ||
      (!this.editCache[id].data.kphiQtoan && this.editCache[id].data.kphiQtoan !== 0) ||
      (!this.editCache[id].data.kphiChuaQtoanCong && this.editCache[id].data.kphiChuaQtoanCong !== 0) ||
      (!this.editCache[id].data.kphiChuaQtoanKpTchi && this.editCache[id].data.kphiChuaQtoanKpTchi !== 0) ||
      (!this.editCache[id].data.kphiChuaQtoanKpTkiem && this.editCache[id].data.kphiChuaQtoanKpTkiem !== 0) ||
      (!this.editCache[id].data.soChuaQtoan && this.editCache[id].data.soChuaQtoan !== 0) ||
      (!this.editCache[id].data.dtoan2021ThanhQtoan2020 && this.editCache[id].data.dtoan2021ThanhQtoan2020 !== 0)
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
      return;
    }
    if(
      this.editCache[id].data.kphiDmuc <0 ||
      this.editCache[id].data.kphiTtien <0 ||
      this.editCache[id].data.cphiTcong <0 ||
      this.editCache[id].data.cphiNtruoc <0 ||
      this.editCache[id].data.cphiNnay <0 ||
      this.editCache[id].data.chenhLech <0 ||
      this.editCache[id].data.kphiQtoan <0 ||
      this.editCache[id].data.kphiChuaQtoanCong <0 ||
      this.editCache[id].data.kphiChuaQtoanKpTchi <0 ||
      this.editCache[id].data.kphiChuaQtoanKpTkiem <0 ||
      this.editCache[id].data.soChuaQtoan <0 ||
      this.editCache[id].data.dtoan2021ThanhQtoan2020 <0
    ){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE)
      return
    }
    this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.updateEditCache();
  }


  updateChecked(id: any) {
    var data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    //đặt các phần tử con có cùng trạng thái với nó
    this.lstCtietBcao.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
        item.checked = data.checked;
      }
    })
    //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    var index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
    if (index == -1) {
      this.allChecked = this.checkAllChild('0');
    } else {
      var nho: boolean = this.lstCtietBcao[index].checked;
      while (nho != this.checkAllChild(this.lstCtietBcao[index].stt)) {
        this.lstCtietBcao[index].checked = !nho;
        index = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(this.lstCtietBcao[index].stt));
        if (index == -1) {
          this.allChecked = !nho;
          break;
        }
        nho = this.lstCtietBcao[index].checked;
      }
    }
  }
  //kiểm tra các phần tử con có cùng được đánh dấu hay ko
  checkAllChild(str: string): boolean {
    var nho: boolean = true;
    this.lstCtietBcao.forEach(item => {
      if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
        nho = item.checked;
      }
    })
    return nho;
  }


  updateAllChecked() {
    this.lstCtietBcao.forEach(item => {
      item.checked = this.allChecked;
    })
  }

  deleteAllChecked() {
    var lstId: any[] = [];
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
  //thêm phần tử đầu tiên khi bảng rỗng
  addFirst(initItem: ItemData) {
    if (initItem.id) {
      let item: ItemData = {
        ...initItem,
        stt: "0.1",
      }
      this.lstCtietBcao.push(item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      let item: ItemData = {
        ...initItem,
        level: 0,
        id: uuid.v4() + 'FE',
        stt: "0.1",
      }
      this.lstCtietBcao.push(item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  }

  sortByIndex() {
    this.setDetail();
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
    var lstTemp: any[] = [];
    this.lstCtietBcao.forEach(item => {
      var index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
      if (index == -1) {
        lstTemp.splice(0, 0, item);
      } else {
        lstTemp.splice(index + 1, 0, item);
      }
    })

    this.lstCtietBcao = lstTemp;
  }

  setDetail() {
    this.lstCtietBcao.forEach(item => {
      item.level = this.lstMatHang.find(e => e.id == item.loaiMatHang)?.level;
    })
  }

  getIdCha(maKM: any) {
    return this.lstMatHang.find(e => e.id == maKM)?.idCha;
  }

  sortWithoutIndex() {
    this.setDetail();
    var level = 0;
    var lstCtietBcaoTemp: ItemData[] = this.lstCtietBcao;
    this.lstCtietBcao = [];
    var data: ItemData = lstCtietBcaoTemp.find(e => e.level == 0);
    this.addFirst(data);
    lstCtietBcaoTemp = lstCtietBcaoTemp.filter(e => e.id != data.id);
    var lstTemp: ItemData[] = lstCtietBcaoTemp.filter(e => e.level == level);
    while (lstTemp.length != 0 || level == 0) {
      lstTemp.forEach(item => {
        let idCha = this.getIdCha( Number(item.loaiMatHang));
        var index: number = this.lstCtietBcao.findIndex(e => Number(e.loaiMatHang) === idCha);
        if (index != -1) {
          this.addLow(this.lstCtietBcao[index].id, item);
        } else {
          index = this.lstCtietBcao.findIndex(e => this.getIdCha( Number(e.loaiMatHang)) === idCha);
          this.addSame(this.lstCtietBcao[index].id, item);
        }
      })
      level += 1;
      lstTemp = lstCtietBcaoTemp.filter(e => e.level == level);
    }
  }

  addLine(id: any) {
    var loaiMatHang: any = this.lstCtietBcao.find(e => e.id == id)?.loaiMatHang;
    let obj = {
      maKhoanMuc: loaiMatHang,
      lstKhoanMuc: this.lstMatHang,
    }

    const modalIn = this.modal.create({
      nzTitle: 'Danh sách lĩnh vực',
      nzContent: DialogThemKhoanMucComponent,
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
        var index: number = this.lstCtietBcao.findIndex(e => e.loaiMatHang == res.maKhoanMuc);
        if (index == -1) {
          let data: any = {
            ...this.initItem,
            loaiMatHang: res.maKhoanMuc,
            level: this.lstMatHang.find(e => e.id == loaiMatHang)?.level,
          };
          if (this.lstCtietBcao.length == 0) {
            this.addFirst(data);
          } else {
            this.addSame(id, data);
          }
        }
        id = this.lstCtietBcao.find(e => e.loaiMatHang == res.maKhoanMuc)?.id;
        res.lstKhoanMuc.forEach(item => {
          if (this.lstCtietBcao.findIndex(e => e.loaiMatHang == item.id) == -1){
          var data: ItemData = {
            ...this.initItem,
            loaiMatHang: item.id,
            level: item.level,
          };
          this.addLow(id, data);
        }
        })
        this.updateEditCache();
      }
    });

  }

  getLowStatus(str: string) {
    var index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
    if (index == -1) {
      return false;
    }
    return true;
  }

  sum(stt: string) {
    stt = this.getHead(stt);
    while (stt != '0') {
      var index = this.lstCtietBcao.findIndex(e => e.stt == stt);
      let data = this.lstCtietBcao[index];
      this.lstCtietBcao[index] = {
        ...this.initItem,
        id: data.id,
        stt: data.stt,
        loaiMatHang: data.loaiMatHang,
        checked: data.checked,
        level: data.level,
      }
      this.lstCtietBcao.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          this.lstCtietBcao[index].slHangTte += item.slHangTte;
          this.lstCtietBcao[index].kphiDmuc += item.kphiDmuc;
          this.lstCtietBcao[index].kphiTtien += item.kphiTtien;
          this.lstCtietBcao[index].cphiTcong += item.cphiTcong;
          this.lstCtietBcao[index].cphiNtruoc += item.cphiNtruoc;
          this.lstCtietBcao[index].cphiNnay += item.cphiNnay;
          this.lstCtietBcao[index].chenhLech += item.chenhLech;
          this.lstCtietBcao[index].kphiQtoan += item.kphiQtoan;
          this.lstCtietBcao[index].kphiChuaQtoanCong += item.kphiChuaQtoanCong;
          this.lstCtietBcao[index].kphiChuaQtoanKpTkiem += item.kphiChuaQtoanKpTkiem;
          this.lstCtietBcao[index].kphiChuaQtoanKpTchi += item.kphiChuaQtoanKpTchi;
          this.lstCtietBcao[index].soChuaQtoan += item.soChuaQtoan;
          this.lstCtietBcao[index].dtoan2021ThanhQtoan2020 += item.dtoan2021ThanhQtoan2020;
        }
      })
      stt = this.getHead(stt);
    }
    this.getTotal();
  }

  getTotal() {
    this.total.slHangTte = 0;
    this.total.kphiDmuc = 0;
    this.total.kphiTtien = 0;
    this.total.cphiTcong = 0;
    this.total.cphiNtruoc = 0;
    this.total.cphiNnay = 0;
    this.total.chenhLech = 0;
    this.total.kphiQtoan = 0;
    this.total.kphiChuaQtoanCong = 0;
    this.total.kphiChuaQtoanKpTkiem = 0;
    this.total.kphiChuaQtoanKpTchi = 0;
    this.total.soChuaQtoan = 0;
    this.total.dtoan2021ThanhQtoan2020 = 0;
    this.lstCtietBcao.forEach(item => {
      if (item.level == 0) {
        this.total.slHangTte += item.slHangTte;
        this.total.kphiDmuc += item.kphiDmuc;
        this.total.kphiTtien += item.kphiTtien;
        this.total.cphiTcong += item.cphiTcong;
        this.total.cphiNtruoc += item.cphiNtruoc;
        this.total.cphiNnay += item.cphiNnay;
        this.total.chenhLech += item.chenhLech;
        this.total.kphiQtoan += item.kphiQtoan;
        this.total.kphiChuaQtoanCong += item.kphiChuaQtoanCong;
        this.total.kphiChuaQtoanKpTkiem += item.kphiChuaQtoanKpTkiem;
        this.total.kphiChuaQtoanKpTchi += item.kphiChuaQtoanKpTchi;
        this.total.soChuaQtoan += item.soChuaQtoan;
        this.total.dtoan2021ThanhQtoan2020 += item.dtoan2021ThanhQtoan2020;
      }
    })
  }

  // action print
  doPrint() {
    let WindowPrt = window.open(
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


  // gia tri cac o input thay doi thi tinh toan lai
  changeModel(id: string): void {
    this.editCache[id].data.soChuaQtoan = Number(this.editCache[id].data.kphiChuaQtoanCong) - Number(this.editCache[id].data.dtoan2021ThanhQtoan2020);
    this.editCache[id].data.kphiChuaQtoanCong = Number(this.editCache[id].data.kphiChuaQtoanKpTkiem) + Number(this.editCache[id].data.kphiChuaQtoanKpTchi);
    this.editCache[id].data.chenhLech = Number(this.editCache[id].data.kphiTtien) - Number(this.editCache[id].data.cphiTcong);
    this.editCache[id].data.cphiTcong = Number(this.editCache[id].data.cphiNtruoc) + Number(this.editCache[id].data.cphiNnay);
    this.editCache[id].data.kphiTtien = Number(this.editCache[id].data.slHangTte) * Number(this.editCache[id].data.kphiDmuc);
  }


}
