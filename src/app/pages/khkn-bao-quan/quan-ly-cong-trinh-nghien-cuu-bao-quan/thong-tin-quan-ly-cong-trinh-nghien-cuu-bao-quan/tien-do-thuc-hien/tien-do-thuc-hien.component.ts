import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PAGE_SIZE_DEFAULT } from './../../../../../constants/config';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-tien-do-thuc-hien',
  templateUrl: './tien-do-thuc-hien.component.html',
  styleUrls: ['./tien-do-thuc-hien.component.scss']
})
export class TienDoThucHienComponent implements OnInit {
  @Input() id: number;
  @Input() isView: boolean;
  @Input() typeVthh: string;
  @Input() idInput: number;
  @Output()
  showListEvent = new EventEmitter<any>();
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  dataTable: any[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    public userService: UserService,
    private notification: NzNotificationService
  ) { }

  ngOnInit() {
  }
  selectTab() {

  }
  async changePageIndex(event) {
    this.spinner.show();
    try {
      this.page = event;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageSize(event) {
    this.spinner.show();
    try {
      this.pageSize = event;
      this.spinner.hide();
    } catch (e) {
      console.log('error: ', e);
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }
}
