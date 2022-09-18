import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { CAP_VON_MUA_BAN, MAIN_ROUTE_CAPVON } from 'src/app/pages/quan-ly-ke-hoach-cap-von-phi-hang/quan-ly-ke-hoach-von-phi-hang.constant';
import { UserService } from 'src/app/services/user.service';
import { CVMB, LOAI_VON, ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { DataService } from 'src/app/services/data.service';
import { TRANG_THAI_TIM_KIEM_CHA } from '../../../quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.constant';

@Component({
	selector: 'app-ghi-nhan-tai-cuc-kv-chi-cuc',
	templateUrl: './ghi-nhan-tai-cuc-kv-chi-cuc.component.html',
	styleUrls: ['../../danh-sach.component.scss'],
})
export class GhiNhanTaiCucKvChiCucComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	roles: string[] = [];
	loai: string;
	//thong tin tim kiem
	searchFilter = {
		maCvUv: "",
		trangThai: Utils.TT_BC_1,
		tuNgay: null,
		denNgay: null,
		ngayLap: "",
		maDvi: "",
	};
	newDate = new Date();
	//danh muc
	danhSach: any[] = [];
	donVis: any[] = [];
	trangThais: any[] = TRANG_THAI_TIM_KIEM_CHA;
	loaiVons: any[] = LOAI_VON;
	danhSachCapVon: any[] = [];
	//phan trang
	totalElements = 0;
	totalPages = 0;
	pages = {
		size: 10,
		page: 1,
	}
	//trang thai
	status: boolean;
	disable: boolean;
	statusNew: boolean;

	constructor(
		private quanLyVonPhiService: QuanLyVonPhiService,
		private danhMuc: DanhMucHDVService,
		private router: Router,
		private routerActive: ActivatedRoute,
		private datePipe: DatePipe,
		private notification: NzNotificationService,
		private spinner: NgxSpinnerService,
		private userService: UserService,
	) {
	}

	async ngOnInit() {
		this.loai = this.routerActive.snapshot.paramMap.get('loai');
		this.spinner.show();
		this.userInfo = this.userService.getUserLogin();
		this.roles = this.userInfo.roles;

		this.searchFilter.maDvi = this.userInfo?.MA_DVI;

		this.searchFilter.denNgay = new Date();
		this.newDate.setMonth(this.newDate.getMonth() - 1);
		this.searchFilter.tuNgay = this.newDate;

		if (this.loai == "0") {
			this.status = true;
			this.disable = false;
		} else {
			this.status = false;
			this.disable = true;
			if (this.roles.includes(CVMB.DUYET_REPORT_GNV)) {
				this.searchFilter.trangThai = Utils.TT_BC_2;
			} else {
				this.searchFilter.trangThai = Utils.TT_BC_4;
			}
		}
		await this.danhMuc.dMDonVi().toPromise().then(
			(res) => {
				if (res.statusCode == 0) {
					this.donVis = res.data;
				} else {
					this.notification.error(MESSAGE.ERROR, res?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			},
		);

		await this.getDanhSachCapVon();
		this.spinner.hide();
		this.onSubmit();
	}

	async getDanhSachCapVon() {
		const request = {
			maCapUngVonChoCapDuoi: "",
			ngayTaoTu: "",
			ngayTaoDen: "",
			maDvi: this.donVis.find(e => e.maDvi == this.userInfo?.MA_DVI)?.maDviCha,
			trangThai: Utils.TT_BC_7,
			paggingReq: {
				limit: 1000,
				page: 1
			}
		}
		await this.quanLyVonPhiService.timKiemCapVon(request).toPromise().then(
			(data) => {
				if (data?.statusCode == 0) {
					this.danhSachCapVon = data.data.content;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		);
	}

	//search list bao cao theo tieu chi
	async onSubmit() {
		this.statusNew = true;
		const requestReport = {
			maCapUngVonTuCapTren: this.searchFilter.maCvUv,
			maDvi: this.userInfo?.dvql,
			maLoai: "1",
			ngayLap: this.datePipe.transform(this.searchFilter.ngayLap, Utils.FORMAT_DATE_STR),
			ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
			ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
			paggingReq: {
				limit: this.pages.size,
				page: this.pages.page,
			},
			trangThai: this.searchFilter.trangThai,
		};
		this.spinner.show();
		await this.quanLyVonPhiService.timKiemVonMuaBan(requestReport).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.danhSach = data.data.content;
					this.danhSach.forEach(e => {
						e.ngayLap = this.datePipe.transform(e.ngayLap, Utils.FORMAT_DATE_STR);
						e.ngayNhan = this.datePipe.transform(e.ngayNhan, Utils.FORMAT_DATE_STR);
						e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
						e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
						e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
						e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
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
		this.searchFilter.maCvUv = null
		this.searchFilter.trangThai = null
		this.searchFilter.tuNgay = null
		this.searchFilter.denNgay = null
		this.searchFilter.ngayLap = null
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN + '/ghi-nhan-von-tai-ckv-cc/' + this.loai + '/' + id,
		])
	}

	getStatusName(trangThai: string) {
		return this.trangThais.find(e => e.id == trangThai)?.tenDm;
	}

	close() {
		this.router.navigate([
			MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN
		])
	}
}
