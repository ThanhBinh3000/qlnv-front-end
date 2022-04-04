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
  quanLyVonPhiService: any;

  constructor(
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
  ) { }

  async ngOnInit() {
    console.log(this.danhSachKhoanMuc);
    //get danh muc nhom chi
    this.danhMucService.dMKhoanMuc().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.khoanMucs = data.data?.content;
          console.log(this.khoanMucs);
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
      }
    );
  }

  timKiemKhoanMuc(){
    let requestReport = {
      khoanMuc: this.searchFilter.khoanMuc,
    };

    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    this.quanLyVonPhiService.timBaoCaoGiao(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachKhoanMuc = data.data.content;
          console.log(this.danhSachKhoanMuc);

        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, err?.msg);
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
