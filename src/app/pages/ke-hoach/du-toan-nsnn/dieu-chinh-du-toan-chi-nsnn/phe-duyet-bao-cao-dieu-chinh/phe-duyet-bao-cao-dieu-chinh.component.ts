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
import { DCDT, ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { DIEU_CHINH_DU_TOAN, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../dieu-chinh-du-toan-chi-nsnn.constant';

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
    tenDm: 'Lãnh đạo duyệt'
  },
  {
    id: "7",
    tenDm: 'Mới'
  },
  {
    id: "8",
    tenDm: 'Từ chối'
  },
  {
    id: "9",
    tenDm: 'Tiếp nhận'
  },
  // {
  //     id: "10",
  //     tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
  // },
]

@Component({
  selector: 'app-phe-duyet-bao-cao-dieu-chinh',
  templateUrl: './phe-duyet-bao-cao-dieu-chinh.component.html',
  styleUrls: ['./phe-duyet-bao-cao-dieu-chinh.component.scss']
})
export class PheDuyetBaoCaoDieuChinhComponent implements OnInit {
  //thong tin dang nhap
  userInfo: any;
  //thong tin tim kiem
  searchFilter = {
    loaiTimKiem: '1',
    nam: null,
    tuNgay: null,
    denNgay: null,
    maBaoCao: "",
    donViTao: "",
    trangThai: "",
  };
  //danh muc
  danhSachBaoCao: any = [];
  trangThais: any[] = [];
  donVis: any[] = [];
  roles: string[] = [];
  //phan trang
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  //trang thai
  status: boolean;
  userRole: string;
  maDviTao: string;
  roleCanBo: string;
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
    private dataSource: DataService,
  ) {
  }

  async ngOnInit() {
    this.spinner.show();
    this.userInfo = this.userService.getUserLogin();
    this.maDviTao = this.userInfo.MA_DVI;
    this.roles = this.userInfo?.roles;

    this.searchFilter.denNgay = new Date();
    this.searchFilter.tuNgay = this.date;
    this.date.setMonth(this.date.getMonth() - 1);
    this.searchFilter.nam = new Date().getFullYear()

    //lay danh sach danh muc
    this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donVis = data?.data;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    // if (this.userRole == 'TC_KH_VP_NV' || this.userRole == 'C_KH_VP_NV_KH' || this.userRole == 'C_KH_VP_NV_TVQT' || this.userRole == 'CC_KH_VP_NV') {
    //   this.status = false;
    //   this.searchFilter.trangThai = Utils.TT_BC_7;
    //   this.searchFilter.loaiTimKiem = '1';
    //   this.donVis = this.donVis.filter(e => e?.parent?.maDvi == this.maDviTao);
    //   this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_7));
    //   this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_8));
    //   this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_9));
    // } else {
    //   this.status = true;
    //   this.searchFilter.loaiTimKiem = '0';
    //   this.searchFilter.donViTao = this.maDviTao;
    //   if (this.userRole == 'TC_KH_VP_TBP' || this.userRole == 'C_KH_VP_TBP_TVQT' || this.userRole == 'C_KH_VP_TBP_KH' || this.userRole == 'CC_KH_VP_TBP') {
    //     this.searchFilter.trangThai = Utils.TT_BC_2;
    //     this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_2));
    //   } else {
    //     this.searchFilter.trangThai = Utils.TT_BC_4;
    //     this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_4));
    //   }
    // }

    if (this.roles.includes(DCDT.TIEP_NHAN_REPORT)) {
      this.status = false;
      this.searchFilter.trangThai = Utils.TT_BC_7;
      this.searchFilter.loaiTimKiem = '1';
      //this.donVis = this.donVis.filter(e => e?.maDviCha == this.maDviTao);
      this.trangThais.push({
        id: Utils.TT_BC_7,
        tenDm: "Mới",
      });
      this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_8));
      this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_9));
    } else {
      this.status = true;
      this.searchFilter.loaiTimKiem = '0';
      this.searchFilter.donViTao = this.maDviTao;
      if (this.roles.includes(DCDT.DUYET_REPORT)) {
        this.searchFilter.trangThai = Utils.TT_BC_2;
        this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_2));
      } else {
        this.searchFilter.trangThai = Utils.TT_BC_4;
        this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_4));
      }
    }

    this.onSubmit();
    this.spinner.hide();
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
    if (!this.roles.includes(DCDT.TIEP_NHAN_REPORT)) {
      this.searchFilter.loaiTimKiem = "0";
    } else {
      if (this.searchFilter.donViTao && this.searchFilter.donViTao != this.maDviTao) {
        this.searchFilter.loaiTimKiem = "0";
      } else {
        this.searchFilter.loaiTimKiem = "1";
      }
    }
    let lstTrangThai = [];
    if (!this.searchFilter.trangThai) {
      if (this.roles.includes(DCDT.TIEP_NHAN_REPORT)) {
        lstTrangThai = [Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9];
      }
      else if (this.roles.includes(DCDT.DUYET_REPORT)) {
        lstTrangThai = [Utils.TT_BC_2];
      } else {
        lstTrangThai = [Utils.TT_BC_4];
      }
    } else {
      lstTrangThai = [this.searchFilter.trangThai];
    }
    const requestReport = {
      loaiTimKiem: this.searchFilter.loaiTimKiem,
      maBcao: this.searchFilter.maBaoCao,
      maDvi: this.searchFilter.donViTao,
      namBcao: this.searchFilter.nam,
      ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
      ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
      paggingReq: {
        limit: this.pages.size,
        page: this.pages.page,
      },
      trangThais: lstTrangThai,
    };
    this.spinner.show();
    await this.quanLyVonPhiService.timKiemDieuChinh(requestReport).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data?.content;
          this.danhSachBaoCao.forEach(e => {
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
    this.searchFilter.maBaoCao = null
    this.searchFilter.trangThai = null
    this.searchFilter.donViTao = null
  }

  xemChiTiet(id: string) {
    this.router.navigate([
      MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + DIEU_CHINH_DU_TOAN + '/giao-nhiem-vu/' + id,
    ])
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

  getStatusName(trangThai: string) {
    return this.trangThais.find(e => e.id == trangThai).tenDm;
  }

  getUnitName(maDvi: string) {
    return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
  }
}
