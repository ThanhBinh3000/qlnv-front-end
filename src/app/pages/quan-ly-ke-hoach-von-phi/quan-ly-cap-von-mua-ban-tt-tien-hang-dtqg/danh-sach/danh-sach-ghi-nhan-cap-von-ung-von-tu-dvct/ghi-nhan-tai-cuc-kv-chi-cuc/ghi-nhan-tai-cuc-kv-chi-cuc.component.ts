import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { LOAI_VON, ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../../services/quanLyVonPhi.service';
import { DataService } from '../../../data.service';
import { TRANG_THAI_TIM_KIEM_CHA } from '../../../quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.constant';

@Component({
	selector: 'app-ghi-nhan-tai-cuc-kv-chi-cuc',
	templateUrl: './ghi-nhan-tai-cuc-kv-chi-cuc.component.html',
	styleUrls: ['../../danh-sach.component.scss'],
})
export class GhiNhanTaiCucKvChiCucComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	userRole: string;
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
		private fb: FormBuilder,
		private spinner: NgxSpinnerService,
		private userService: UserService,
		private dataSource: DataService,
	) {
	}

	async ngOnInit() {
		this.loai = this.routerActive.snapshot.paramMap.get('loai');

		const userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info

		this.searchFilter.maDvi = this.userInfo?.dvql;

		this.searchFilter.denNgay = new Date();
		this.newDate.setMonth(this.newDate.getMonth() - 1);
		this.searchFilter.tuNgay = this.newDate;

		if (this.loai == "0") {
			this.status = true;
			this.disable = false;
		} else {
			this.status = false;
			this.disable = true;
			if (ROLE_TRUONG_BO_PHAN.includes(this.userRole)) {
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
		this.onSubmit();
	}

	async getDanhSachCapVon() {
		const request = {
			maCapUngVonChoCapDuoi: "",
			ngayTaoTu: "",
			ngayTaoDen: "",
			maDvi: this.donVis.find(e => e.maDvi == this.userInfo?.dvql)?.maDviCha,
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

	//get user info
	async getUserInfo(username: string) {
		await this.userService.getUserInfo(username).toPromise().then(
			(data) => {
				if (data?.statusCode == 0) {
					this.userInfo = data?.data;
					this.userRole = this.userInfo?.roles[0]?.code;
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

	xoaDieuKien(){
		this.searchFilter.maCvUv = null
		this.searchFilter.trangThai = null
		this.searchFilter.tuNgay = null
		this.searchFilter.denNgay = null
		this.searchFilter.ngayLap = null
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			'qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg/ghi-nhan-von-tai-ckv-cc/' + this.loai + '/' + id,
		])
	}

	getStatusName(trangThai: string) {
		return this.trangThais.find(e => e.id == trangThai)?.tenDm;
	}

	// xoaBaoCao(id: any) {
	// 	this.quanLyVonPhiService.xoaVonMuaBan(id).toPromise().then(
	// 		data => {
	// 			if (data.statusCode == 0){
	// 				this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
	// 				this.onSubmit();
	// 			} else {
	// 				this.notification.error(MESSAGE.ERROR, data?.msg);
	// 			}
	// 		},
	// 		err => {
	// 			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
	// 		}
	// 	)
	// }

	// checkDeleteReport(item: any): boolean {
	// 	var check: boolean;
	// 	if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8) 
	// 		 && ROLE_CAN_BO.includes(this.userRole)) {
	// 		check = true;
	// 	} else {
	// 		check = false;
	// 	}
	// 	return check;
	// }

	close() {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg'
		])
	}
}
