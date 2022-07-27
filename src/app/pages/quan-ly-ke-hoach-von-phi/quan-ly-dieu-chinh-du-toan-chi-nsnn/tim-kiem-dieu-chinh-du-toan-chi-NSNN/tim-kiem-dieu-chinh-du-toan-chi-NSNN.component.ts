import { ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, ROLE_LANH_DAO } from './../../../../Utility/utils';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { DataService } from '../../quan-ly-dieu-chinh-du-toan-chi-nsnn/data.service';
// import { TRANGTHAIBAOCAO } from '../quan-ly-dieu-chinh-du-toan-chi-nsnn.constant';
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
  // {
  //   id: "6",
  //   tenDm: 'Lãnh đạo duyệt'
  // },
  // {
  //     id: "7",
  //     tenDm: 'Gửi ĐV cấp trên'
  // },
  {
      id: "7",
      tenDm: 'Lãnh đạo duyệt'
  },
  {
    id: "8",
    tenDm: 'ĐV cấp trên Từ chối'
  },
  {
    id: "9",
    tenDm: 'ĐV cấp trên Tiếp nhận'
  },
  // {
  //     id: "10",
  //     tenDm: 'Lãnh đạo yêu cầu điều chỉnh'
  // },
]
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
    tuNgay: "",
    denNgay: "",
    maBcao: "",
    donViTao: "",
    paggingReq: {
      limit: 10,
      page: 1
    },
    loaiTimKiem: "0",
    trangThais: [],
  };
  //danh muc
  danhSachDieuChinh: any[] = [];
  trangThais: any[] = TRANG_THAI_TIM_KIEM;
  listIdDelete: any[] = [];
  //phan trang
  totalElements = 0;
  totalPages = 0;
  pages = {
    size: 10,
    page: 1,
  }
  date: any = new Date()
  trangThai!: string;
  userRole: string;
  status: boolean;
  donVis: any[] = [];
  maDviTao: string;
  loai = '0';
  statusBtnValidate = true;

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
    const userName = this.userService.getUserName();
    await this.getUserInfo(userName); //get user info
    this.searchFilter.denNgay = new Date().toISOString().slice(0, 16);
    this.date.setMonth(this.date.getMonth() - 1);
    this.searchFilter.tuNgay = this.date.toISOString().slice(0, 16);
    this.searchFilter.nam = new Date().getFullYear()
    this.searchFilter.donViTao = this.userInfo?.dvql;
    this.userRole = this.userInfo?.roles[0].code;
    this.maDviTao = this.userInfo?.dvql;
    // this.trangThai = '1'

    //  check va lay gia tri role trong list role
    const roleUserCB = ROLE_CAN_BO.filter(e => e == this.userInfo?.roles[0].code)
    const roleUserTPB = ROLE_TRUONG_BO_PHAN.filter(e => e == this.userInfo?.roles[0].code)
    const roleUserLD = ROLE_LANH_DAO.filter(e => e == this.userInfo?.roles[0].code)
    if (ROLE_LANH_DAO.includes(this.userInfo?.roles[0]?.code) ||
        ROLE_TRUONG_BO_PHAN.includes(this.userInfo?.roles[0]?.code)) {
      this.status = false;
    } else {
      this.status = true;
    }

    if (this.userRole == roleUserCB[0]) {
      this.trangThai = Utils.TT_BC_1;
      this.searchFilter.loaiTimKiem = '0';
      this.donVis = this.donVis.filter(e => e?.maDviCha == this.maDviTao);
      this.searchFilter.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_1));
    }
    else {
      this.searchFilter.loaiTimKiem = '0';
      this.searchFilter.donViTao = this.maDviTao;
      if (this.userRole == roleUserTPB[0]) {
        this.trangThai = Utils.TT_BC_2;
        this.searchFilter.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_2));
      } else if (this.userRole == roleUserLD[0]) {
        this.trangThai = Utils.TT_BC_4;
        this.searchFilter.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_4));
      } else {
        this.trangThai = null;
        this.searchFilter.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6];
      }
    }
    this.onSubmit();
    this.spinner.hide();
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
      '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn',
      0,
    ]);
  }

  redirectSuaThongTinTimKiem(id) {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn',
      id,
    ]);
  }

  //search list bao cao theo tieu chi
  async onSubmit() {
    this.statusBtnValidate = true;
    if (this.searchFilter.nam || this.searchFilter.nam === 0) {
      if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }

    const searchFilterTemp = Object.assign({}, this.searchFilter);
    searchFilterTemp.trangThais = [];
    searchFilterTemp.tuNgay = this.datePipe.transform(searchFilterTemp.tuNgay, 'dd/MM/yyyy') || searchFilterTemp.tuNgay;
    searchFilterTemp.denNgay = this.datePipe.transform(searchFilterTemp.denNgay, 'dd/MM/yyyy') || searchFilterTemp.denNgay;
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
    this.spinner.show();
    await this.quanLyVonPhiService.timKiemDieuChinh(searchFilterTemp).toPromise().then(
      (data) => {
        if (data.statusCode == 0) {
          this.danhSachDieuChinh = data.data.content;
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
  } a

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

  taoMoi() {
    this.statusBtnValidate = false;
    if (this.searchFilter.nam || this.searchFilter.nam === 0) {
      if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
        this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
        return;
      }
    }
    if (!this.searchFilter.nam) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
      return;
    } if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
      this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
      return;
    }
    const obj = {
			dotBcao : this.searchFilter.dotBcao,
		}
		this.dataSource.changeData(obj);
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/0/' + this.searchFilter.nam,
    ]);

  }

  xemChiTiet(id: string) {
    this.router.navigate([
      '/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/chi-tiet-giao-nhiem-vu/'+ this.loai+'/'+ id,
    ])
  }

  async xoaDuToanDieuChinh(id: string) {
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
    )
  }

  getStatusName(trangThai: string) {
    return this.trangThais.find(e => e.id == trangThai).tenDm;
  }

  xoaDieuKien() {
    this.searchFilter.tuNgay = null
    this.searchFilter.nam = null
    this.searchFilter.denNgay = null
    this.searchFilter.maBcao = null
    this.searchFilter.dotBcao = null
    this.trangThai = null
  }

  xoaBaoCao(id: string) {
		let request = [];
		if (!id){
			request = this.listIdDelete;
		} else {
			request = [id];
		}
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
	}


	changeListIdDelete(id: any){
		if (this.listIdDelete.findIndex(e => e == id) == -1){
			this.listIdDelete.push(id);
		} else {
			this.listIdDelete = this.listIdDelete.filter(e => e != id);
		}
	}

	checkAll(){
		let check = true;
		this.danhSachDieuChinh.forEach(item => {
			if (item.checked){
				check = false;
			}
		})
		return check;
	}

	updateAllCheck(){
		this.danhSachDieuChinh.forEach(item => {
			if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8)
			&& ROLE_CAN_BO.includes(this.userRole)){
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
