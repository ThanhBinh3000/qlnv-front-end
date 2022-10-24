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
    this.userInfo = this.userService.getUserLogin();
    // this.roles = this.userInfo?.roles;
    this.DieuChinhDuToanChiNSNNList.forEach(data => {
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
