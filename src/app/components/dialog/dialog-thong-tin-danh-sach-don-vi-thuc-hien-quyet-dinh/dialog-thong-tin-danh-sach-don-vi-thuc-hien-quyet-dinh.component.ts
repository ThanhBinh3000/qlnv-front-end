import { cloneDeep } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { HelperService } from 'src/app/services/helper.service';
import { ChiTietDuAn } from 'src/app/models/ChiTietDuAn';
import { DonviService } from 'src/app/services/donvi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { TinhTrangKhoHienThoiService } from 'src/app/services/tinhTrangKhoHienThoi.service';

@Component({
  selector: 'dialog-thong-tin-danh-sach-don-vi-thuc-hien-quyet-dinh',
  templateUrl: './dialog-thong-tin-danh-sach-don-vi-thuc-hien-quyet-dinh.component.html',
  styleUrls: ['./dialog-thong-tin-danh-sach-don-vi-thuc-hien-quyet-dinh.component.scss'],
})
export class DialogThongTinDonViThucHienQuyetDinhComponent implements OnInit {
  data: any = null;
  dataTable: any[] = [];
  tableExist: boolean = false;
  itemRow: any = {};

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};

  listNganLo: any[] = [];

  isEdit: boolean = false;

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  constructor(
    private _modalRef: NzModalRef,
    private helperService: HelperService,
    private donViService: DonviService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private tinhTrangKhoHienThoiService: TinhTrangKhoHienThoiService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.data) {
        this.isEdit = true;
        this.dataTable = this.data.detail;
        this.selectedDonVi.tenDvi = this.data.tenDvi;
        this.selectedDonVi.maDvi = this.data.maDvi;
        this.inputDonVi = this.data.tenDvi;
      }
      else {
        this.data = { id: null };
      }
      await Promise.all([
        this.loadDonVi(),
        this.loadNganLo(),
      ]);
      this.updateEditCache();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async loadDonVi() {
    const res = await this.donViService.layTatCaDonVi();
    this.optionsDonVi = [];
    if (res.msg == MESSAGE.SUCCESS) {
      for (let i = 0; i < res.data.length; i++) {
        const item = {
          ...res.data[i],
          labelDonVi: res.data[i].maDvi + ' - ' + res.data[i].tenDvi,
        };
        this.optionsDonVi.push(item);
      }
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  onInputDonVi(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.optionsDonViShow = [];
    } else {
      this.optionsDonViShow = this.optionsDonVi.filter(
        (x) => x.labelDonVi.toLowerCase().indexOf(value.toLowerCase()) != -1,
      );
    }
  }

  async selectDonVi(donVi) {
    this.inputDonVi = donVi.tenDvi;
    this.selectedDonVi = donVi;
  }

  async loadNganLo() {
    let body = {
      "maNganLo": "",
      "nganKhoId": null,
      "paggingReq": {
        "limit": 1000,
        "page": 1
      },
      "str": "",
      "tenNganLo": "",
      "trangThai": ""
    }
    const res = await this.tinhTrangKhoHienThoiService.timKiemNganLo(body);
    this.listNganLo = [];
    if (res.msg == MESSAGE.SUCCESS) {
      this.listNganLo = res.data.content;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  selectNganLo(nganLo, item) {
    if (nganLo) {
      item.maKhoNganLo = nganLo;
      let getNganLo = this.listNganLo.filter(x => x.maNganlo == item.maKhoNganLo);
      if (getNganLo && getNganLo.length > 0) {
        item.tenKhoNganLo = getNganLo[0].tenNganlo;
      }
    }
  }

  ngAfterViewChecked(): void {
    const table = document.getElementsByTagName('table');
    this.tableExist = table && table.length > 0 ? true : false;
  }

  updateEditCache(): void {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(item => {
        this.editCache[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }

  cancelEdit(id: number): void {
    const index = this.dataTable.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.dataTable[index] },
      edit: false
    };
  }

  saveEdit(id: number): void {
    const index = this.dataTable.findIndex(item => item.id === id);
    this.editCache[id].data.thanhTien = (this.editCache[id].data.soLuong ?? 0) * (this.editCache[id].data.donGia ?? 0);
    Object.assign(this.dataTable[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  addRow() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.itemRow);
    item.id = this.dataTable.length + 1;
    item.thanhTien = (item.soLuong ?? 0) * (item.donGia ?? 0);
    this.dataTable = [
      ...this.dataTable,
      item,
    ]
    this.updateEditCache();
    this.clearItemRow();
  }

  clearItemRow() {
    this.itemRow = {};
  }

  deleteRow(data: any) {
    this.dataTable = this.dataTable.filter(x => x.id != data.id);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(id: number) {
    this.editCache[id].edit = true;
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.id = i + 1;
    });
  }

  reduceRowData(
    indexTable: number,
    indexCell: number,
    indexRow: number,
    stringReplace: string,
    idTable: string,
  ): number {
    let sumVal = 0;
    const listTable = document
      .getElementById(idTable)
      ?.getElementsByTagName('table');

    if (listTable && listTable.length >= indexTable) {
      const table = listTable[indexTable];
      for (let i = indexRow; i < table.rows.length - 1; i++) {
        if (
          table.rows[i]?.cells[indexCell]?.innerHTML &&
          table.rows[i]?.cells[indexCell]?.innerHTML != ''
        ) {
          sumVal =
            sumVal +
            parseFloat(this.helperService.replaceAll(table.rows[i].cells[indexCell].innerHTML, stringReplace, ''));
        }
      }
    }
    return sumVal;
  }

  handleOk() {
    if (this.selectedDonVi) {
      this.data.tenDvi = this.selectedDonVi.tenDvi;
      this.data.maDvi = this.selectedDonVi.maDvi;
    }
    if (this.dataTable && this.dataTable.length > 0) {
      this.data.detail = this.dataTable;
      this.data.soLuong = this.dataTable.map(item => item.soLuong).reduce((prev, next) => prev + next);
    }
    this._modalRef.close(this.data);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
