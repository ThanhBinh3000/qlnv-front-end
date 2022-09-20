import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { UserService } from 'src/app/services/user.service';
import { QUAN_LY_THONG_TIN_QUYET_TOAN_LIST } from './quan-ly-thong-tin-quyet-toan.constant';

@Component({
  selector: 'app-quan-ly-thong-tin-quyet-toan',
  templateUrl: './quan-ly-thong-tin-quyet-toan.component.html',
  styleUrls: ['./quan-ly-thong-tin-quyet-toan.component.scss'],
})
export class QuanLyThongTinQuyetToanComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })

  //thong tin dang nhap
  userInfo: any;
  donVis: any[] = [];
  capDvi: string;

  QuanLyThongTinQuyetToanList = QUAN_LY_THONG_TIN_QUYET_TOAN_LIST;
  danhSach: any[] = [];


  constructor(
    private router: Router,
    private userService: UserService,
    private spinner: NgxSpinnerService,
  ) { }

  async ngOnInit() {

    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.QuanLyThongTinQuyetToanList.forEach(data => {
      let check = false;
      data.Role.forEach(item => {
        if (this.userService.isAccessPermisson(item)) {
          check = true;
          return;
        }
      })
      if (check) {
        this.danhSach.push(data);
      }
    })
    this.spinner.hide();
  }
  redirectThongTinChiTieuKeHoachNam() {
    this.router.navigate([
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      1,
    ]);
  }
}
