import { ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, ROLE_LANH_DAO, QTVP } from './../../../../Utility/utils';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { MAIN_ROUTE_QUYET_TOAN, QUAN_LY_QUYET_TOAN } from '../../quan-ly-thong-tin-quyet-toan-von-phi-hang-dtqg.constant';
// import { TRANGTHAIBAOCAO } from '../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';
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
    id: "8",
    tenDm: 'Đơn vị cấp trên từ chối'
  },
  {
    id: "9",
    tenDm: 'Đơn vị cấp trên tiếp nhận'
  },
  // {
  //     id: "10",
  //     tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
  // },
]
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
    thongBao: null,
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
  trangThai!: string;
  newDate = new Date();
  userRole: string;
  status = true;

  donVis: any[] = [];
  listIdDelete: string[] = [];
  statusBtnValidate = true;
  roles: string[] = [];
  statusTaoMoi = true;
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
    this.spinner.show()
    this.userInfo = this.userService.getUserLogin();
    this.roles = this.userInfo?.roles;
    this.searchFilter.namQtoan = new Date().getFullYear() - 1
    this.searchFilter.ngayTaoDen = new Date();
    this.newDate.setMonth(this.newDate.getMonth() - 1);
    this.searchFilter.ngayTaoTu = this.newDate;
    this.donViTao = this.userInfo?.MA_DVI;
    //  check va lay gia tri role trong list role
    if(this.roles.includes(QTVP.DIEU_CHINH_REPORT)){
      this.statusTaoMoi = false;
    }
    if (this.roles.includes(QTVP.EDIT_DIEU_CHINH_REPORT)) {
      this.status = false;
      this.trangThai = Utils.TT_BC_1;
      this.donVis = this.donVis.filter(e => e?.maDviCha == this.donViTao);
      this.searchFilter.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_1));
    }
    else {
      if (this.roles.includes(QTVP.DUYET_QUYET_TOAN_REPORT)) {
        this.status = true;
        this.trangThai = Utils.TT_BC_2;
        this.searchFilter.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_2));
      } else if (this.roles.includes(QTVP.PHE_DUYET_QUYET_TOAN_REPORT)) {
        this.status = true;
        this.trangThai = Utils.TT_BC_4;
        this.searchFilter.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_4));
      } else {
        this.trangThai = null;
        this.searchFilter.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6];
      }
    }
    this.onSubmit();
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
    this.statusBtnValidate = true;
    if (
      (this.searchFilter.ngayTaoTu && this.searchFilter.ngayTaoDen)
    ) {
      if (this.searchFilter.ngayTaoTu > this.searchFilter.ngayTaoDen) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_DAY);
        return;
      }
    }
    this.spinner.show();
    const searchFilterTemp = Object.assign({}, this.searchFilter);
    searchFilterTemp.trangThais = [];
    searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoTu;
    searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoDen;
    if (this.trangThai) {
      searchFilterTemp.trangThais.push(this.trangThai)
    } else {
      searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
    }
    if (!this.trangThai) {
      searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
    } else {
      searchFilterTemp.trangThais = [this.trangThai];
    }
    await this.quanLyVonPhiService.timBaoCaoQuyetToanVonPhi(searchFilterTemp).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          // this.danhSachBaoCao = data.data.content;
          this.danhSachBaoCao = [];
          data.data.content.forEach(item => {
            if (this.listIdDelete.findIndex(e => e == item.id) == -1) {
              this.danhSachBaoCao.push({
                ...item,
                checked: false,
              })
            } else {
              this.danhSachBaoCao.push({
                ...item,
                checked: true,
              })
            }
          })
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

  xoaDieuKien() {
    this.searchFilter.namQtoan = null
    this.searchFilter.ngayTaoDen = null
    this.searchFilter.ngayTaoTu = null
    this.searchFilter.maBcao = null
    this.searchFilter.thongBao = null
    this.trangThai = null
  }

  async taoMoi() {
    this.statusBtnValidate = false;
    if (!this.searchFilter.namQtoan) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTBLANK)
      return;
    } else if (this.searchFilter.namQtoan < 1000 || this.searchFilter.namQtoan > 2999) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.YEAR)
      return;
    }
    const res = {
      namQtoan: this.searchFilter.namQtoan
    }
    await this.quanLyVonPhiService.CtietBcaoQuyetToanNam(res).toPromise().then(
      async (data) => {
        if (data.statusCode != 0) {
          this.notification.error(MESSAGE.ERROR, MESSAGE.CHUA_CO_BAO_CAO);
          return;
        } else {
          this.router.navigate([
            MAIN_ROUTE_QUYET_TOAN + '/' + QUAN_LY_QUYET_TOAN + '/dieu-chinh-so-lieu-quyet-toan-/' + this.searchFilter.namQtoan,
          ])
        }
      },
      (err) => {
        this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
      },
    );
  }

  xemChiTiet(id: string) {
    this.router.navigate([
      MAIN_ROUTE_QUYET_TOAN + '/' + QUAN_LY_QUYET_TOAN + '/dieu-chinh-so-lieu-quyet-toan/' + id,
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
    this.quanLyVonPhiService.xoaBaoCaoLapQuyetToan(request).toPromise().then(
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
  checkViewReport() {
    return this.roles.includes(QTVP.VIEW_REPORT)
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

  checkDeleteReport(trangThai: string) {
    return Utils.statusDelete.includes(trangThai) && this.roles.includes(QTVP.DELETE_DIEU_CHINH_REPORT)
  }
}
