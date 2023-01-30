import {Component, Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'dialog-khong-ban-hanh',
  templateUrl: './dialog-khong-ban-hanh.component.html',
  styleUrls: ['./dialog-khong-ban-hanh.component.scss'],
})
export class DialogKhongBanHanhComponent implements OnInit {
  @Input() dataQĐ: any;
  @Input() isView = false;
  khongBanHanh: any;
  vanBanDinhKemList: any[] = [];

  constructor(
    private _modalRef: NzModalRef,
  ) {
  }

  async ngOnInit() {
    this.khongBanHanh = {};
    if (this.dataQĐ) {
      this.khongBanHanh.lyDo = this.dataQĐ.lyDoKbh;
      this.khongBanHanh.soVanBan = this.dataQĐ.soVbKbh;
      this.khongBanHanh.ngayKy = this.dataQĐ.ngayKyKbh;
      this.khongBanHanh.noiDung = this.dataQĐ.noiDungKbh;
      this.vanBanDinhKemList = this.dataQĐ.vanBanDinhKemReqs;
    }
  }

  handleOk() {
    this.khongBanHanh.vanBanDinhKems = this.vanBanDinhKemList;
    this._modalRef.close(this.khongBanHanh);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
