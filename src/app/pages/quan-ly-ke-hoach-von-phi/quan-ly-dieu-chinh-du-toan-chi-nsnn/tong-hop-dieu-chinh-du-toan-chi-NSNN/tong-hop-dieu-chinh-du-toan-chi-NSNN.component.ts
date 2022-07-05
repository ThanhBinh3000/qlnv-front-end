import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { TRANG_THAI_GUI_DVCT, Utils } from 'src/app/Utility/utils';
// loai trang thai kiem tra
export const TRANG_THAI_KIEM_TRA_BAO_CAO = [
  {
      id: '9',
      ten: 'Tiếp nhận'
  },
  {
      id: '7',
      ten: 'Mới'
  },
  {
      id: '-1',
      ten: 'Chưa gửi đơn vị cấp trên'
  },
]


@Component({
	selector: 'app-tong-hop-dieu-chinh-du-toan-chi-NSNN',
	templateUrl: './tong-hop-dieu-chinh-du-toan-chi-NSNN.component.html',
	styleUrls: ['./tong-hop-dieu-chinh-du-toan-chi-NSNN.component.scss']
})
export class TongHopDieuChinhDuToanChiNSNNComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	//thong tin tim kiem
	namHienTai: number;
	trangThai: string = Utils.TT_BC_9;
	maDviTao: string;
  dotBcao: number;
	//danh muc
	danhSachDieuChinh: any[] = [];
	trangThais: any[] = TRANG_THAI_KIEM_TRA_BAO_CAO;
	donVis: any[] = [];
	//phan trang
	totalElements = 0;
	totalPages = 0;
	pages = {
		size: 10,
		page: 1,
	}

	constructor(
		private quanLyVonPhiService: QuanLyVonPhiService,
		private danhMuc: DanhMucHDVService,
		private router: Router,
		private datePipe: DatePipe,
		private userService: UserService,
		private notification: NzNotificationService,
		private fb: FormBuilder,
		private location: Location,
		private spinner: NgxSpinnerService,
	) { }

	async ngOnInit() {
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		this.maDviTao = this.userInfo?.dvql;
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
		this.onSubmit();
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
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);
	}

	//search list bao cao theo tieu chi
	async onSubmit() {
		if (this.namHienTai >= 3000 || this.namHienTai < 1000) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
			return;
		}
		let trangThais = [];
		if (this.trangThai){
			trangThais = [this.trangThai];
		}
		let requestReport = {
			dotBcao: null,
      loaiTimKiem: "1",
      maBcao: "",
      maDvi:this.maDviTao,
      namBcao: this.namHienTai,
      ngayTaoDen: "",
      ngayTaoTu: "",
      paggingReq: {
				limit: this.pages.size,
				page: this.pages.page,
			},
      str: "",
      thangBcao: null,
      trangThai: this.trangThai,
			trangThais: trangThais,
		};
		this.spinner.show();
		//let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
		await this.quanLyVonPhiService.timKiemDieuChinh(requestReport).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.danhSachDieuChinh = data.data.content;
					this.danhSachDieuChinh.forEach(e => {
						e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
						e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
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

	tongHop() {
		if (!this.namHienTai) {
			this.notification.warning(MESSAGE.ERROR, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		if (this.namHienTai < 1000 && this.namHienTai > 2999) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
			return;
		}
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu-/' + this.dotBcao + '/' + this.namHienTai + '/' + this.maDviTao,
		])
	}


	dong() {
		// this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn'])
		this.location.back();
	}


	xemChiTiet(id: string) {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-dieu-chinh-du-toan-chi-nsnn/giao-nhiem-vu/' + id,
		])
	}

	//doi so trang
	onPageIndexChange(page) {
		this.pages.page = page;
	}

	//doi so luong phan tu tren 1 trang
	onPageSizeChange(size) {
		this.pages.size = size;
	}
	redirectChiTieuKeHoachNam() {
		this.location.back()
	}

	getStatusName(trangThai: string){
		return this.trangThais.find(e => e.id == trangThai)?.ten;
	}

	getUnitName(maDvi: string){
		return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
	}

  xoaDieuKien(){
    this.namHienTai = null
    this.dotBcao = null
  }
}
