import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NGUON_BAO_CAO, ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, Utils } from 'src/app/Utility/utils';
import { CAP_VON_NGUON_CHI, MAIN_ROUTE_CAPVON } from '../../quan-ly-ke-hoach-von-phi-hang.constant';
import { DataService } from '../data.service';



@Component({
	selector: 'app-tong-hop',
	templateUrl: './tong-hop.component.html',
	styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	userRole: string;
	loai: string;
	//thong tin tim kiem
	searchFilter = {
		loaiTimKiem: '0',
		maDeNghi: "",
		trangThai: Utils.TT_BC_1,
		tuNgay: null,
		denNgay: null,
		qdChiTieu: "",
		loaiDn: "",
		maDviTao: "",
	};
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
	];
	listIdDelete: string[] = [];
	donVis: any[] = [];
	loaiDns: any[] = NGUON_BAO_CAO;
	//phan trang
	totalElements = 0;
	totalPages = 0;
	pages = {
		size: 10,
		page: 1,
	}
	//trang thai
	statusBtnNew = true;
	statusTaoMoi = true;
	status: boolean;
	disable: boolean;

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
		private routerActive: ActivatedRoute,
		private dataSource: DataService,
	) { }

	async ngOnInit() {
		this.loai = this.routerActive.snapshot.paramMap.get('loai');
		this.spinner.show();
		const userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info

		this.searchFilter.denNgay = new Date();
		const newDate = new Date();
		newDate.setMonth(newDate.getMonth() - 1);
		this.searchFilter.tuNgay = newDate;

		this.searchFilter.maDviTao = this.userInfo?.dvql;

		if (this.loai == "0") {
			if (ROLE_CAN_BO.includes(this.userRole)) {
				this.statusTaoMoi = false;
			}
			this.status = false;
			this.disable = false;
		} else {
			this.status = true;
			this.disable = true;
			if (ROLE_TRUONG_BO_PHAN.includes(this.userRole)) {
				this.searchFilter.trangThai = Utils.TT_BC_2;
			} else {
				this.searchFilter.trangThai = Utils.TT_BC_4;
			}
		}
		//lay danh sach danh muc
		// this.danhMuc.dMDonVi().toPromise().then(
		// 	data => {
		// 		if (data.statusCode == 0) {
		// 			this.donVis = data.data;
		// 		} else {
		// 			this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
		// 		}
		// 	},
		// 	err => {
		// 		this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		// 	}
		// );
		this.spinner.hide();
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
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);
	}

	//search list bao cao theo tieu chi
	async onSubmit() {
		this.statusBtnNew = true;
		const requestReport = {
			loaiTimKiem: this.searchFilter.loaiTimKiem,
			maDnghi: this.searchFilter.maDeNghi,
			maDvi: this.searchFilter.maDviTao,
			ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
			ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
			soQdChiTieu: this.searchFilter.qdChiTieu,
			loaiDnghi: this.searchFilter.loaiDn,
			paggingReq: {
				limit: this.pages.size,
				page: this.pages.page,
			},
			trangThai: this.searchFilter.trangThai,
		};
		this.spinner.show();
		await this.quanLyVonPhiService.timKiemDeNghiThop(requestReport).toPromise().then(
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

	xoaDieuKien() {
		this.searchFilter.maDeNghi = null
		this.searchFilter.trangThai = null
		this.searchFilter.tuNgay = null
		this.searchFilter.denNgay = null
		this.searchFilter.qdChiTieu = null
		this.searchFilter.loaiDn = null
	}

	taoMoi() {
		this.statusBtnNew = false;
		if (!this.searchFilter.loaiDn) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		if (this.searchFilter.loaiDn == Utils.THOP_TAI_TC && !this.searchFilter.qdChiTieu) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		const obj = {
			qdChiTieu: this.searchFilter.qdChiTieu,
		}
		this.dataSource.changeData(obj);
		if (this.searchFilter.loaiDn == Utils.THOP_TAI_TC) {
			this.router.navigate([
				MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/tong-hop-tai-tong-cuc'
			])
		} else {
			this.router.navigate([
				MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/danh-sach-de-nghi-tu-cuc-khu-cuc'
			])
		}
	}


	dong() {
		this.router.navigate([
			MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI,
		])
	}


	xemChiTiet(item: any) {
		if (item.loaiDnghi == Utils.THOP_TAI_TC) {
			this.router.navigate([
				MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/tong-hop-tai-tong-cuc/' + this.loai + '/' + item.id
			])
		} else {
			this.router.navigate([
				MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/tong-hop-tu-cuc-khu-vuc/' + this.loai + '/' + item.id
			])
		}
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
	redirectChiTieuKeHoachNam() {
		this.location.back()
	}

	getStatusName(trangThai: string) {
		return this.trangThais.find(e => e.id == trangThai)?.tenDm;
	}

	// getUnitName(maDvi: string) {
	// 	return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
	// }

	xoaDeNghi(id: string) {
		let request = [];
		if (!id) {
			request = this.listIdDelete;
		} else {
			request = [id];
		}
		this.spinner.show();
		this.quanLyVonPhiService.xoaDeNghiThop(request).toPromise().then(
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
		if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8)
			&& ROLE_CAN_BO.includes(this.userRole)) {
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
}
