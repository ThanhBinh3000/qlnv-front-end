import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { displayNumber, DON_VI_TIEN, exchangeMoney, LA_MA, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { NOI_DUNG } from './tao-moi-quyet-dinh-btc.constant';
import { Globals } from 'src/app/shared/globals';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { MESSAGE } from 'src/app/constants/message';
import * as fileSaver from 'file-saver';
import { DialogThemKhoanMucComponent } from 'src/app/components/dialog/dialog-them-khoan-muc/dialog-them-khoan-muc.component';
import * as uuid from 'uuid';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';

export class ItemData {
  id!: any;
  stt: any;
  level: number;
  maNdung: number;
  tongCong: number;
  nguonNsnn: number;
  nguonKhac: number;
  checked!: boolean;
}

export class ItemDvi {
  id: any;
  maDviNhan: string;
  soTranChi: number;
  trangThai: string;
}

export class ItemCongVan {
  fileName: string;
  fileSize: number;
  fileUrl: number;
}

@Component({
  selector: 'app-tao-moi-quyet-dinh-btc',
  templateUrl: './tao-moi-quyet-dinh-btc.component.html',
  styleUrls: ['./tao-moi-quyet-dinh-btc.component.scss']
})

export class TaoMoiQuyetDinhBtcComponent implements OnInit {
  @Input() data;
  @Input() isStatus;
  @Output() dataChange = new EventEmitter();

  id: string;
  userInfo: any;
  //thong tin chung bao cao
  userRole: string; // role người dùng
  ngayTao: string;
  maDonViTao: string;
  maPa: string;
  maPaCha: string;
  lstDvi: any[] = [];                                         //danh sach don vi da duoc chon
  namPa: number;
  soQd: ItemCongVan = new ItemCongVan();
  trangThaiBanGhi = '1';
  newDate = new Date();
  maDviTien: string;
  thuyetMinh: string;
  maLoai = '2';
  //danh muc
  lstCtietBcao: ItemData[] = [];
  donVis: any[] = [];
  noiDungs: any[] = NOI_DUNG;
  donViTiens: any[] = DON_VI_TIEN;
  trangThais: any[] = TRANG_THAI_TIM_KIEM;
  soLaMa: any[] = LA_MA;
  initItem: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    maNdung: 0,
    tongCong: null,
    nguonNsnn: null,
    nguonKhac: null,
    checked: false,
  };
  total: ItemData = {
    id: null,
    stt: "0",
    level: 0,
    maNdung: 0,
    tongCong: null,
    nguonNsnn: null,
    nguonKhac: null,
    checked: false,
  };
  //trang thai cac nut
  status = false;
  statusBtnSave: boolean;
  statusBtnNew: boolean;
  statusBtnEdit: boolean;
  statusBtnCopy: boolean;
  statusBtnPrint: boolean;
  allChecked = false;

  //khac
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {}; // phuc vu nut chinh
  listId = '';
  lstFiles: any[] = []; //show file ra man hinh
  //file
  listFile: File[] = [];                      // list file chua ten va id de hien tai o input
  fileList: NzUploadFile[] = [];
  fileDetail: NzUploadFile;
  //beforeUpload: any;
  listIdFilesDelete: any = [];                        // id file luc call chi tiet
  editMoneyUnit = false;
  isDataAvailable = false;

  // before uploaf file
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  // them file vao danh sach
  handleUpload(): void {
    this.fileList.forEach((file: any) => {
      const id = file?.lastModified.toString();
      this.lstFiles.push({ id: id, fileName: file?.name });
      this.listFile.push(file);
    });
    this.fileList = [];
  }

  // before upload file so quyet dinh
  beforeUploadSoQuyetDinh = (file: NzUploadFile): boolean => {
    this.fileDetail = file;
    this.soQd = {
      fileName: file.name,
      fileSize: null,
      fileUrl: null,
    };
    return false;
  };

  constructor(
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private modal: NzModalService,
    public globals: Globals,
    public giaoDuToanChiService: GiaoDuToanChiService,
    public quanLyVonPhiService: QuanLyVonPhiService,
  ) { }

  ngOnInit() {
    this.action('init');
  };

  async action(code: string) {
    this.spinner.show();
    this.isDataAvailable = false;
    switch (code) {
      case 'init':
        await this.initialization().then(() => {
          this.isDataAvailable = true;
        });
        break;
      case 'save':
        await this.save().then(() => {
          this.isDataAvailable = true;
        })
        break;
      case 'detail':
        await this.getDetailReport().then(() => {
          this.isDataAvailable = true;
        });
        break;
      default:
        break;
    }
    this.spinner.hide();
  };


  async initialization() {

  };

  async getDetailReport() {

  };

  async save(){

  };

  back() {

  };

  async taoMoiPhuongAn(loaiPa) {

  };

  showDialogCopy() {

  };

  statusClass() {
    if (Utils.statusSave.includes(this.isStatus)) {
      return 'du-thao-va-lanh-dao-duyet';
    } else {
      return 'da-ban-hanh';
    }
  };

  getStatusName(status: string) {
    return this.trangThais.find(e => e.id == status)?.tenDm;
  };

  //download file về máy tính
  async downloadFileCv() {
    if (this.soQd?.fileUrl) {
      await this.quanLyVonPhiService.downloadFile(this.soQd?.fileUrl).toPromise().then(
        (data) => {
          fileSaver.saveAs(data, this.soQd?.fileName);
        },
        err => {
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        },
      );
    } else {
      const file: any = this.fileDetail;
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  };

  //download file về máy tính
  async downloadFile(id: string) {
    const file: File = this.listFile.find(element => element?.lastModified.toString() == id);
    if (!file) {
      const fileAttach = this.lstFiles.find(element => element?.id == id);
      if (fileAttach) {
        await this.quanLyVonPhiService.downloadFile(fileAttach.fileUrl).toPromise().then(
          (data) => {
            fileSaver.saveAs(data, fileAttach.fileName);
          },
          err => {
            this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
          },
        );
      }
    } else {
      const blob = new Blob([file], { type: "application/octet-stream" });
      fileSaver.saveAs(blob, file.name);
    }
  };

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  };

  updateAllChecked() {
    this.lstCtietBcao.forEach(item => {
      item.checked = this.allChecked;
    })
  };

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
  };

  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  };

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
        item.stt = item.stt.replace(nho, str);
      })
    })
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
    this.sum(stt)
    this.updateEditCache();
  };

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
          this.lstCtietBcao[index].nguonKhac += item.nguonKhac;
          this.lstCtietBcao[index].nguonNsnn += item.nguonNsnn;
          this.lstCtietBcao[index].tongCong += item.tongCong;
        }
      })
      stt = this.getHead(stt);
    }
    this.getTotal();
  };

  getTotal() {
    this.total.nguonKhac = 0;
    this.total.nguonNsnn = 0;
    this.total.tongCong = 0;
    this.lstCtietBcao.forEach(item => {
      this.total.nguonKhac += item.nguonKhac;
      this.total.nguonNsnn += item.nguonNsnn;
      this.total.nguonKhac += item.nguonKhac;
    })
    if (
      this.total.nguonKhac == 0,
      this.total.nguonNsnn == 0,
      this.total.tongCong == 0
    ) {
      this.total.nguonKhac = null,
        this.total.nguonNsnn = null,
        this.total.tongCong = null
    }
  };

  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: {
          ...item,
        }
      }
    })
  };

  getLowStatus(str: string) {
    const index: number = this.lstCtietBcao.findIndex(e => this.getHead(e.stt) == str);
    if (index == -1) {
      return false;
    }
    return true;
  };

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  };

  // huy thay doi
  cancelEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id);
    // lay vi tri hang minh sua
    this.editCache[id] = {
      data: { ...this.lstCtietBcao[index] },
      edit: false
    };
  };

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
          if (this.lstCtietBcao.findIndex(e => e.maNdung == item.id) == -1) {
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
  };

  addFirst(initItem: ItemData) {
    if (initItem.id) {
      const item: ItemData = {
        ...initItem,
        stt: "0.1",
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
      }
      this.lstCtietBcao.push(item);

      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  };

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

    // them moi phan tu
    if (initItem.id) {
      const item: ItemData = {
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
      const item: ItemData = {
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
  };

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
    // them moi phan tu
    if (initItem.id) {
      const item: ItemData = {
        ...initItem,
        stt: head + "." + (tail + 1).toString(),
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
      }
      this.lstCtietBcao.splice(ind + 1, 0, item);
      this.editCache[item.id] = {
        edit: true,
        data: { ...item }
      };
    }
  };

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
  };

  checkAllChild(str: string): boolean {
    let nho = true;
    this.lstCtietBcao.forEach(item => {
      if ((this.getHead(item.stt) == str) && (!item.checked) && (item.stt != str)) {
        nho = item.checked;
      }
    })
    return nho;
  };

  changeModel(id: any) {
    this.editCache[id].data.tongCong = Number(this.editCache[id].data.nguonNsnn) + Number(this.editCache[id].data.nguonKhac);
  };

  saveEdit(id: string): void {
    if (
      (!this.editCache[id].data.nguonKhac && this.editCache[id].data.nguonKhac !== 0) ||
      (!this.editCache[id].data.nguonNsnn && this.editCache[id].data.nguonNsnn !== 0)
    ) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS)
      return;
    }
    if (this.editCache[id].data.nguonKhac < 0 ||
      this.editCache[id].data.nguonNsnn < 0) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_NEGATIVE)
      return;
    }
    this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.sum(this.lstCtietBcao[index].stt);
    this.updateEditCache();
  };

  deleteFile(id: string): void {
    this.lstFiles = this.lstFiles.filter((a: any) => a.id !== id);
    this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
    this.listIdFilesDelete.push(id);
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

}
