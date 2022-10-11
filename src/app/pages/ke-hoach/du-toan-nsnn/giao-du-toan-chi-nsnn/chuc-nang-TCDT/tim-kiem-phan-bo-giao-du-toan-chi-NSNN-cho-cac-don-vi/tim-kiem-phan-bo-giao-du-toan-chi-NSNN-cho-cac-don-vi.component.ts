import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { GDT, ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { GIAO_DU_TOAN, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../giao-du-toan-chi-nsnn.constant';
// import { TRANGTHAIBAOCAO } from '../../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';
// trang thai ban ghi
export const TRANG_THAI_TIM_KIEM = [
  {
    id: "1",
    tenDm: 'Đang soạn'
  },
  {
    id: "2",
    tenDm: 'Trình duyệt'
  },
  {
    id: "3",
    tenDm: 'Trưởng BP từ chối'
  },
  {
    id: "4",
    tenDm: 'Trưởng BP duyệt'
  },
  {
    id: "5",
    tenDm: 'Lãnh đạo từ chối'
  },
  {
    id: "6",
    tenDm: 'Lãnh đạo phê duyệt'
  },
  {
    id: "7",
    tenDm: 'Gửi đơn vị cấp trên'
  },
  // {
  //   id: "8",
  //   tenDm: 'Đơn vị cấp trên từ chối'
  // },
  // {
  //   id: "9",
  //   tenDm: 'Đơn vị cấp trên tiếp nhận'
  // },
  // {
  //     id: "10",
  //     tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
  // },
]
@Component({
  selector: 'app-tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi',
  templateUrl: './tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi.component.html',
  styleUrls: ['./tim-kiem-phan-bo-giao-du-toan-chi-NSNN-cho-cac-don-vi.component.scss']
})
export class TimKiemPhanBoGiaoDuToanChiNSNNChoCacDonViComponent implements OnInit {
  //thong tin dang nhap
  userInfo: any;
  //thong tin tim kiem
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
  trangThaiGiaos: any[] = [
    {
      id: '0',
      tenDm: 'Chưa giao'
    },
    {
      id: '2',
      tenDm: 'Đang giao'
    },
    {
      id: '1',
      tenDm: 'Đã giao hết'
    }
  ];
  donViTaos: any[] = [];
  donVis: any[] = [];
  trangThais: any = TRANG_THAI_TIM_KIEM;
  trangThai!: string;
  trangThaiGiao!: string;
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
  statusCreate = true;
  statusTaoMoi = true;
  constructor(
    private quanLyVonPhiService: QuanLyVonPhiService,
    private danhMuc: DanhMucHDVService,
    private router: Router,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private dataSource: DataService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show()
    this.userInfo = this.userService.getUserLogin();
    this.searchFilter.donViTao = this.userInfo?.MA_DVI;
    this.searchFilter.ngayTaoDen = new Date().toISOString().slice(0, 16);
    this.date.setMonth(this.date.getMonth() - 1);
    this.searchFilter.ngayTaoTu = this.date.toISOString().slice(0, 16);
    this.searchFilter.namPa = new Date().getFullYear()
    if (this.userService.isAccessPermisson(GDT.ADD_REPORT_CV_QD_GIAO_PA_PBDT)) {
      this.statusTaoMoi = false;
    }
    if (this.userService.isAccessPermisson(GDT.ADD_REPORT_CV_QD_GIAO_PA_PBDT)) {
      this.status = true;
      this.trangThai = '1';
      this.roleUser = 'canbo';
    } else if (this.userService.isAccessPermisson(GDT.DUYET_REPORT_PA_PBDT)) {
      this.status = false;
      this.trangThai = '2';
      this.roleUser = 'truongBoPhan';
    } else if (this.userService.isAccessPermisson(GDT.PHE_DUYET_REPORT_PA_PBDT)) {
      this.status = false;
      this.trangThai = '4';
      this.roleUser = 'lanhDao';
    }
    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          this.donViTaos = this.donVis.filter(e => e?.maDviCha === this.userInfo?.MA_DVI);
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
    this.onSubmit()
    this.spinner.hide()
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
    this.statusCreate = true;
    if (this.searchFilter.namPa || this.searchFilter.namPa === 0) {
      if (this.searchFilter.namPa >= 3000 || this.searchFilter.namPa < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }
    this.spinner.show();
    const searchFilterTemp = Object.assign({}, this.searchFilter);
    searchFilterTemp.trangThais = [];
    searchFilterTemp.trangThaiGiaos = [];
    searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoTu;
    searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoDen;
    if (this.trangThai) {
      searchFilterTemp.trangThais.push(this.trangThai)
    } else {
      searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
    }
    if (this.trangThaiGiao) {
      searchFilterTemp.trangThaiGiaos.push(this.trangThaiGiao)
    } else {
      searchFilterTemp.trangThaiGiaos = ['0', '1', '2']
    }
    await this.quanLyVonPhiService.timBaoCaoGiao(searchFilterTemp).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data.content;
          this.danhSachBaoCao.forEach(e => {
            e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
            e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
            e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
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
    this.searchFilter.paggingReq.page = page;
    this.onSubmit();
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.searchFilter.paggingReq.limit = size;
    this.onSubmit();
  }

  async taoMoi() {
    this.statusCreate = false;
    if (!this.searchFilter.maLoaiDan) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    }
    if (this.searchFilter.maLoaiDan == '1') {
      this.router.navigate([
        MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/nhap-thong-tin-quyet-toan-giao-du-toan-chi-NSNN-cho-cac-don-vi',
      ]);
    }
    else if (this.searchFilter.maLoaiDan == '2') {
      this.router.navigate([
        MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/nhap-thong-tin-qd-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi',
      ]);
    }
  }

  xemChiTiet(id: string, maLoaiDan: string) {
    if (maLoaiDan == "1") {
      this.router.navigate([
        MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/' + id,
      ])
    } else if (maLoaiDan == "2") {
      this.router.navigate([
        MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/' + id,
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
    this.searchFilter.maLoaiDan = null;
    this.trangThai = null;
    this.trangThaiGiao = null;
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
      if (this.checkDeleteReport(item.trangThai)) {
        item.checked = true;
        this.listIdDelete.push(item.id);
      }
    })
  }
  checkViewReport() {
    return this.userService.isAccessPermisson(GDT.VIEW_REPORT_PA_PBDT);
  }

  checkDeleteReport(trangThai: string) {
    return Utils.statusDelete.includes(trangThai) && this.userService.isAccessPermisson(GDT.DELETE_REPORT_PA_PBDT);
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
