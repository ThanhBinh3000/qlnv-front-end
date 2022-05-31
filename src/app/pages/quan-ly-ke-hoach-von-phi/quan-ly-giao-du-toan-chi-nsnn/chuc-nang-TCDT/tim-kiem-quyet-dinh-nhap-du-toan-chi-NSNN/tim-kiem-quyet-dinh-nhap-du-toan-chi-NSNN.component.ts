import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';
// import { TRANGTHAIBAOCAO } from '../../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';
@Component({
  selector: 'app-tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN',
  templateUrl: './tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN.component.html',
  styleUrls: ['./tim-kiem-quyet-dinh-nhap-du-toan-chi-NSNN.component.scss']
})
export class TimKiemQuyetDinhNhapDuToanChiNSNNComponent implements OnInit {
  //thong tin dang nhap
  userInfo: any;
  //thong tin tim kiem
  searchFilter = {
    nam: null,
    tuNgay: "",
    denNgay: "",
    soQd: "",
  };
  //danh muc
  danhSachQuyetDinh: any = [];
  //phan trang
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }

  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
  ) {
  }

  async ngOnInit() {
  }

  redirectThongTinTimKiem() {
    this.router.navigate([
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      0,
    ]);
  }

  redirectSuaThongTinTimKiem(id) {
    this.router.navigate([
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      id,
    ]);
  }

  //search list bao cao theo tieu chi
  async onSubmit() {
    if (this.searchFilter.nam || this.searchFilter.nam === 0) {
      if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }
    let requestReport = {
      soQd: this.searchFilter.soQd,
      nam: this.searchFilter.nam,
      ngayTaoDen: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
      ngayTaoTu: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
      str: null,
      paggingReq: {
        limit: this.pages.size,
        page: this.pages.page,
      }
    };
    this.spinner.show();
    await this.quanLyVonPhiService.timBaoCaoGiao1(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachQuyetDinh = data.data.content;
          this.danhSachQuyetDinh.forEach(e => {
            e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
          })
          this.totalElements = data.data.totalElements;
          this.totalPages = data.data.totalPages;

        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.spinner.hide();
  }

  //doi so trang
  onPageIndexChange(page) {
    this.pages.page = page;
    this.onSubmit();
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.pages.size = size;
    this.onSubmit();
  }

  async taoMoi() {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC',
    ]);
  }

  xemChiTiet(id: string) {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC/' + id,
    ])
  }

  // getStatusName(trangThai: string){
  //     return this.trangThais.find(e => e.id == trangThai)?.tenDm;
  // }

  // getUnitName(maDvi: string){
  //     return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
  // }

}
