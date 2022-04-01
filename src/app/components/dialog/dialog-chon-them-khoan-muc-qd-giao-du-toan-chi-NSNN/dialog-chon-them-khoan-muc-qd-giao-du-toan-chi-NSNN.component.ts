import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';

@Component({
  selector: 'dialog-chon-them-khoan-muc',
  templateUrl: './dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN.component.html',
  styleUrls: ['./dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN.component.scss'],
})
export class DialogChonThemKhoanMucQlGiaoDuToanChiNSNNComponent implements OnInit {
  @Input() danhSachKhoanMuc:any;
  khoanMucs: any = [];

  searchFilter = {
    khoanMuc: "",
  };

  constructor(
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    console.log(this.danhSachKhoanMuc);
    //get danh muc nhom chi
    this.danhMucService.dMKhoanChi().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.khoanMucs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
  }

  handleOk() {
    this._modalRef.close(this.danhSachKhoanMuc);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
[]
