import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PAGE_SIZE_DEFAULT } from 'src/app/constants/config';
import { MESSAGE } from 'src/app/constants/message';
import { OldResponseData } from 'src/app/interfaces/response';
import { ThemchucvuComponent } from './themchucvu/themchucvu.component';

@Component({
  selector: 'app-chucvu',
  templateUrl: './chucvu.component.html',
  styleUrls: ['./chucvu.component.scss'],
})
export class ChucvuComponent implements OnInit {
  addclass3 = 'hidecard';
  visible = false;
  nodes: any;
  datas = [];
  nodeSelected: any;
  cureentNodeParent: any;
  listdanhmuchoso: any;
  constructor(
    private fb: FormBuilder,
    private _modalService: NzModalService,
    private notification: NzNotificationService,
  ) {}

  ngOnInit(): void {
    this.timtheodieukien();
  }

  /**
   * bắt đầu sử lý phân trang
   */
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  changePageSize(event) {
    this.pageSize = event;
    this.timtheodieukien();
  }
  changePageIndex(event) {
    this.page = event;
    this.timtheodieukien();
  }

  /**
   * kết thúc sử lý phân trang
   */

  timtheodieukien(data?: any) {
    let body = {
      pageInfo: {
        page: this.page,
        pageSize: this.pageSize,
      },
      sorts: [
        {
          field: '',
          dir: 0,
        },
      ],
      filters: [
        {
          field: '',
          value: '',
        },
      ],
      keyword: this.keywordSearch ?? '',
    };

    // this.chucvuService.timTheoDieuKien(body).then((res: OldResponseData) => {
    //   if (res.success) {
    //     this.datas = res.data;
    //     this.totalRecord = res.totalRecord;
    //   } else {
    //     this.notification.error(MESSAGE.ERROR, res.error);
    //   }
    // })
  }

  /**
   * thêm sửa mới nhóm quyền
   */

  themmoi(data?) {
    let modal = this._modalService.create({
      nzTitle: 'Thêm mới chức vụ',
      nzContent: ThemchucvuComponent,
      nzClosable: true,
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzWidth: 450,
      nzComponentParams: { data },
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
        this.timtheodieukien();
      }
    });
  }

  /**
   * xoa đơn vị
   */

  xoa(data: any) {
    this._modalService.confirm({
      nzClosable: false,
      nzTitle: 'Xác nhận',
      nzContent: 'Bạn có chắc chắn muốn thực hiện hành động này?',
      nzOkText: 'Đồng ý',
      nzCancelText: 'Không',
      nzOkDanger: true,
      nzWidth: 440,
      nzOnOk: () => {
        // this.chucvuService.delete(data.id).then((res: OldResponseData) => {
        //   if (res.success) {
        //     this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
        //     this.timtheodieukien()
        //   } else {
        //     this.notification.error(MESSAGE.ERROR, res.error);
        //   }
        // })
      },
    });
  }

  chiTiet(dataDetail) {
    let modal = this._modalService.create({
      nzTitle: 'Chi tiết chức vụ',
      nzContent: ThemchucvuComponent,
      nzClosable: true,
      nzFooter: null,
      nzStyle: { top: '50px' },
      nzWidth: 450,
      nzComponentParams: { dataDetail },
    });
    modal.afterClose.subscribe((b) => {});
  }

  //  search text
  keywordSearch: any;
  searchKey() {
    this.timtheodieukien();
  }
}
