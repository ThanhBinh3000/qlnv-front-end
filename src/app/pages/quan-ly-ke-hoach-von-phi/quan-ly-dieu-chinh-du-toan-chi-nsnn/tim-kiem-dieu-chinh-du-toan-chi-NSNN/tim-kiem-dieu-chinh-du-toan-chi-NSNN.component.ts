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
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { TRANGTHAIBAOCAO } from '../quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';

@Component({
  selector: 'app-tim-kiem-dieu-chinh-du-toan-chi-NSNN',
  templateUrl: './tim-kiem-dieu-chinh-du-toan-chi-NSNN.component.html',
  styleUrls: ['./tim-kiem-dieu-chinh-du-toan-chi-NSNN.component.scss'],
})
export class TimKiemDieuChinhDuToanChiNSNNComponent implements OnInit {
  //thong tin dang nhap
  userInfo: any;
  //thong tin tim kiem
  searchFilter = {
    dotBcao: null,
    nam: null,
    tuNgay: "",
    denNgay: "",
    maBaoCao: "",
    donViTao: "",
    paggingReq: {
      limit: 10,
      page: 1
    },
    loaiTimKiem: "0",
    trangThais:[],
  };
  //danh muc
  danhSachDieuChinh: any[] = [];
  trangThais: any[] = TRANG_THAI_TIM_KIEM;
  //phan trang
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  date: any = new Date()
  trangThai!:string;
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private userService: UserService,
  ) {
  }

  async ngOnInit() {
    let userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info
    this.searchFilter.denNgay = new Date().toISOString().slice(0, 16);
    this.date.setMonth(this.date.getMonth() - 1);
    this.searchFilter.tuNgay = this.date.toISOString().slice(0, 16);
    this.searchFilter.nam = new Date().getFullYear()
    this.searchFilter.donViTao = this.userInfo?.dvql;
    this.trangThai = '1'
    this.onSubmit();
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

  redirectThongTinTimKiem() {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn',
      0,
    ]);
  }

  redirectSuaThongTinTimKiem(id) {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn',
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

    let searchFilterTemp = Object.assign({},this.searchFilter);
    searchFilterTemp.trangThais= [];
    searchFilterTemp.tuNgay = this.datePipe.transform(searchFilterTemp.tuNgay, 'dd/MM/yyyy') || searchFilterTemp.tuNgay;
    searchFilterTemp.denNgay = this.datePipe.transform(searchFilterTemp.denNgay, 'dd/MM/yyyy') || searchFilterTemp.denNgay;
    if(this.trangThai){
      searchFilterTemp.trangThais.push(this.trangThai)
    }else{
      searchFilterTemp.trangThais = [Utils.TT_BC_1,Utils.TT_BC_2,Utils.TT_BC_3,Utils.TT_BC_4,Utils.TT_BC_5,Utils.TT_BC_6,Utils.TT_BC_7,Utils.TT_BC_8,Utils.TT_BC_9]
    }
    this.spinner.show();
    await this.quanLyVonPhiService.timKiemDieuChinh1(searchFilterTemp).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachDieuChinh = data.data.content;
          this.danhSachDieuChinh.forEach(e => {
            e.ngayTao = this.datePipe.transform(e.ngayTao, 'dd/MM/yyyy');
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
    this.searchFilter.paggingReq.page = page;
    this.onSubmit();
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.searchFilter.paggingReq.limit = size;
    this.onSubmit();
  }

  taoMoi() {
    if (this.searchFilter.nam || this.searchFilter.nam === 0) {
      if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }
    if (!this.searchFilter.nam) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      return;
    }
      this.router.navigate([
        '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/0/' + this.searchFilter.nam,
      ]);

  }

  xemChiTiet(id: string) {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/' + id,
    ])
  }

  async xoaDuToanDieuChinh(id: string) {
    await this.quanLyVonPhiService.xoaDuToanDieuChinh(id).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS)
          this.onSubmit()
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    )
  }

  getStatusName(trangThai: string) {
    return this.trangThais.find(e => e.id == trangThai).tenDm;
  }
}
