import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { TRANG_THAI_GIAO, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';
import { MAIN_ROUTE_QUY_BAO_CAO_KET_QUA_THUC_HIEN_VON_PHI_HANG_DTQG_TAI_TONG_CUC_DTNN } from '../../../quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc/quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.constant';
export const TRANG_THAI_GIAO_DU_TOAN = [
  {
    id: '0',
    tenDm: "Chưa giao",
  },
  {
    id: '1',
    tenDm: "Đã giao",
  },
  {
    id: '2',
    tenDm: "Đã nhận",
  },
]
@Component({
  selector: 'app-tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi',
  templateUrl: './tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi.component.html',
  styleUrls: ['./tim-kiem-giao-du-toan-chi-NSNN-cua-cac-don-vi.component.scss']
})
export class TimKiemGiaoDuToanChiNSNNCuaCacDonViComponent implements OnInit {
  //thong tin nguoi dang nhap
  userInfo: any;
  //thong tin tim kiem
  searchFilter = {
    maPhanGiao: '2',
    maLoai: '1',
    loaiTimKiem: '0',
    namGiao: null,
    ngayTaoTu: "",
    ngayTaoDen: "",
    maDviTao: "",
    loaiDuAn: null,
    maDviNhan: "",
    maPa: "",
    trangThais: [],
    paggingReq: {
      limit: 10,
      page: 1
    },
  };
  //danh muc
  danhSachBaoCao: any = [];
  donVis: any[] = [];
  trangThais: any[] = TRANG_THAI_GIAO_DU_TOAN;
  trangThai!: string;
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
  //phan trang
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  date: any = new Date()
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
    this.searchFilter.maDviTao = this.userInfo?.dvql;
    this.searchFilter.ngayTaoDen = new Date().toISOString().slice(0, 16);
    this.date.setMonth(this.date.getMonth() - 1);
    this.searchFilter.ngayTaoTu = this.date.toISOString().slice(0, 16);
    this.searchFilter.namGiao = new Date().getFullYear()
    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          this.donVis = this.donVis.filter(e => e?.parent?.maDvi == this.userInfo?.dvql);
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );
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
    if (this.searchFilter.namGiao || this.searchFilter.namGiao === 0) {
      if (this.searchFilter.namGiao >= 3000 || this.searchFilter.namGiao < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }
    let searchFilterTemp = Object.assign({}, this.searchFilter);
    searchFilterTemp.trangThais = [];
    searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, 'dd/MM/yyyy') || searchFilterTemp.ngayTaoTu;
    searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, 'dd/MM/yyyy') || searchFilterTemp.ngayTaoDen;
    if (this.trangThai) {
      searchFilterTemp.trangThais.push(this.trangThai)
    } else {
      searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
    }
    this.spinner.show();
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

  xemChiTiet(id: string) {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/giao-du-toan-chi-NSNN-cho-cac-don-vi/' + id,
    ])
  }

  getStatusName(trangThai: any) {
    return this.trangThais.find(e => e.id == trangThai)?.tenDm;
  }

  getUnitName(maDvi: string) {
    return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
  }
}
