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
import { Utils, DCDT } from 'src/app/Utility/utils';
import { MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH, DIEU_CHINH_DU_TOAN } from '../dieu-chinh-du-toan-chi-nsnn.constant';

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
    tuNgay: null,
    denNgay: null,
    maBcao: "",
    donViTao: "",
    trangThai: Utils.TT_BC_1,
  };
  newDate = new Date();
  listIdDelete: string[] = [];
  roles: string[] = [];
  //danh muc
  danhSachDieuChinh: any[] = [];
  trangThais: any[] = [
    {
      id: Utils.TT_BC_1,
      tenDm: "Đang soạn",
    },
    {
      id: Utils.TT_BC_2,
      tenDm: "Trình duyệt",
    },
    {
      id: Utils.TT_BC_3,
      tenDm: "Trưởng BP từ chối",
    },
    {
      id: Utils.TT_BC_4,
      tenDm: "Trưởng BP duyệt",
    },
    {
      id: Utils.TT_BC_5,
      tenDm: "Lãnh đạo từ chối",
    },
    {
      id: Utils.TT_BC_7,
      tenDm: "Lãnh đạo phê duyệt",
    },
    {
      id: Utils.TT_BC_8,
      tenDm: "Đơn vị cấp trên từ chối",
    },
    {
      id: Utils.TT_BC_9,
      tenDm: "Đơn vị cấp trên tiếp nhận",
    },
  ];
  //phan trang
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  statusBtnValidate = true;
  statusTaoMoi = true;
  loai = '0';
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
    this.searchFilter.denNgay = new Date();
    const newDate = new Date();
    newDate.setMonth(newDate.getMonth() - 1);
    this.searchFilter.tuNgay = newDate;

    this.userInfo = this.userService.getUserLogin();
    this.roles = this.userInfo.roles;

    if (this.roles.includes(DCDT.ADD_REPORT)) {
      this.statusTaoMoi = false;
    }

    this.searchFilter.donViTao = this.userInfo?.MA_DVI;
    this.onSubmit();
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
    let trangThais = ['1', '2', '3', '4', '5', '7', '8', '9'];
    if (this.searchFilter.trangThai) {
      trangThais = [this.searchFilter.trangThai];
    }
    const requestReport = {
      loaiTimKiem: "0",
      maBcao: this.searchFilter.maBcao,
      maDvi: this.searchFilter.donViTao,
      namBcao: this.searchFilter.nam,
      ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
      ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
      paggingReq: {
        limit: this.pages.size,
        page: this.pages.page,
      },
      trangThais: trangThais,
    };
    this.spinner.show();
    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    await this.quanLyVonPhiService.timKiemDieuChinh(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachDieuChinh = [];
          data.data.content.forEach(item => {
            if (this.listIdDelete.findIndex(e => e == item.id) == -1) {
              this.danhSachDieuChinh.push({
                ...item,
                checked: false,
              })
            } else {
              this.danhSachDieuChinh.push({
                ...item,
                checked: true,
              })
            }
          })
          this.danhSachDieuChinh.forEach(e => {
            e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
            e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
            e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
            e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
            e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, Utils.FORMAT_DATE_STR);
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
  xoaDieuKien() {
    this.searchFilter.nam = null
    this.searchFilter.tuNgay = null
    this.searchFilter.denNgay = null
    this.searchFilter.maBcao = null
    this.searchFilter.trangThai = null
  }

  taoMoi() {
    if (this.searchFilter.nam || this.searchFilter.nam === 0) {
      if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }
    const obj = {
      namHienTai: new Date().getFullYear() + 1,
    }
    if (this.searchFilter.nam) {
      obj.namHienTai = this.searchFilter.nam;
    }
    this.dataSource.changeData(obj);
    this.router.navigate([
      MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + DIEU_CHINH_DU_TOAN + '/giao-nhiem-vu/0/' + this.searchFilter.nam,
    ]);
  }

  xemChiTiet(id: string) {
    this.router.navigate([
      MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + DIEU_CHINH_DU_TOAN + '/chi-tiet-giao-nhiem-vu/' + this.loai + '/' + id,
    ])
  }

  getStatusName(trangThai: string) {
    return this.trangThais.find(e => e.id == trangThai).tenDm;
  }

  xoaBaoCao(id: string) {
    let request = [];
    if (!id) {
      request = this.listIdDelete;
    } else {
      request = [id];
    }
    this.spinner.show();
    this.quanLyVonPhiService.xoaDuToanDieuChinh(request).toPromise().then(
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
    this.spinner.hide();
  }

  checkViewReport() {
    return this.roles.includes(DCDT.VIEW_REPORT);
  }

  checkEditReport(trangThai: string) {
    return Utils.statusSave.includes(trangThai) && this.roles.includes(DCDT.EDIT_REPORT);
  }

  checkDeleteReport(trangThai: string) {
    return Utils.statusDelete.includes(trangThai) && this.roles.includes(DCDT.DELETE_REPORT);
  }

  changeListIdDelete(id: string) {
    if (this.listIdDelete.findIndex(e => e == id) == -1) {
      this.listIdDelete.push(id);
    } else {
      this.listIdDelete = this.listIdDelete.filter(e => e != id);
    }
  }

  async xoaDuToanDieuChinh(id: string) {
    this.spinner.show()
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
    );
    this.spinner.hide()
  }

  checkAll() {
    let check = true;
    this.danhSachDieuChinh.forEach(item => {
      if (item.checked) {
        check = false;
      }
    })
    return check;
  }

  updateAllCheck() {
    this.danhSachDieuChinh.forEach(item => {
      if (this.checkDeleteReport(item)) {
        item.checked = true;
        this.listIdDelete.push(item.id);
      }
    })
  }

  close() {
    const obj = {
      tabSelected: 'dieuchinhdutoan',
    }
    this.dataSource.changeData(obj);
    this.router.navigate([
      MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN,
    ])
  }
}

