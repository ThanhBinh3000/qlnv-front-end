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
import { LINH_VUC } from './phu-luc2.constant';

export class ItemData {

  id: any;
  stt: string;
  level: number;
  maNdung: number;
  maDviTinh: number;
  thienSluongKhoachDgiao: number;
  thienSluongTteThien: number;
  thienSluongUocThien: number;
  thienCong: number;
  thienDinhMuc: number;
  thienThanhTien: number;
  kphiThieuNtruoc: number;
  ncauKphi: number;
  checked!: boolean;
}

@Component({
  selector: 'app-phu-luc2',
  templateUrl: './phu-luc2.component.html',
  styleUrls: ['./phu-luc2.component.scss'],
})
export class PhuLuc2Component implements OnInit {
  @Input() data;
  @Output() dataChange = new EventEmitter();
  //danh muc
  donVis: any = [];
  noiDungs: any[] = LINH_VUC;
  donViTinhs: any[] = [];
  lstCtietBcao: ItemData[] = [];
  donViTiens: any[] = DON_VI_TIEN;
  soLaMa: any[] = LA_MA;

  //thong tin chung
  id: any;
  namBcao: number;
  maBieuMau: string;
  thuyetMinh: string;
  maDviTien: '1';
  listIdDelete: "";
  trangThaiPhuLuc = '1';
  initItem: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    maNdung: 0,
    maDviTinh: null,
    thienSluongKhoachDgiao: null,
    thienSluongTteThien: null,
    thienSluongUocThien: null,
    thienCong: null,
    thienDinhMuc: null,
    thienThanhTien: null,
    kphiThieuNtruoc: null,
    ncauKphi: null,
    checked: false,
  };
  total: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    maNdung: 0,
    maDviTinh: null,
    thienSluongKhoachDgiao: null,
    thienSluongTteThien: null,
    thienSluongUocThien: null,
    thienCong: null,
    thienDinhMuc: null,
    thienThanhTien: null,
    kphiThieuNtruoc: null,
    ncauKphi: null,
    checked: false,
  };
  //trang thai cac nut
  status: false;
  statusBtnFinish: boolean;
  statusBtnOk: boolean;
  dsDinhMuc: any[] = [];
  maDviTao!: string;

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
    this.spinner.show();
    this.id = this.data?.id;
    this.maBieuMau = this.data?.maBieuMau;
    this.maDviTien = this.data?.maDviTien;
    this.thuyetMinh = this.data?.thuyetMinh;
    this.trangThaiPhuLuc = this.data?.trangThai;
    this.namBcao = this.data?.namHienHanh;
    this.status = this.data?.status;
    this.statusBtnFinish = this.data?.statusBtnFinish;
    this.maDviTao = this.data?.maDviTao;
    this.data?.lstCtietDchinh.forEach(item => {
      this.lstCtietBcao.push({
        ...item,
        thienSluongKhoachDgiao: divMoney(item.thienSluongKhoachDgiao, this.maDviTien),
        thienSluongTteThien: divMoney(item.thienSluongTteThien, this.maDviTien),
        thienSluongUocThien: divMoney(item.thienSluongUocThien, this.maDviTien),
        thienCong: divMoney(item.thienCong, this.maDviTien),
        thienDinhMuc: divMoney(item.thienDinhMuc, this.maDviTien),
        thienThanhTien: divMoney(item.thienThanhTien, this.maDviTien),
        kphiThieuNtruoc: divMoney(item.kphiThieuNtruoc, this.maDviTien),
        ncauKphi: divMoney(item.ncauKphi, this.maDviTien),
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
    this.getDsDinhMuc();
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
    const lstCtietBcaoTemp: any = [];
    let checkMoneyRange = true;
    this.lstCtietBcao.forEach(item => {
      const thienSluongKhoachDgiao = mulMoney(item.thienSluongKhoachDgiao, this.maDviTien);
      const thienSluongTteThien = mulMoney(item.thienSluongTteThien, this.maDviTien);
      const thienSluongUocThien = mulMoney(item.thienSluongUocThien, this.maDviTien);
      const thienCong = mulMoney(item.thienCong, this.maDviTien);
      const thienDinhMuc = mulMoney(item.thienDinhMuc, this.maDviTien);
      const thienThanhTien = mulMoney(item.thienThanhTien, this.maDviTien);
      const kphiThieuNtruoc = mulMoney(item.kphiThieuNtruoc, this.maDviTien);
      const ncauKphi = mulMoney(item.ncauKphi, this.maDviTien);
      if (thienSluongKhoachDgiao > MONEY_LIMIT || thienDinhMuc > MONEY_LIMIT ||
        thienSluongTteThien > MONEY_LIMIT || thienThanhTien > MONEY_LIMIT ||
        thienSluongUocThien > MONEY_LIMIT || kphiThieuNtruoc > MONEY_LIMIT ||
        thienCong > MONEY_LIMIT || ncauKphi> MONEY_LIMIT
      ) {
        checkMoneyRange = false;
        return;
      }
      lstCtietBcaoTemp.push({
        ...item,
        thienSluongKhoachDgiao: thienSluongKhoachDgiao,
        thienSluongTteThien: thienSluongTteThien,
        thienSluongUocThien: thienSluongUocThien,
        thienCong: thienCong,
        thienDinhMuc: thienDinhMuc,
        thienThanhTien: thienThanhTien,
        kphiThieuNtruoc: kphiThieuNtruoc
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
    const request = {
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
          const obj = {
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
          const obj = {
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
    let xau = "";
    const chiSo: any = str.split('.');
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
    // if (n == 2) {
    //   xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
    // };
    // if (n == 3) {
    //   xau = String.fromCharCode(k + 96);
    // }
    if (n == 2) {
      xau = "-";
    }
    if (n == 3) {
      xau = "+";
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
    const start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
    let index: number = start;
    for (let i = start + 1; i < this.lstCtietBcao.length; i++) {
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
      const str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
      const nho = this.lstCtietBcao[item].stt;
      this.lstCtietBcao.forEach(item => {
        item.stt.replace(nho, str);
      })
    })
  }
  //thêm ngang cấp
  addSame(id: any, initItem: ItemData) {
    const index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    const head: string = this.getHead(this.lstCtietBcao[index].stt); // lay phan dau cua so tt
    const tail: number = this.getTail(this.lstCtietBcao[index].stt); // lay phan duoi cua so tt
    const ind: number = this.findVt(this.lstCtietBcao[index].stt); // vi tri can duoc them
    // tim cac vi tri can thay doi lai stt
    const lstIndex: number[] = [];
    for (let i = this.lstCtietBcao.length - 1; i > ind; i--) {
      if (this.getHead(this.lstCtietBcao[i].stt) == head) {
        lstIndex.push(i);
      }
    }
    this.replaceIndex(lstIndex, 1);
    let dm : number;
    this.dsDinhMuc.forEach(itm => {
      if(itm.idDmChi == initItem.maNdung){
        return dm = (parseInt(itm.nvuCmon,10) + parseInt(itm.cucDhanh,10) + parseInt(itm.ttoanCnhan,10))
    }})
    // them moi phan tu
    if (initItem.id) {
      const item: ItemData = {
        ...initItem,
        stt: head + "." + (tail + 1).toString(),
        thienDinhMuc: dm != 0? dm : null,
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      const item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: head + "." + (tail + 1).toString(),
        thienDinhMuc: dm != 0? dm : null,
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
    const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    let index: number = this.lstCtietBcao.findIndex(e => e.id === id); // vi tri hien tai
    let stt: string;
    if (this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == data.stt) == -1) {
      stt = data.stt + '.1';
    } else {
      index = this.findVt(data.stt);
      for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
        if (this.getHead(this.lstCtietBcao[i].stt) == data.stt) {
          stt = data.stt + '.' + (this.getTail(this.lstCtietBcao[i].stt) + 1).toString();
          break;
        }
      }
    }
    
    let dm : number;
    this.dsDinhMuc.forEach(itm => {
      if(itm.idDmChi == initItem.maNdung){
        return dm = (parseInt(itm.nvuCmon,10) + parseInt(itm.cucDhanh,10) + parseInt(itm.ttoanCnhan,10))
    }})
    // them moi phan tu
    if (initItem.id) {
      const item: ItemData = {
        ...initItem,
        stt: stt,
        thienDinhMuc: dm != 0? dm : null,
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
      const item: ItemData = {
        ...initItem,
        id: uuid.v4() + "FE",
        stt: stt,
        thienDinhMuc: dm != 0? dm : null,
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
      (!this.editCache[id].data.thienSluongKhoachDgiao && this.editCache[id].data.thienSluongKhoachDgiao !== 0) ||
      (!this.editCache[id].data.thienSluongTteThien && this.editCache[id].data.thienSluongTteThien !== 0) ||
      (!this.editCache[id].data.thienSluongUocThien && this.editCache[id].data.thienSluongUocThien !== 0) ||
      (!this.editCache[id].data.thienCong && this.editCache[id].data.thienCong !== 0) ||
      (!this.editCache[id].data.kphiThieuNtruoc && this.editCache[id].data.kphiThieuNtruoc !== 0) ||
      (!this.editCache[id].data.maDviTinh)
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
      return;
    }
    if(
      this.editCache[id].data.thienSluongKhoachDgiao < 0 ||
      this.editCache[id].data.thienSluongTteThien < 0 ||
      this.editCache[id].data.thienSluongUocThien < 0 ||
      this.editCache[id].data.thienCong < 0 ||
      this.editCache[id].data.kphiThieuNtruoc < 0
    ){
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE);
      return;
    }
    this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.updateEditCache();
  }


  updateChecked(id: any) {
    const data: ItemData = this.lstCtietBcao.find(e => e.id === id);
    //đặt các phần tử con có cùng trạng thái với nó
    this.lstCtietBcao.forEach(item => {
      if (item.stt.startsWith(data.stt)) {
        item.checked = data.checked;
      }
    })
    //thay đổi các phần tử cha cho phù hợp với tháy đổi của phần tử con
    let index: number = this.lstCtietBcao.findIndex(e => e.stt == this.getHead(data.stt));
    if (index == -1) {
      this.allChecked = this.checkAllChild('0');
    } else {
      let nho: boolean = this.lstCtietBcao[index].checked;
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
    let nho = true;
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
  //thêm phần tử đầu tiên khi bảng rỗng
  addFirst(initItem: ItemData) {
    let dm : number;
    this.dsDinhMuc.forEach(itm => {
      if(itm.idDmChi == initItem.maNdung){
        return dm = (parseInt(itm.nvuCmon,10) + parseInt(itm.cucDhanh,10) + parseInt(itm.ttoanCnhan,10))
    }})
    if (initItem.id) {
      const item: ItemData = {
        ...initItem,
        stt: "0.1",
        thienDinhMuc: dm != 0? dm : null,
      }
      this.lstCtietBcao.push(item);
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    } else {
      const item: ItemData = {
        ...initItem,
        level: 0,
        id: uuid.v4() + 'FE',
        stt: "0.1",
        thienDinhMuc: dm != 0? dm : null,
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
    const lstTemp: any[] = [];
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

  setDetail() {
    this.lstCtietBcao.forEach(item => {
      item.level = this.noiDungs.find(e => e.id == item.maNdung)?.level;
    })
  }

  getIdCha(maKM: any) {
    return this.noiDungs.find(e => e.id == maKM)?.idCha;
  }

  sortWithoutIndex() {
    this.setDetail();
    let level = 0;
    let lstCtietBcaoTemp: ItemData[] = this.lstCtietBcao;
    this.lstCtietBcao = [];
    const data: ItemData = lstCtietBcaoTemp.find(e => e.level == 0);
    this.addFirst(data);
    lstCtietBcaoTemp = lstCtietBcaoTemp.filter(e => e.id != data.id);
    let lstTemp: ItemData[] = lstCtietBcaoTemp.filter(e => e.level == level);
    while (lstTemp.length != 0 || level == 0) {
      lstTemp.forEach(item => {
        const idCha = this.getIdCha( Number(item.maNdung));
        let index: number = this.lstCtietBcao.findIndex(e => Number(e.maNdung) === idCha);
        if (index != -1) {
          this.addLow(this.lstCtietBcao[index].id, item);
        } else {
          index = this.lstCtietBcao.findIndex(e => this.getIdCha( Number(e.maNdung)) === idCha);
          this.addSame(this.lstCtietBcao[index].id, item);
        }
      })
      level += 1;
      lstTemp = lstCtietBcaoTemp.filter(e => e.level == level);
    }
  }
  addLine(id: any) {
    const maNdung: any = this.lstCtietBcao.find(e => e.id == id)?.maNdung;
    const obj = {
      maKhoanMuc: maNdung,
      lstKhoanMuc: this.noiDungs,
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
        const index: number = this.lstCtietBcao.findIndex(e => e.maNdung == res.maKhoanMuc);
        if (index == -1) {
          const data: any = {
            ...this.initItem,
            maNdung: res.maKhoanMuc,
            level: this.noiDungs.find(e => e.id == maNdung)?.level,
          };
          if (this.lstCtietBcao.length == 0) {
            this.addFirst(data);
          } else {
            this.addSame(id, data);
          }
        }
        id = this.lstCtietBcao.find(e => e.maNdung == res.maKhoanMuc)?.id;
        res.lstKhoanMuc.forEach(item => {
          if (this.lstCtietBcao.findIndex(e => e.maNdung == item.id) == -1){
            const data: ItemData = {
            ...this.initItem,
            maNdung: item.id,
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
    const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
    if (index == -1) {
      return false;
    }
    return true;
  }

  sum(stt: string) {
    stt = this.getHead(stt);
    while (stt != '0') {
      const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
      const data = this.lstCtietBcao[index];
      this.lstCtietBcao[index] = {
        ...this.initItem,
        id: data.id,
        stt: data.stt,
        maNdung: data.maNdung,
        checked: data.checked,
        level: data.level,
      }
      this.lstCtietBcao.forEach(item => {
        if (this.getHead(item.stt) == stt) {
          this.lstCtietBcao[index].thienSluongKhoachDgiao += item.thienSluongKhoachDgiao;
          this.lstCtietBcao[index].thienSluongTteThien += item.thienSluongTteThien;
          this.lstCtietBcao[index].thienSluongUocThien += item.thienSluongUocThien;
          this.lstCtietBcao[index].thienCong += item.thienCong;
          this.lstCtietBcao[index].thienDinhMuc += item.thienDinhMuc;
          this.lstCtietBcao[index].thienThanhTien += item.thienThanhTien;
          this.lstCtietBcao[index].kphiThieuNtruoc += item.kphiThieuNtruoc;
          this.lstCtietBcao[index].ncauKphi += item.ncauKphi;
        }
      })
      stt = this.getHead(stt);
    }
    this.getTotal();
  }

  getTotal() {
    this.total.thienSluongKhoachDgiao = 0;
    this.total.thienSluongTteThien = 0;
    this.total.thienSluongUocThien = 0;
    this.total.thienCong = 0;
    this.total.thienDinhMuc = 0;
    this.total.thienThanhTien = 0;
    this.total.kphiThieuNtruoc = 0;
    this.total.ncauKphi = 0;
    this.lstCtietBcao.forEach(item => {
      if (item.level == 0) {
        this.total.thienSluongKhoachDgiao += item.thienSluongKhoachDgiao;
        this.total.thienSluongTteThien += item.thienSluongTteThien;
        this.total.thienSluongUocThien += item.thienSluongUocThien;
        this.total.thienCong += item.thienCong;
        this.total.thienDinhMuc += item.thienDinhMuc;
        this.total.thienThanhTien += item.thienThanhTien;
        this.total.kphiThieuNtruoc += item.kphiThieuNtruoc;
        this.total.ncauKphi += item.ncauKphi;
      }
    })
    if(this.total.thienSluongKhoachDgiao == 0||
      this.total.thienSluongTteThien == 0||
      this.total.thienSluongUocThien == 0||
      this.total.thienCong == 0||
      this.total.thienThanhTien == 0||
      this.total.kphiThieuNtruoc == 0||
      this.total.ncauKphi == 0
      ){
        this.total.thienSluongKhoachDgiao = null,
        this.total.thienSluongTteThien = null,
        this.total.thienSluongUocThien = null,
        this.total.thienCong = null,
        this.total.thienThanhTien = null
        this.total.kphiThieuNtruoc = null,
        this.total.ncauKphi = null
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


  //gia tri cac o input thay doi thi tinh toan lai
  changeModel(id: string): void {
    if(this.editCache[id].data.thienDinhMuc == null){
      this.editCache[id].data.thienDinhMuc = 0
    }
    this.editCache[id].data.thienCong = this.editCache[id].data.thienSluongTteThien + this.editCache[id].data.thienSluongUocThien;
    this.editCache[id].data.thienThanhTien = this.editCache[id].data.thienCong * this.editCache[id].data.thienDinhMuc;
    this.editCache[id].data.ncauKphi = this.editCache[id].data.thienThanhTien + this.editCache[id].data.kphiThieuNtruoc;
  }

  getDsDinhMuc(){
    const requestDinhMuc = {
      idDmChi: null,
      maDvi: this.maDviTao,
      paggingReq: {
        limit: 20,
        page: 1
      },
      parentId: null,
      str: null,
      trangThai: null,
      typeChi: null
    };
     this.quanLyVonPhiService.getDinhMucNhapXuat(requestDinhMuc).toPromise().then(
       async (data) => {
         const  contentData = await data?.data?.content; 
         if (contentData.length != 0) {
             this.dsDinhMuc = contentData;
          }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }
}
