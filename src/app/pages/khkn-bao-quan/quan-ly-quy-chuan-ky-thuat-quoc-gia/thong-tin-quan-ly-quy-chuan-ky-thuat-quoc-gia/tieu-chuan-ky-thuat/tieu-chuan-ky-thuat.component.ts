import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BaseComponent } from 'src/app/components/base/base.component';
import { HttpClient } from '@angular/common/http';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tieu-chuan-ky-thuat',
  templateUrl: './tieu-chuan-ky-thuat.component.html',
  styleUrls: ['./tieu-chuan-ky-thuat.component.scss']
})
export class TieuChuanKyThuatComponent extends BaseComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();

  @Input() dataTableKyThuat: any[] = [];
  @Input() listCloaiVthh: [];

  @Output()
  dataTableKyThuatChange = new EventEmitter<any[]>();

  listTrangThai: any[] = [
    { ma: this.STATUS.CHUA_THUC_HIEN, giaTri: 'Chưa thực hiện' },
    { ma: this.STATUS.DANG_THUC_HIEN, giaTri: 'Đang thực hiện' },
    { ma: this.STATUS.DA_HOAN_THANH, giaTri: 'Đã hoàn thành' },
  ];

  dataTable: any[] = []
  rowItem: any = {};
  chiTieuCha: true;
  listOfCloaiVthh: any = []
  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    public userService: UserService,
  ) {
    super(httpClient, storageService, userService);
    super.ngOnInit();
  }

  ngOnInit() {
    this.dataTable = this.dataTableKyThuat;
    console.log(1234567);
    console.log(this.listCloaiVthh, "listLoaiVthh");
  }

  selectTab() {

  }

  addRow() {

    this.dataTable = [...this.dataTable, this.rowItem];
    this.rowItem = {};
    this.dataTableKyThuatChange.emit(this.dataTable);
  }

  clearData() {

  }



}
