import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { GDT, ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { GIAO_DU_TOAN, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../giao-du-toan-chi-nsnn.constant';
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
    maPhanGiao: '1',
    maLoai: '2',
    namPa: null,
    ngayTaoTu: null,
    ngayTaoDen: null,
    maPa: "",
    trangThais: ["1"],
    trangThaiGiaos: [],
    paggingReq: {
      limit: 10,
      page: 1
    },
  };
  //danh muc
  danhSachQuyetDinh: any = [];
  listIdDelete: any = [];
  //phan trang
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  date: any = new Date()
  userRole: string;
  status: boolean;
  statusTaoMoi = true;
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private dataSource: DataService,
  ) {
  }

  async ngOnInit() {

    this.spinner.show()
    this.userInfo = this.userService.getUserLogin();

    this.searchFilter.ngayTaoDen = new Date();
    this.date.setMonth(this.date.getMonth() - 1);
    this.searchFilter.ngayTaoTu = new Date();
    this.searchFilter.namPa = new Date().getFullYear()

    if (this.userService.isAccessPermisson(GDT.ADD_REPORT_BTC)) {
      this.statusTaoMoi = false;
    }

    // if (ROLE_LANH_DAO.includes(this.userInfo?.roles[0]?.code) ||
    //   ROLE_TRUONG_BO_PHAN.includes(this.userInfo?.roles[0]?.code)) {
    //   this.status = true;
    // } else {
    //   this.status = false;
    // }
    // this.userRole = this.userInfo?.roles[0].code;
    this.onSubmit()
    this.spinner.hide()
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
    if (this.searchFilter.namPa || this.searchFilter.namPa === 0) {
      if (this.searchFilter.namPa >= 3000 || this.searchFilter.namPa < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }
    const searchFilterTemp = Object.assign({}, this.searchFilter);
    searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoTu;
    searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoDen;
    searchFilterTemp.trangThaiGiaos = ['0', '1', '2']
    this.spinner.show();
    await this.quanLyVonPhiService.timBaoCaoGiao(searchFilterTemp).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachQuyetDinh = data.data?.content;
          this.danhSachQuyetDinh.forEach(e => {
            e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
          })
          this.totalElements = data.data?.totalElements;
          this.totalPages = data.data?.totalPages;

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

  async taoMoi() {
    const request = {
      namPa: this.searchFilter.namPa
    }
    this.dataSource.changeData(request),

      this.router.navigate([
        MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC',
      ]);
  }

  xemChiTiet(id: string) {
    this.router.navigate([
      MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/nhap-quyet-dinh-giao-du-toan-chi-NSNN-BTC/' + id,
    ])
  }

  async xoaQuyetDinh(id: any) {
    this.spinner.show();
    await this.quanLyVonPhiService.xoaBanGhiGiaoBTC([id]).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
          this.onSubmit()
        } else {
          this.notification.error(MESSAGE.WARNING, data?.msg);
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.spinner.hide();
  }
  xoaDieuKien() {
    this.searchFilter.namPa = null
    this.searchFilter.ngayTaoDen = null
    this.searchFilter.ngayTaoTu = null
    this.searchFilter.maPa = null
  }

  xoaBaoCao(id: string) {
    let request = [];
    if (!id) {
      request = this.listIdDelete;
    } else {
      request = [id];
    }
    this.quanLyVonPhiService.xoaBanGhiGiaoBTC(request).toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.listIdDelete = [];
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


  changeListIdDelete(id: any) {
    if (this.listIdDelete.findIndex(e => e == id) == -1) {
      this.listIdDelete.push(id);
    } else {
      this.listIdDelete = this.listIdDelete.filter(e => e != id);
    }
  }

  checkAll() {
    let check = true;
    this.danhSachQuyetDinh.forEach(item => {
      if (item.checked) {
        check = false;
      }
    })
    return check;
  }

  updateAllCheck() {
    this.danhSachQuyetDinh.forEach(item => {
      if (this.checkDeleteReport(item.trangThai)) {
        item.checked = true;
        this.listIdDelete.push(item.id);
      }
    })
  }

  checkDeleteReport(trangThai: string) {
    return Utils.statusDelete.includes(trangThai) && this.userService.isAccessPermisson(GDT.DELETE_REPORT_BTC);
  }

  checkViewReport() {
    return this.userService.isAccessPermisson(GDT.VIEW_REPORT_PA_PBDT);
  }

  close() {
    const obj = {
      tabSelected: 'giaodutoan',
    }
    this.dataSource.changeData(obj);
    this.router.navigate([
      MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN,
    ]);
  }
}
