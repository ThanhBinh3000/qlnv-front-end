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
import { ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { GIAO_DU_TOAN, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../giao-du-toan-chi-nsnn.constant';
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
    namDtoan: null,
    ngayGiaoTu: "",
    ngayGiaoDen: "",
    maDvi: "",
    maLoaiDan: null,
    maDviNhan: "",
    maPa: "",
    trangThais: [],
    paggingReq: {
      limit: 10,
      page: 1
    },
    trangThaiGiaos: [],
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
  roleUser: string;
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
    const userName = this.userService.getUserName();
    this.spinner.show()
    await this.getUserInfo(userName); //get user info
    this.searchFilter.maDvi = this.userInfo?.dvql;
    this.searchFilter.ngayGiaoDen = new Date().toISOString().slice(0, 16);
    this.date.setMonth(this.date.getMonth() - 1);
    this.searchFilter.ngayGiaoTu = this.date.toISOString().slice(0, 16);
    this.searchFilter.namDtoan = new Date().getFullYear()
    if (ROLE_CAN_BO.includes(this.userInfo?.roles[0]?.code)) {
      this.trangThai = '1';
      this.roleUser = 'canbo';
    } else if (ROLE_TRUONG_BO_PHAN.includes(this.userInfo?.roles[0]?.code)) {
      this.trangThai = '1';
      this.roleUser = 'truongBoPhan';
    } else if (ROLE_LANH_DAO.includes(this.userInfo?.roles[0]?.code)) {
      this.trangThai = '1';
      this.roleUser = 'lanhDao';
    }
    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
          this.donVis = this.donVis.filter(e => e?.maDviCha == this.userInfo?.dvql);
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
    if (this.searchFilter.namDtoan || this.searchFilter.namDtoan === 0) {
      if (this.searchFilter.namDtoan >= 3000 || this.searchFilter.namDtoan < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }
    const searchFilterTemp = Object.assign({}, this.searchFilter);
    searchFilterTemp.trangThais = [];
    searchFilterTemp.ngayGiaoTu = this.datePipe.transform(searchFilterTemp.ngayGiaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayGiaoTu;
    searchFilterTemp.ngayGiaoDen = this.datePipe.transform(searchFilterTemp.ngayGiaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayGiaoDen;
    if (this.trangThai) {
      searchFilterTemp.trangThais.push(this.trangThai)
    } else {
      searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
    }
    searchFilterTemp.maDviNhan = this.searchFilter.maDviNhan;
    searchFilterTemp.trangThaiGiaos = ['0', '1', '2']
    this.spinner.show();
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
            e.dViNhan = this.donVis.filter(s => s?.maDvi == e.maDviNhan).map(x => x.tenDvi);
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
      MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + GIAO_DU_TOAN + '/giao-du-toan-chi-NSNN-cho-cac-don-vi/' + id,
    ])
  }

  getStatusName(trangThai: any) {
    return this.trangThais.find(e => e.id == trangThai)?.tenDm;
  }

  getUnitName(maDvi: string) {
    return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
  }
  xoaDieuKien() {
    this.searchFilter.namDtoan = null;
    this.searchFilter.ngayGiaoDen = null;
    this.searchFilter.ngayGiaoTu = null;
    this.searchFilter.maPa = null;
    this.searchFilter.maDviNhan = null;
    this.trangThai = null
    this.searchFilter.maLoaiDan = null;
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
