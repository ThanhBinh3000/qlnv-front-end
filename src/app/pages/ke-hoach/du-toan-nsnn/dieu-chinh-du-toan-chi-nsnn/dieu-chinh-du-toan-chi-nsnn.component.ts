import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { UserService } from 'src/app/services/user.service';
import { DIEU_CHINH_DU_TOAN_NSNN_LIST } from './dieu-chinh-du-toan-chi-nsnn.constant';

@Component({
  selector: 'app-dieu-chinh-du-toan-chi-nsnn',
  templateUrl: './dieu-chinh-du-toan-chi-nsnn.component.html',
  styleUrls: ['./dieu-chinh-du-toan-chi-nsnn.component.scss'],
})
export class DieuChinhDuToanChiNSNNComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })

  //thong tin dang nhap
  userInfo: any;
  user: any;
  donVis: any[] = [];
  capDvi: string;


  DieuChinhDuToanChiNSNNList = DIEU_CHINH_DU_TOAN_NSNN_LIST;
  danhSach: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private notification: NzNotificationService,
    private danhMuc: DanhMucHDVService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    const userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info
    this.user = this.userService.getUserLogin();
    this.DieuChinhDuToanChiNSNNList.forEach(data => {
      data.Role.forEach(item => {
        if (item?.role.includes(this.userInfo?.roles[0]?.code) && this.user.CAP_DVI == item.unit) {
          this.danhSach.push(data);
          return;
        }
      })
    })
    this.spinner.hide();
  }

  //get user info
  async getUserInfo(username: string) {
    await this.userService.getUserInfo(username).toPromise().then(
      (data) => {
        if (data?.statusCode == 0) {
          this.userInfo = data?.data
          return data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
  }

  redirectThongTinChiTieuKeHoachNam() {
    this.router.navigate([
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      1,
    ]);
  }
}
