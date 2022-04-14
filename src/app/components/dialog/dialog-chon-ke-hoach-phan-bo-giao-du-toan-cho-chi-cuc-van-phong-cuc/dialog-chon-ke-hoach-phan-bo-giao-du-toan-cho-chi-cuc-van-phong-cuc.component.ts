import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService} from 'src/app/services/quanLyVonPhi.service'
import { TRANGTHAITIMKIEM } from 'src/app/Utility/utils';

@Component({
  selector: 'app-dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc',
  templateUrl: './dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component.html',
  styleUrls: ['./dialog-chon-ke-hoach-phan-bo-giao-du-toan-cho-chi-cuc-van-phong-cuc.component.scss']
})
export class DialogChonKeHoachPhanBoGiaoDuToanChoChiCucVanPhongCucComponent implements OnInit {

  @Input() danhSachKhoanMuc:any;
  khoanMucs: any = [];
  trangThais: any = TRANGTHAITIMKIEM;

  searchFilter = {
    trangThai: "",
    nam: "",
  };

  constructor(
    private _modalRef: NzModalRef,
    private danhMucService: DanhMucHDVService,
    private notification: NzNotificationService,
    private QuanLyVonPhiService: QuanLyVonPhiService,
  ) { }

  async ngOnInit() {
    console.log(this.danhSachKhoanMuc);
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
      id: this.searchFilter.trangThai,
    };

    this.QuanLyVonPhiService.timDanhSachBCGiaoBTCPD(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          var tempArr = data.data;
          tempArr.forEach(e =>{
            this.danhSachKhoanMuc.push(e);
            e.lstQlnvDmKhoachVonPhi.forEach( el => {
            this.danhSachKhoanMuc.push(el);
            })
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
      id: this.searchFilter.trangThai
    }
    this._modalRef.close(req);
  }

  handleCancel() {
    this._modalRef.close();
  }

}
