import { cloneDeep } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { HelperService } from 'src/app/services/helper.service';
import { ChiTietDuAn } from 'src/app/models/ChiTietDuAn';
import { DonviService } from 'src/app/services/donvi.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { Globals } from 'src/app/shared/globals';

@Component({
  selector: 'dialog-thong-tin-phu-luc-bang-gia-hop-dong',
  templateUrl: './dialog-thong-tin-phu-luc-bang-gia-hop-dong.component.html',
  styleUrls: ['./dialog-thong-tin-phu-luc-bang-gia-hop-dong.component.scss'],
})
export class DialogThongTinPhuLucBangGiaHopDongComponent implements OnInit {
  data: any = null;
  dataTable: any[] = [];
  tableExist: boolean = false;
  itemRow: any = {};

  optionsDonVi: any[] = [];
  inputDonVi: string = '';
  optionsDonViShow: any[] = [];
  selectedDonVi: any = {};

  isEdit: boolean = false;

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  constructor(
    private _modalRef: NzModalRef,
    private helperService: HelperService,
    private donViService: DonviService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      if (this.data && this.data.detail) {
        this.isEdit = true;
        this.dataTable = this.data.detail;
        if (this.dataTable && this.dataTable.length > 0) {
          for (let i = 0; i < this.dataTable.length; i++) {
            this.dataTable[i].stt = i + 1;
          }
        }
      }
      else {
        this.data = { id: null, stt: 0 };
      }
      this.updateEditCache();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  ngAfterViewChecked(): void {
    const table = document.getElementsByTagName('table');
    this.tableExist = table && table.length > 0 ? true : false;
  }

  updateEditCache(): void {
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach(item => {
        this.editCache[item.stt] = {
          edit: false,
          data: { ...item }
        };
      });
    }
  }

  cancelEdit(stt: number): void {
    const index = this.dataTable.findIndex(item => item.stt === stt);
    this.editCache[stt] = {
      data: { ...this.dataTable[index] },
      edit: false
    };
  }

  saveEdit(stt: number): void {
    const index = this.dataTable.findIndex(item => item.stt === stt);
    Object.assign(this.dataTable[index], this.editCache[stt].data);
    this.editCache[stt].edit = false;
  }

  addRow() {
    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.itemRow);
    item.stt = this.dataTable.length + 1;
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
    this.dataTable = this.dataTable.filter(x => x.stt != data.stt);
    this.sortTableId();
    this.updateEditCache();
  }

  editRow(stt: number) {
    this.editCache[stt].edit = true;
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
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
    this._modalRef.close(this.data);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
