import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { CVMB, LOAI_VON, Utils } from 'src/app/Utility/utils';
import { CAP_VON_MUA_BAN, MAIN_ROUTE_CAPVON } from '../../../quan-ly-ke-hoach-von-phi-hang.constant';
import { TRANG_THAI_TIM_KIEM_CHA } from '../../quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.constant';

@Component({
	selector: 'app-danh-sach-ghi-nhan-von-ban-hang',
	templateUrl: './danh-sach-ghi-nhan-von-ban-hang.component.html',
	styleUrls: ['../danh-sach.component.scss'],
})
export class DanhSachGhiNhanVonBanHangComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	roles: string[] = [];
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
		private spinner: NgxSpinnerService,
		private userService: UserService,
	) {
	}

	async ngOnInit() {
		this.loai = this.routerActive.snapshot.paramMap.get('loai');
		this.spinner.show();
		this.userInfo = this.userService.getUserLogin();
		this.roles = this.userInfo?.roles;

		this.searchFilter.denNgay = new Date();
		const newDate = new Date();
		newDate.setMonth(newDate.getMonth() - 1);
		this.searchFilter.tuNgay = newDate;

		this.searchFilter.maDvi = this.userInfo?.MA_DVI;
		await this.danhMuc.dMDviCon().toPromise().then(
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

		if (this.loai == "0") {
			this.status = true;
			this.disable = false;
		} else {
			this.status = false;
			this.disable = true;

			if (this.roles.includes(CVMB.DUYET_REPORT_GNV_BH)) {
				this.searchFilter.trangThai = Utils.TT_BC_2;
			} else {
				this.searchFilter.trangThai = Utils.TT_BC_4;
			}
		}
		this.spinner.hide();
		this.onSubmit();
	}

	//search list bao cao theo tieu chi
	async onSubmit() {

		// const trangThais = [];
		// if (this.searchFilter.trangThai) {
		// 	trangThais = [this.searchFilter.trangThai];
		// }
		const requestReport = {
			maNopTienVon: this.searchFilter.maNop,
			maDviCha: this.userInfo?.MA_DVI,
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

	xoaDieuKien() {
		this.searchFilter.maNop = null
		this.searchFilter.trangThai = null
		this.searchFilter.tuNgay = null
		this.searchFilter.denNgay = null
		this.searchFilter.maDviGui = null
		this.searchFilter.ngayLap = null
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN + '/von-ban-hang/' + this.loai + '/' + id,
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

	checkEditReport(trangThai: string) {
		return Utils.statusSave.includes(trangThai) && this.roles.includes(CVMB.EDIT_REPORT_GNV_BH);
	}

	close() {
		this.router.navigate([
			MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN
		])
	}
}
