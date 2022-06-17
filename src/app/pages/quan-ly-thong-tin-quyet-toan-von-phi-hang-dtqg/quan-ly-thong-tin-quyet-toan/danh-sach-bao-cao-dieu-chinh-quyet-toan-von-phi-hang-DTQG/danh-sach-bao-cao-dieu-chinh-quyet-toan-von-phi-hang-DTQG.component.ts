import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
// import { TRANGTHAIBAOCAO } from '../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';

@Component({
  selector: 'app-danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG',
  templateUrl: './danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG.component.html',
  styleUrls: ['./danh-sach-bao-cao-dieu-chinh-quyet-toan-von-phi-hang-DTQG.component.scss']
})
export class DanhSachBaoCaoDieuChinhQuyetToanVonPhiHangDTQGComponent implements OnInit {
  //thong tin dang nhap
  userInfo: any;
  //thong tin tim kiem
  searchFilter = {
    maBcao: null,
    maPhanBcao: '2',
    namQtoan: null,
    ngayTaoDen: null,
    ngayTaoTu: null,
    paggingReq: {
      limit: 10,
      page: 1
    },
    str: "",
    trangThai: "",
    trangThais: [
    ]
  };
  //danh muc
  danhSachBaoCao: any[] = [];
  trangThais: any[] = TRANG_THAI_TIM_KIEM;
  //phan trang
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  donViTao!: any;
  trangThai!:string;
  newDate = new Date();
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
    let userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info
    this.searchFilter.namQtoan = new Date().getFullYear()
    this.searchFilter.ngayTaoDen = new Date();
		this.newDate.setMonth(this.newDate.getMonth() -1);
		this.searchFilter.ngayTaoTu = this.newDate;
    this.donViTao = this.userInfo?.dvql;
    this.donViTao = this.userInfo?.dvql;
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
    if (this.searchFilter.namQtoan || this.searchFilter.namQtoan === 0) {
      if (this.searchFilter.namQtoan >= 3000 || this.searchFilter.namQtoan < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }
    this.spinner.show();
    let searchFilterTemp = Object.assign({},this.searchFilter);
    searchFilterTemp.trangThais= [];
    searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, 'dd/MM/yyyy') || searchFilterTemp.ngayTaoTu;
    searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, 'dd/MM/yyyy') || searchFilterTemp.ngayTaoDen;
    if(this.trangThai){
      searchFilterTemp.trangThais.push(this.trangThai)
    }else{
      searchFilterTemp.trangThais = [Utils.TT_BC_1,Utils.TT_BC_2,Utils.TT_BC_3,Utils.TT_BC_4,Utils.TT_BC_5,Utils.TT_BC_6,Utils.TT_BC_7,Utils.TT_BC_8,Utils.TT_BC_9]
    }
    await this.quanLyVonPhiService.timBaoCaoQuyetToanVonPhi(searchFilterTemp).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data.content;
          this.danhSachBaoCao.forEach(e => {
            e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, 'dd/MM/yyyy');
            e.ngayTao = this.datePipe.transform(e.ngayTao, 'dd/MM/yyyy');
            e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, 'dd/MM/yyyy');
            e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, 'dd/MM/yyyy');
            e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, 'dd/MM/yyyy');
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

  xoaDieuKien() {
    this.searchFilter.namQtoan = null
    this.searchFilter.ngayTaoDen = null
    this.searchFilter.ngayTaoTu = null
    this.searchFilter.maBcao = null
    this.searchFilter.trangThai = null
  }

  taoMoi() {
    this.router.navigate([
      '/quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg/quan-ly-thong-tin-quyet-toan/dieu-chinh-so-lieu-quyet-toan-/' + this.searchFilter.namQtoan ,
    ])
  }

  xemChiTiet(id: string) {
    this.router.navigate([
      '/quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg/quan-ly-thong-tin-quyet-toan/dieu-chinh-so-lieu-quyet-toan/' + id,
    ])
  }

  getStatusName(trangThai: string) {
    return this.trangThais.find(e => e.id == trangThai).tenDm;
  }

  xoaBaoCao(id: any) {
    this.quanLyVonPhiService.xoaBaoCaoLapQuyetToan1(id).toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
          this.onSubmit();
        } else {
          this.notification.error(MESSAGE.ERROR, data?.msg);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    )
  }

  checkDeleteReport(item: any): boolean {
    var check: boolean;
    if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8) &&
      this.userInfo?.username == item.nguoiTao) {
      check = true;
    } else {
      check = false;
    }
    return check;
  }
}
