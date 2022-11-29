import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PAGE_SIZE_DEFAULT } from './../../../../../constants/config';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/components/base/base.component';
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

  dataTable: any[] = []
  rowItem: any = {};
  constructor(
    private spinner: NgxSpinnerService,
    public userService: UserService,
    private notification: NzNotificationService
  ) {
    super();
    super.ngOnInit();
  }

  ngOnInit() {
    this.dataTable = this.dataTableTienDo;
  }

  selectTab() {

  }

  addRow() {
    let trangThai = this.listTrangThai.filter(item => item.ma == this.rowItem.trangThai)[0];
    this.rowItem.tenTrangThai = trangThai.giaTri;
    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = {};
    this.dataTableTienDoChange.emit(this.dataTable);
  }

  clearData() {

  }



}
