import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { ROLE_CAN_BO, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { DataService } from '../data.service';

@Component({
	selector: 'app-tim-kiem',
	templateUrl: './tim-kiem.component.html',
	styleUrls: ['./tim-kiem.component.scss'],
})
export class TimKiemComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	userRole: string;
	//thong tin tim kiem
	searchFilter = {
		nam: null,
		tuNgay: null,
		denNgay: null,
		maBaoCao: "",
		donViTao: "",
		trangThai: Utils.TT_BC_1,
	};
	newDate = new Date();
	listIdDelete: string[] = [];
	//danh muc
	danhSachBaoCao: any[] = [];
	trangThais: any[] = [
		{
			id: Utils.TT_BC_1,
			tenDm: "Đang soạn",
		},
		{
			id: Utils.TT_BC_2,
			tenDm: "Trình duyệt",
		},
		{
			id: Utils.TT_BC_3,
			tenDm: "Trưởng BP từ chối",
		},
		{
			id: Utils.TT_BC_4,
			tenDm: "Trưởng BP duyệt",
		},
		{
			id: Utils.TT_BC_5,
			tenDm: "Lãnh đạo từ chối",
		},
		{
			id: Utils.TT_BC_7,
			tenDm: "Lãnh đạo phê duyệt",
		},
		{
			id: Utils.TT_BC_8,
			tenDm: "Đơn vị cấp trên từ chối",
		},
		{
			id: Utils.TT_BC_9,
			tenDm: "Đơn vị cấp trên tiếp nhận",
		},
	];
	//phan trang
	totalElements = 0;
	totalPages = 0;
	pages = {
		size: 10,
		page: 1,
	}

	statusTaoMoi = true;

	constructor(
		private quanLyVonPhiService: QuanLyVonPhiService,
		private danhMuc: DanhMucHDVService,
		private router: Router,
		private datePipe: DatePipe,
		private notification: NzNotificationService,
		private fb: FormBuilder,
		private spinner: NgxSpinnerService,
		private userService: UserService,
		private location: Location,
		private dataSource: DataService,
	) {
	}

	async ngOnInit() {
		this.searchFilter.denNgay = new Date();
		const newDate = new Date();
		newDate.setMonth(newDate.getMonth() - 1);
		this.searchFilter.tuNgay = newDate;

		const userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info

		if (ROLE_CAN_BO.includes(this.userInfo?.roles[0]?.code)) {
			this.statusTaoMoi = false;
		}

		this.searchFilter.donViTao = this.userInfo?.dvql;
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
		if (this.searchFilter.nam || this.searchFilter.nam === 0) {
			if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
				this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
				return;
			}
		}
		let trangThais = [];
		if (this.searchFilter.trangThai) {
			trangThais = [this.searchFilter.trangThai];
		}
		const requestReport = {
			loaiTimKiem: "0",
			maBcao: this.searchFilter.maBaoCao,
			maDvi: this.searchFilter.donViTao,
			namBcao: this.searchFilter.nam,
			ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
			ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
			paggingReq: {
				limit: this.pages.size,
				page: this.pages.page,
			},
			trangThais: trangThais,
		};
		this.spinner.show();
		//let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
		await this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
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
		this.pages.page = page;
		this.onSubmit();
	}

	//doi so luong phan tu tren 1 trang
	onPageSizeChange(size) {
		this.pages.size = size;
		this.onSubmit();
	}
	xoaDieuKien() {
		this.searchFilter.nam = null
		this.searchFilter.tuNgay = null
		this.searchFilter.denNgay = null
		this.searchFilter.maBaoCao = null
		this.searchFilter.trangThai = null
	}

	taoMoi() {
		if (this.searchFilter.nam || this.searchFilter.nam === 0) {
			if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
				this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
				return;
			}
		}
		const obj = {
			namHienTai: new Date().getFullYear() + 1,
		}
		if (this.searchFilter.nam) {
			obj.namHienTai = this.searchFilter.nam;
		}
		this.dataSource.changeData(obj);
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao',
		]);
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao/0/' + id,
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
		this.spinner.show();
		this.quanLyVonPhiService.xoaBaoCaoLapThamDinh(request).toPromise().then(
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

	checkDeleteReport(item: any): boolean {
		let check: boolean;
		if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8) &&
			this.userInfo?.username == item.nguoiTao) {
			check = true;
		} else {
			check = false;
		}
		return check;
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
		this.danhSachBaoCao.forEach(item => {
			if (item.checked) {
				check = false;
			}
		})
		return check;
	}

	updateAllCheck() {
		this.danhSachBaoCao.forEach(item => {
			if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8)
				&& ROLE_CAN_BO.includes(this.userRole)) {
				item.checked = true;
				this.listIdDelete.push(item.id);
			}
		})
	}

	close() {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn',
		])
	}
}

