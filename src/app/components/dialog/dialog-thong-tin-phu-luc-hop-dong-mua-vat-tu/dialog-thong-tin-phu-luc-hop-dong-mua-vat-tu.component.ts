import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'dialog-thong-tin-phu-luc-hop-dong-mua-vat-tu',
  templateUrl: './dialog-thong-tin-phu-luc-hop-dong-mua-vat-tu.component.html',
  styleUrls: ['./dialog-thong-tin-phu-luc-hop-dong-mua-vat-tu.component.scss'],
})
export class DialogThongTinPhuLucHopDongMuaVatTuComponent implements OnInit {
  cucDTNN: string = null;
  listDonVi: any[] = [];
  tenDuAn: string = null;
  ghiChu: string = null;
  dataTable: any[] = [{
    goiThau: 'ggg',
    diaDiem: 'hhhh',
    soLuong: 12,
    donGia: 100000,
    thanhTien: 1200000,
  }];
  tableExist: boolean = false;

  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private helperService: HelperService,
    private cdr: ChangeDetectorRef,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.danhMucDonViGetAll();
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
    this.cdr.detectChanges();
  }

  async danhMucDonViGetAll() {
    this.listDonVi = [];
    let res = await this.danhMucService.danhMucDonViGetAll();
    if (res.msg == MESSAGE.SUCCESS) {
      this.listDonVi = res.data;
    }
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
    this._modalRef.close();
  }

  handleCancel() {
    this._modalRef.close();
  }

  async search() {
    // this.dataTable = [];
  }
}
