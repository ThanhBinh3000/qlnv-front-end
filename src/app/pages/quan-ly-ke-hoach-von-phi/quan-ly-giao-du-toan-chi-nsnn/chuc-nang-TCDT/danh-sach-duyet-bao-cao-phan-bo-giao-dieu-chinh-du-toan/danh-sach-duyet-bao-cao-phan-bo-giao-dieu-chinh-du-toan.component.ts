import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { LOAI_BAO_CAO, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';
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
    ngayTaoTu: "",
    ngayTaoDen: "",
    maPa: "",
    donViTao: "",
    trangThai: "",
    paggingReq: {
      limit: 10,
      page: 1
    },
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
    this.maDviTao = this.userInfo?.dvql;
    this.userRole = this.userInfo?.roles[0].code;
    this.searchFilter.ngayTaoDen = new Date().toISOString().slice(0, 16);
    this.date.setMonth(this.date.getMonth() - 1);
    this.searchFilter.ngayTaoTu = this.date.toISOString().slice(0, 16);
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
    if (this.userRole == Utils.NHAN_VIEN) {
      this.status = false;
      this.searchFilter.trangThai = Utils.TT_BC_7;
      this.searchFilter.loaiTimKiem = '1';
      this.donVis = this.donVis.filter(e => e?.parent?.maDvi == this.maDviTao);
      this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_7));
      this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_8));
      this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_9));
      this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_KT));
    } else {
      this.status = true;
      this.searchFilter.loaiTimKiem = '0';
      this.searchFilter.donViTao = this.maDviTao;
      if (this.userRole == Utils.TRUONG_BO_PHAN) {
        this.searchFilter.trangThai = Utils.TT_BC_2;
        this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_2));
      } else {
        this.searchFilter.trangThai = Utils.TT_BC_4;
        this.trangThais.push(TRANG_THAI_TIM_KIEM_GIAO.find(e => e.id == Utils.TT_BC_4));
      }
    }
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
    if (this.userRole != Utils.NHAN_VIEN) {
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
      if (this.userInfo?.roles[0].code == Utils.NHAN_VIEN) {
        lstTrangThai = [Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9, Utils.TT_BC_KT];
      } else if (this.userInfo?.roles[0].code == Utils.NHAN_VIEN) {
        lstTrangThai = [Utils.TT_BC_2];
      } else {
        lstTrangThai = [Utils.TT_BC_4];
      }
    } else {
      lstTrangThai = [this.searchFilter.trangThai];
    }
    let requestReport = {
      loaiTimKiem: this.searchFilter.loaiTimKiem,
      maBcao: this.searchFilter.maPa,
      maDvi: this.searchFilter.donViTao,
      namBcao: this.searchFilter.namPa,
      ngayTaoDen: this.datePipe.transform(this.searchFilter.ngayTaoDen, Utils.FORMAT_DATE_STR),
      ngayTaoTu: this.datePipe.transform(this.searchFilter.ngayTaoTu, Utils.FORMAT_DATE_STR),
      paggingReq: {
        limit: this.pages.size,
        page: this.pages.page,
      },
      trangThais: lstTrangThai,
      maPhanGiao: '2',
      maLoai: '2',
    };
    this.spinner.show();
    //let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
    await this.quanLyVonPhiService.timBaoCaoGiao1(requestReport).toPromise().then(
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
    this.searchFilter.trangThai = null
  }

  xemChiTiet(id: string, maLoaiDan: string) {
    if(maLoaiDan == "1"){
      this.router.navigate([
          '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/xay-dung-phuong-an-giao-du-toan-chi-NSNN-cho-cac-don-vi/' + id ,
      ])
    }else if(maLoaiDan == "2"){
      this.router.navigate([
          '/qlkh-von-phi/quan-ly-giao-du-toan-chi-nsnn/xay-dung-phuong-an-giao-dieu-chinh-du-toan-chi-NSNN-cho-cac-don-vi/' + id ,
      ])
    }else{
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
    }
  }

  getStatusName(trangThai: string) {
    return this.trangThais.find(e => e.id == trangThai).tenDm;
  }

  getUnitName(maDvi: string) {
    return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
  }
}
