import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { CVMB, LOAI_VON, Utils } from 'src/app/Utility/utils';
import { CAP_VON_MUA_BAN, MAIN_ROUTE_CAPVON } from '../../../quan-ly-ke-hoach-von-phi-hang.constant';
import { TRANG_THAI_TIM_KIEM_CON } from '../../quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.constant';

@Component({
	selector: 'app-danh-sach-nhap-von-ban-hang',
	templateUrl: './danh-sach-nhap-von-ban-hang.component.html',
	styleUrls: ['../danh-sach.component.scss'],
})
export class DanhSachNhapVonBanHangComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	loai: string;
	//thong tin tim kiem
	searchFilter = {
		maNop: "",
		trangThai: Utils.TT_BC_1,
		tuNgay: null,
		denNgay: null,
		ngayLap: "",
		maDvi: "",
	};
	//danh muc
	listIdDelete: string[] = [];
	danhSach: any[] = [];
	trangThais: any[] = TRANG_THAI_TIM_KIEM_CON;
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
	statusNew = true;
	statusTaoMoi = true;

	constructor(
		private quanLyVonPhiService: QuanLyVonPhiService,
		private router: Router,
		private routerActive: ActivatedRoute,
		private datePipe: DatePipe,
		private notification: NzNotificationService,
		private spinner: NgxSpinnerService,
		private userService: UserService,
		private dataSource: DataService,
	) {
	}

	async ngOnInit() {
		this.loai = this.routerActive.snapshot.paramMap.get('loai');
		this.spinner.show();
		this.userInfo = this.userService.getUserLogin();

		this.searchFilter.denNgay = new Date();
		const newDate = new Date();
		newDate.setMonth(newDate.getMonth() - 1);
		this.searchFilter.tuNgay = newDate;

		this.searchFilter.maDvi = this.userInfo?.MA_DVI;

		if (this.loai == "0") {
			if (this.userService.isAccessPermisson(CVMB.ADD_REPORT_NTV_BH)) {
				this.statusTaoMoi = false;
			}
			this.status = true;
			this.disable = false;
		} else {
			this.status = false;
			this.disable = true;
			if (this.userService.isAccessPermisson(CVMB.DUYET_REPORT_NTV_BH)) {
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
		this.statusNew = true;
		// const trangThais = [];
		// if (this.searchFilter.trangThai) {
		// 	trangThais = [this.searchFilter.trangThai];
		// }
		const requestReport = {
			maNopTienVon: this.searchFilter.maNop,
			maDvi: this.userInfo?.MA_DVI,
			maLoai: "2",
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
					this.danhSach = [];
					data.data.content.forEach(item => {
						if (this.listIdDelete.findIndex(e => e == item.id) == -1) {
							this.danhSach.push({
								...item,
								checked: false,
							})
						} else {
							this.danhSach.push({
								...item,
								checked: true,
							})
						}
					})
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
		this.searchFilter.maNop = null
		this.searchFilter.trangThai = null
		this.searchFilter.tuNgay = null
		this.searchFilter.denNgay = null
		this.searchFilter.ngayLap = null
	}

	taoMoi() {
		this.statusNew = false;
		if (!this.searchFilter.ngayLap) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		const obj = {
			ngayLap: this.searchFilter.ngayLap,
		}
		this.dataSource.changeData(obj);
		this.router.navigate([
			MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN + '/von-ban-hang',
		]);
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN + '/von-ban-hang/' + this.loai + '/' + id,
		])
	}

	getStatusName(trangThai: string) {
		return this.trangThais.find(e => e.id == trangThai)?.tenDm;
	}

	xoaBaoCao(id: string) {
		let request = [];
		if (!id) {
			request = this.listIdDelete;
		} else {
			request = [id];
		}
		this.spinner.show();
		this.quanLyVonPhiService.xoaVonMuaBan(request).toPromise().then(
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
		this.spinner.hide();
	}

	checkEditReport(trangThai: string) {
		return Utils.statusSave.includes(trangThai) && this.userService.isAccessPermisson(CVMB.EDIT_REPORT_NTV_BH);
	}

	checkDeleteReport(trangThai: string) {
		return Utils.statusDelete.includes(trangThai) && this.userService.isAccessPermisson(CVMB.DELETE_REPORT_NTV_BH);
	}

	changeListIdDelete(id: string) {
		if (this.listIdDelete.findIndex(e => e == id) == -1) {
			this.listIdDelete.push(id);
		} else {
			this.listIdDelete = this.listIdDelete.filter(e => e != id);
		}
	}

	checkAll() {
		let check = true;
		this.danhSach.forEach(item => {
			if (item.checked) {
				check = false;
			}
		})
		return check;
	}

	updateAllCheck() {
		this.danhSach.forEach(item => {
			if (this.checkDeleteReport(item.trangThai)) {
				item.checked = true;
				this.listIdDelete.push(item.id);
			}
		})
	}

	close() {
		this.router.navigate([
			MAIN_ROUTE_CAPVON + '/' + CAP_VON_MUA_BAN
		])
	}
}
