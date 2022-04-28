import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService} from 'src/app/services/quanLyVonPhi.service'

@Component({
  selector: 'dialog-chon-them-khoan-muc',
  templateUrl: './dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN.component.html',
  styleUrls: ['./dialog-chon-them-khoan-muc-qd-giao-du-toan-chi-NSNN.component.scss'],
})
export class DialogChonThemKhoanMucQlGiaoDuToanChiNSNNComponent implements OnInit {
  @Input() danhSachKhoanMuc: any =[];
  khoanMucs: any = [];

  searchFilter = {
    khoanMuc: "",
  };

  constructor(
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
    private QuanLyVonPhiService: QuanLyVonPhiService,
  ) { }

  async ngOnInit() {
    //get danh muc nhom chi
    this.danhMucService.dMKhoanMuc().toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.khoanMucs = data.data?.content;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  timKiemKhoanMuc(){
    let requestReport = {
      id: this.searchFilter.khoanMuc,
    };

    this.QuanLyVonPhiService.timDanhSachBCGiaoBTCPD(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          var tempArr = data.data;
          tempArr.forEach(e =>{
            this.danhSachKhoanMuc.push(e);
            console.log(this.danhSachKhoanMuc);
          })
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

    let req ={
      danhSachKhoanMuc : this.danhSachKhoanMuc,
      id: this.searchFilter.khoanMuc
    }
    this.danhSachKhoanMuc = []
    this._modalRef.close(req);
  }

  handleCancel() {
    this._modalRef.close();
  }
}
