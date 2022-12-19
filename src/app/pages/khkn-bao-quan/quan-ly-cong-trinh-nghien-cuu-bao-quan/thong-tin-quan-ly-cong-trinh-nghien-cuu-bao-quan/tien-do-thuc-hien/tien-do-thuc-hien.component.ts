import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PAGE_SIZE_DEFAULT } from './../../../../../constants/config';
import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/components/base/base.component';
import { TienDoThucHien } from 'src/app/models/KhoaHocCongNgheBaoQuan';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-tien-do-thuc-hien',
  templateUrl: './tien-do-thuc-hien.component.html',
  styleUrls: ['./tien-do-thuc-hien.component.scss']
})
export class TienDoThucHienComponent extends BaseComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  @Input() dataTableTienDo: any[] = [];
  @Output()
  dataTableTienDoChange = new EventEmitter<any[]>();

  listTrangThai: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' },
  ];
  hasError: boolean = false;
  dataTable: any[] = []
  rowItem: TienDoThucHien = new TienDoThucHien;
  dataEdit: { [key: string]: { edit: boolean; data: TienDoThucHien } } = {};
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, userService);
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateEditCache();
    this.emitDataTable();
  }

  ngOnInit() {
    // this.dataTable = this.dataTableTienDo;
    // console.log(this.dataTable, "huhu");
  }

  selectTab() {

  }

  themMoiItem() {


    if (!this.dataTable) {
      this.dataTable = [];
    }
    this.sortTableId();
    let item = cloneDeep(this.rowItem);
    item.stt = this.dataTable.length + 1;
    item.edit = false;
    this.dataTable = [
      ...this.dataTable,
      item,
    ]

    this.rowItem = new TienDoThucHien();
    this.updateEditCache();
    this.emitDataTable();
  }
  onChangeTrangThai(trangThai, typeData?) {
    const tt = this.listTrangThai.filter(d => d.ma == trangThai)
    if (typeData) {
      if (tt.length > 0) {
        typeData.tenTrangThaiTd = tt[0].giaTri;
      }
    }
    if (tt.length > 0) {
      this.rowItem.tenTrangThaiTd = tt[0].giaTri;
    }
  }

  sortTableId() {
    this.dataTable.forEach((lt, i) => {
      lt.stt = i + 1;
    });
  }
  editItem(index: number): void {
    this.dataEdit[index].edit = true;
  }
  updateEditCache(): void {
    if (this.dataTable) {
      this.dataTable.forEach((item, index) => {
        this.dataEdit[index] = {
          edit: false,
          data: { ...item },
        };
      });
    }
  }
  huyEdit(id: number): void {
    const index = this.dataTable.findIndex((item) => item.idVirtual == id);
    this.dataEdit[id] = {
      data: { ...this.dataTable[index] },
      edit: false,
    };
  }
  luuEdit(index: number): void {
    this.hasError = (false);
    Object.assign(this.dataTable[index], this.dataEdit[index].data);
    this.emitDataTable();
    this.dataEdit[index].edit = false;
  }



  xoaItem(index: number) {
    this.modal.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 400,
      nzOnOk: async () => {
        try {
          this.dataTable.splice(index, 1);
          this.updateEditCache();
          this.emitDataTable();
          this.dataTable;
        } catch (e) {
          console.log('error', e);
        }
      },
    });
  }
  clearData() {
    this.rowItem = new TienDoThucHien();
  }
  emitDataTable() {
    this.dataTableTienDoChange.emit(this.dataTable)
  }



}
