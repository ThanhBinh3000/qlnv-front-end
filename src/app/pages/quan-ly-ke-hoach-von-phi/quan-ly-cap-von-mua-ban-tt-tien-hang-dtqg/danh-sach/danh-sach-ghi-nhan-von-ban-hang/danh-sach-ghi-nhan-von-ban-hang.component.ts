import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { UserService } from 'src/app/services/user.service';
import { LOAI_VON, ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';
import { TRANG_THAI_TIM_KIEM_CHA } from '../../quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.constant';

@Component({
	selector: 'app-danh-sach-ghi-nhan-von-ban-hang',
	templateUrl: './danh-sach-ghi-nhan-von-ban-hang.component.html',
	styleUrls: ['../danh-sach.component.scss'],
})
export class DanhSachGhiNhanVonBanHangComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	userRole: string;
	loai: string;
	//thong tin tim kiem
	searchFilter = {
		maNop: "",
		trangThai: Utils.TT_BC_1,
		tuNgay: null,
		denNgay: null,
		maDviGui: "",
		ngayLap: "",
		maDvi: "",
	};
	//danh muc
	danhSach: any[] = [];
	trangThais: any[] = TRANG_THAI_TIM_KIEM_CHA;
	donVis: any[] = [];
	loaiVons: any[] = LOAI_VON;
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
	) {
	}

	async ngOnInit() {
		this.loai = this.routerActive.snapshot.paramMap.get('loai');

		const userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info

		this.searchFilter.denNgay = new Date();
		const newDate = new Date();
		newDate.setMonth(newDate.getMonth() - 1);
		this.searchFilter.tuNgay = newDate;

		this.searchFilter.maDvi = this.userInfo?.dvql;
		await this.danhMuc.dMDonVi().toPromise().then(
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

		this.onSubmit();
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

		// const trangThais = [];
		// if (this.searchFilter.trangThai) {
		// 	trangThais = [this.searchFilter.trangThai];
		// }
		const requestReport = {
			maNopTienVon: this.searchFilter.maNop,
			maDviCha: this.userInfo?.dvql,
			maDvi: this.searchFilter.maDviGui,
			maLoai: "2",
			ngayLap: this.datePipe.transform(this.searchFilter.ngayLap, Utils.FORMAT_DATE_STR),
			ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
			ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
			paggingReq: {
				limit: this.pages.size,
				page: this.pages.page,
			},
			trangThai: Utils.TT_BC_7,
			trangThaiDviCha: this.searchFilter.trangThai,
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
						e.ngayTrinhDviCha = this.datePipe.transform(e.ngayTrinhDviCha, Utils.FORMAT_DATE_STR);
						e.ngayDuyetDviCha = this.datePipe.transform(e.ngayDuyetDviCha, Utils.FORMAT_DATE_STR);
						e.ngayPheDuyetDviCha = this.datePipe.transform(e.ngayPheDuyetDviCha, Utils.FORMAT_DATE_STR);
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
		this.searchFilter.maNop = null
		this.searchFilter.trangThai = null
		this.searchFilter.tuNgay = null
		this.searchFilter.denNgay = null
		this.searchFilter.maDviGui = null
		this.searchFilter.ngayLap = null
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg/von-ban-hang/' + this.loai + '/' + id,
		])
	}

	getStatusName(trangThai: string) {
		return this.trangThais.find(e => e.id == trangThai)?.tenDm;
	}

	xoaBaoCao(id: any) {
		// this.quanLyVonPhiService.xoaBaoCaoLapThamDinh(id).toPromise().then(
		// 	data => {
		// 		if (data.statusCode == 0){
		// 			this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
		// 			this.onSubmit();
		// 		} else {
		// 			this.notification.error(MESSAGE.ERROR, data?.msg);
		// 		}
		// 	},
		// 	err => {
		// 		this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		// 	}
		// )
	}

	checkDeleteReport(item: any): boolean {
		let check: boolean;
		if ((item.trangThaiDviCha == Utils.TT_BC_1 || item.trangThaiDviCha == Utils.TT_BC_3 || item.trangThaiDviCha == Utils.TT_BC_5) &&
			ROLE_CAN_BO.includes(this.userRole)) {
			check = true;
		} else {
			check = false;
		}
		return check;
	}

	close() {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-cap-von-mua-ban-thanh-toan-tien-hang-dtqg'
		])
	}
}
