import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzResultUnauthorizedComponent } from 'ng-zorro-antd/result/partial/unauthorized';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { Utils, ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, ROLE_LANH_DAO } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';
// import { TRANGTHAIBAOCAO } from '../../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';
// trang thai ban ghi
// export const TRANG_THAI_TIM_KIEM = [
//   {
//       id: "2",
//       tenDm: 'Trình duyệt'
//   },
//   {
//       id: "4",
//       tenDm: 'Trưởng BP duyệt'
//   },
// ]
@Component({
  selector: 'app-duyet-phuong-an-tai-don-vi',
  templateUrl: './duyet-phuong-an-tai-don-vi.component.html',
  styleUrls: ['./duyet-phuong-an-tai-don-vi.component.scss']
})
export class DuyetPhuongAnTaiDonViComponent implements OnInit {
  //thong tin dang nhap
  userInfo: any;
  //thong tin tim kiem
  // searchFilter = {
  //   loaiTimKiem: "0",
  //   maPhanGiao: '2',
  //   maLoai: '2',
  //   namPa: null,
  //   ngayTaoTu: "",
  //   ngayTaoDen: "",
  //   donViTao: "",
  //   loai: null,
  //   trangThais: [],
  //   maPa: "",
  //   maLoaiDan: null,
  //   soQd: "",
  //   paggingReq: {
  //     limit: 10,
  //     page: 1
  //   },
  // };

  searchFilter = {
    loaiTimKiem: "0",
    maPhanGiao: '2',
    maLoai: '2',
    namPa: null,
    ngayTaoTu: "",
    ngayTaoDen: "",
    donViTao: "",
    loai: null,
    trangThais: [],
    maPa: "",
    maLoaiDan: null,
    soQd: "",
    trangThaiGiaos: [],
    paggingReq: {
      limit: 10,
      page: 1
    },
  };

  //danh muc
  danhSachBaoCao: any = [];
  loaiDuAns: any[] = [
    {
      id: '1',
      tenDm: 'Giao dự toán'
    },
    {
      id: '2',
      tenDm: 'Giao, diều chỉnh dự toán'
    }
  ];
  donViTaos: any[] = [];
  donVis: any[] = [];
  trangThais: any = [];
  trangThai!: string;
  //phan trang
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  date: any = new Date()
  roleUser: string;
  status: boolean;
  listIdDelete: any[] = [];
  userRole: string;

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
    const userName = this.userService.getUserName();
    this.spinner.show()
    await this.getUserInfo(userName); //get user info
    this.searchFilter.donViTao = this.userInfo?.dvql;
    this.searchFilter.ngayTaoDen = new Date().toISOString().slice(0, 16);
    this.date.setMonth(this.date.getMonth() - 1);
    this.searchFilter.ngayTaoTu = this.date.toISOString().slice(0, 16);
    this.searchFilter.namPa = new Date().getFullYear()
    this.userRole = this.userInfo?.roles[0].code;
    if (ROLE_TRUONG_BO_PHAN.includes(this.userInfo?.roles[0]?.code)) {
      this.status = false;
      this.trangThai = '2';
      this.trangThais.push({
        id: "2",
        tenDm: 'Trình duyệt'
      });
      this.roleUser = 'truongBoPhan';
    } else if (ROLE_LANH_DAO.includes(this.userInfo?.roles[0]?.code)) {
      this.status = false;
      this.trangThai = '4';
      this.trangThais.push({
        id: "4",
        tenDm: 'Trưởng BP duyệt'
      });
      this.roleUser = 'lanhDao';
    }
    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          this.donViTaos = this.donVis.filter(e => e?.maDviCha === this.userInfo?.dvql);
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    // this.onSubmit()@
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
    this.spinner.show();
    // const searchFilterTemp = Object.assign({}, this.searchFilter);
    // searchFilterTemp.trangThais = [];
    // searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, 'dd/MM/yyyy') || searchFilterTemp.ngayTaoTu;
    // searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, 'dd/MM/yyyy') || searchFilterTemp.ngayTaoDen;
    // if (this.trangThai) {
    //   searchFilterTemp.trangThais.push(this.trangThai)
    // } else {
    //   searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
    // }
    // await this.quanLyVonPhiService.timBaoCaoGiao(searchFilterTemp).toPromise().then(
    //   (data) => {
    //     if (data.statusCode == 0) {
    //       this.danhSachBaoCao = data.data.content;
    //       this.danhSachBaoCao.forEach(e => {
    //         e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, 'dd/MM/yyyy');
    //         e.ngayTao = this.datePipe.transform(e.ngayTao, 'dd/MM/yyyy');
    //         e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, 'dd/MM/yyyy');
    //         e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, 'dd/MM/yyyy');
    //         e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, 'dd/MM/yyyy');
    //       })
    //       this.totalElements = data.data.totalElements;
    //       this.totalPages = data.data.totalPages;
    //     } else {
    //       this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
    //     }
    //   },
    //   (err) => {
    //     this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    //   }
    // );
    const searchFilterTemp = Object.assign({}, this.searchFilter);
    searchFilterTemp.trangThais = [];
    searchFilterTemp.trangThaiGiaos = ["0", "1", "2"]
    searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, 'dd/MM/yyyy') || searchFilterTemp.ngayTaoTu;
    searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, 'dd/MM/yyyy') || searchFilterTemp.ngayTaoDen;
    if (this.trangThai) {
      searchFilterTemp.trangThais.push(this.trangThai)
    } else {
      searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
    }
    await this.quanLyVonPhiService.timBaoCaoGiao(searchFilterTemp).toPromise().then(
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

  async taoMoi() {
    if (!this.searchFilter.maLoaiDan) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (this.searchFilter.maLoaiDan == '1') {
      this.router.navigate([
        'qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi',
      ]);
    }
    else if (this.searchFilter.maLoaiDan == '2') {
      this.router.navigate([
        'qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi',
      ]);
    }
  }

  xemChiTiet(id: string, maLoaiDan: string) {
    if (maLoaiDan == "1") {
      this.router.navigate([
        '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/' + id,
      ])
    } else if (maLoaiDan == "2") {
      this.router.navigate([
        '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/' + id,
      ])
    } else {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
    }
  }
  getStatusName(trangThai: string) {
    return this.trangThais.find(e => e.id == trangThai)?.tenDm;
  }

  getUnitName(maDvi: string) {
    return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
  }

  async xoaQuyetDinh(id: any) {
    this.spinner.show();
    await this.quanLyVonPhiService.xoaBanGhiGiaoBTC([id]).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
          this.onSubmit()
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
  xoaDieuKien() {
    this.searchFilter.namPa = null;
    this.searchFilter.ngayTaoDen = null;
    this.searchFilter.ngayTaoTu = null;
    this.searchFilter.maPa = null;
    // this.searchFilter.maLoaiDan = null;
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
    this.danhSachBaoCao.forEach(item => {
      if (item.checked) {
        check = false;
      }
    })
    return check;
  }

  updateAllCheck() {
    this.danhSachBaoCao.forEach(item => {
      if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8)
        && ROLE_CAN_BO.includes(this.userRole)) {
        item.checked = true;
        this.listIdDelete.push(item.id);
      }
    })
  }

  checkDeleteReport(item: any): boolean {
    let check: boolean;
    if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8) &&
      ROLE_CAN_BO.includes(this.userRole)) {
      check = true;
    } else {
      check = false;
    }
    return check;
  }
}
