import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucService } from 'src/app/services/danhmuc.service';

@Component({
  selector: 'dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet',
  templateUrl: './dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component.html',
  styleUrls: ['./dialog-thong-tin-phu-luc-quyet-dinh-phe-duyet.component.scss'],
})
export class DialogThongTinPhuLucQuyetDinhPheDuyetComponent implements OnInit {
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  cucDTNN: string = null;
  listDonVi: any[] = [];
  tenDuAn: string = null;
  ghiChu: string = null;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  tableExist: boolean = false;

  constructor(
    private _modalRef: NzModalRef,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMucService: DanhMucService,
    private cdr: ChangeDetectorRef,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.danhMucDonViGetAll();
      this.spinner.hide();
      this.dataTable.push({
        goiThau: 'ggg',
        diaDiem: 'hhhh',
        soLuong: 'hhhh',
        donGia: 'hhhh',
        thanhTien: 'hhhh',
      });
      this.updateEditCache();
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

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: string): void {
    const index = this.dataTable.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.dataTable[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    const index = this.dataTable.findIndex(item => item.id === id);
    Object.assign(this.dataTable[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    this.dataTable.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
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
            parseFloat(
              table.rows[i].cells[indexCell].innerHTML.replace(
                stringReplace,
                '',
              ),
            );
        }
      }
    }
    return sumVal;
  }

  handleOk() {

  }

  xoaItem(item: any) {

  }

  onCancel() {
    this._modalRef.close();
  }

  async search() {
    this.dataTable = [];
    let param = {
      pageSize: this.pageSize,
      pageNumber: this.page,
    }
    this.totalRecord = 0;
    let res = null;
    if (res.msg == MESSAGE.SUCCESS) {
      let data = res.data;
      if (data && data.content && data.content.length > 0) {
        this.dataTable = data.content;
      }
      this.totalRecord = data.totalElements;
    } else {
      this.notification.error(MESSAGE.ERROR, res.msg);
    }
  }

  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      await this.search();
      this.spinner.hide();
    }
    catch (e) {
      console.log('error: ', e)
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}
