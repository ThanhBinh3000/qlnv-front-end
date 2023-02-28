import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { displayNumber, exchangeMoney, mulNumber } from 'src/app/Utility/func';
import { AMOUNT, DON_VI_TIEN } from 'src/app/Utility/utils';


export class ItemData {
  level: any;
  checked: boolean;
  id: string;
  qlnvKhvonphiDchinhCtietId: string;
  stt: string;
  noiDung: string;
  dviTinh: string;
  sluongDuocGiao: number;
  sluongThien: number;
  soLuongUocThien: number;
  tongCong: number;
  dinhMuc: number;
  thanhTien: number;
  dtoanDaGiaoLke: number;
  dtoanDchinh: number;
  dtoanVuTvqtDnghi: number;
  kphiConThieu: number;
  maNoiDung: string;
}

@Component({
  selector: 'app-phu-luc-1',
  templateUrl: './phu-luc-1.component.html',
  styleUrls: ['./phu-luc-1.component.scss']
})
export class PhuLuc1Component implements OnInit {
  @Input() dataInfo;
  lstCtietBcao: ItemData[] = [];
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
  allChecked = false;
  editRecommendedValue: boolean;
  viewRecommendedValue: boolean;
  amount = AMOUNT;
  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};


  constructor(
    private _modalRef: NzModalRef,
    private notification: NzNotificationService,
  ) { }

  ngOnInit() {
  }

  checkDelete(stt: string) {
    const level = stt.split('.').length - 2;
    if (level == 0) {
      return true;
    }
    return false;
  };

  updateSingleChecked(): void {
    if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
      this.allChecked = true;
    } else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
      this.allChecked = false;
    }
  };

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
  };

  displayValue(num: number): string {
    num = exchangeMoney(num, '1', this.maDviTien);
    return displayNumber(num);
  };


  checkEdit(stt: string) {
    const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
    return lstTemp.every(e => !e.stt.startsWith(stt));
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
  };

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
  }

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

  updateEditCache(): void {
    this.lstCtietBcao.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  };

  changeModel(id: string): void {
    // this.editCache[id].data.ttienNamDtoan = mulNumber(this.editCache[id].data.dmucNamDtoan, this.editCache[id].data.sluongNamDtoan);
    // this.editCache[id].data.ttienTd = mulNumber(this.editCache[id].data.dmucNamDtoan, this.editCache[id].data.sluongTd);
  };

  startEdit(id: string): void {
    if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
      this.editCache[id].edit = true;
    } else {
      this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
      return;
    }
  };

  saveEdit(id: string): void {
    const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
    Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
    this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
    this.updateEditCache();
    this.sum(this.lstCtietBcao[index].stt);
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

  getHead(str: string): string {
    return str.substring(0, str.lastIndexOf('.'));
  };
  // lấy phần đuôi của stt
  getTail(str: string): number {
    return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
  };

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
  };

  getMoneyUnit() {
    return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
  };

  async save(trangThai: string, lyDoTuChoi: string) {

  };

  async tuChoi(mcn: string) {

  };

  doPrint() {

  };

  handleCancel() {
    this._modalRef.close();
  };

}
