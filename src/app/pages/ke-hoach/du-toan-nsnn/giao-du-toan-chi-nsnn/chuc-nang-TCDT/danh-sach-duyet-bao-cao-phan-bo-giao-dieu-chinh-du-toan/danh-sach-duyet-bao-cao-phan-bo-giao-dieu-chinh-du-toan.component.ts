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
import { GDT, ROLE_CAN_BO, Utils } from 'src/app/Utility/utils';
import { GIAO_DU_TOAN, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../../giao-du-toan-chi-nsnn.constant';
// import { TRANGTHAIBAOCAO } from '../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';

export const TRANG_THAI_TIM_KIEM_GIAO = [
  {
    id: "7",
    tenDm: "Mới",
  },
  {
    id: "9",
    tenDm: "Tiếp nhận",
  },
  {
    id: "8",
    tenDm: "Từ chối",
  },
  {
    id: "-1",
    tenDm: "Chưa có"
  }

]

@Component({
  selector: 'app-danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan',
  templateUrl: './danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan.component.html',
  styleUrls: ['./danh-sach-duyet-bao-cao-phan-bo-giao-dieu-chinh-du-toan.component.scss']
})
export class DanhSachDuyetBaoCaoPhanBoGiaoDieuChinhDuToanComponent implements OnInit {
  //thong tin dang nhap
  userInfo: any;
  //thong tin tim kiem
  userRole: string;
  maDviTao: string;
  searchFilter = {
    loaiTimKiem: "1",
    maPhanGiao: '2',
    maLoai: '2',
    namPa: null,
    ngayTaoTu: null,
    ngayTaoDen: null,
    maPa: "",
    donViTao: "",
    // trangThai: "",
    paggingReq: {
      limit: 10,
      page: 1
    },
    trangThais: [],
    trangThaiGiaos: [],
  };
  //danh muc
  danhSachBaoCao: any = [];
  trangThais: any[] = [];
  donVis: any[] = [];
  //phan trang
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  //trang thai
  status: boolean;
  date: any = new Date()
  trangThai!: string;
  roleUser: string;
  newDate = new Date();
  isCanbotc: boolean;
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
    this.maDviTao = this.userInfo?.MA_DVI;
    if (this.userService.isAccessPermisson(GDT.TIEPNHAN_TUCHOI_PA_PBDT)) {
      this.isCanbotc = true;
    }

    this.searchFilter.ngayTaoDen = new Date();
    this.newDate.setMonth(this.newDate.getMonth() - 1);
    this.searchFilter.ngayTaoTu = this.newDate;
    this.searchFilter.namPa = new Date().getFullYear()

    //lay danh sach danh muc
    await this.danhMuc.dMDonVi().toPromise().then(
      data => {
        if (data.statusCode == 0) {
          this.donVis = data.data;
        } else {
          this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
        }
      },
      err => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      }
    );

    if (this.userService.isAccessPermisson(GDT.TIEPNHAN_TUCHOI_PA_PBDT) || this.userService.isAccessPermisson(GDT.XEM_PA_TONGHOP_PBDT)) {
      this.trangThai = '7';
      this.status = false;
      // this.trangThais.push({
      //   id: Utils.TT_BC_7,
      //   tenDm: "Mới",
      // });
      this.searchFilter.loaiTimKiem = '1';
      this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_7));
      this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_8));
      this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_9));
      this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_KT));
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
    if (this.searchFilter.namPa || this.searchFilter.namPa === 0) {
      if (this.searchFilter.namPa >= 3000 || this.searchFilter.namPa < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }
    const searchFilterTemp = Object.assign({}, this.searchFilter);
    searchFilterTemp.trangThais = [];
    searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoTu;
    searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoDen;
    this.spinner.show();
    if (this.trangThai) {
      searchFilterTemp.trangThais.push(this.trangThai)
    } else {
      searchFilterTemp.trangThais = [Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9, Utils.TT_BC_KT]
    }
    searchFilterTemp.trangThaiGiaos = ['0', '1', '2']



    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    await this.quanLyVonPhiService.timBaoCaoGiao(searchFilterTemp).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachBaoCao = data.data.content;
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
    this.searchFilter.paggingReq.page = page;
    this.onSubmit();
  }

  //doi so luong phan tu tren 1 trang
  onPageSizeChange(size) {
    this.searchFilter.paggingReq.limit = size;
    this.onSubmit();
  }
  xoaDieuKien() {
    this.searchFilter.namPa = null
    this.searchFilter.ngayTaoTu = null
    this.searchFilter.ngayTaoDen = null
    this.searchFilter.maPa = null
    this.trangThai = null
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
    return this.trangThais.find(e => e.id == trangThai).tenDm;
  }

  getUnitName(maDvi: string) {
    return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
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
