import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { GIAO_DU_TOAN_CHI_NSNN_NSNN_LIST } from './giao-du-toan-chi-nsnn.constant';

@Component({
  selector: 'app-giao-du-toan-chi-nsnn',
  templateUrl: './giao-du-toan-chi-nsnn.component.html',
  styleUrls: ['./giao-du-toan-chi-nsnn.component.scss'],
})
export class GiaoDuToanChiNSNNComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })

  //thong tin dang nhap
  userInfo: any;
  user: any;
  donVis: any[] = [];
  capDvi: string;


  GiaoDuToanChiNSNNList = GIAO_DU_TOAN_CHI_NSNN_NSNN_LIST;
  danhSach: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private spinner: NgxSpinnerService,
  ) { }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.GiaoDuToanChiNSNNList.forEach(data => {
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
