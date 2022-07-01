import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, LOAI_DE_NGHI, ROLE_CAN_BO, ROLE_LANH_DAO, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
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
	userRole: any;
	loai: string;
	//thong tin tim kiem
	searchFilter = {
		maDn: null,
		trangThai: Utils.TT_BC_1,
		tuNgay: null,
		denNgay: null,
		qdChiTieu: "",
		canCuGia: "",
		loaiDn: "",
		maDviTao: "",
		loaiTimKiem: "0",
	};
	capDvi: string;
	listIdDelete: any[] = [];
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
			id: Utils.TT_BC_5,
			tenDm: "Lãnh đạo từ chối",
		},
		{
			id: Utils.TT_BC_7,
			tenDm: "Lãnh đạo duyệt",
		},
	];
	donVis: any[] = [];
	loaiDns: any[] = LOAI_DE_NGHI;
	canCuGias: any[] = CAN_CU_GIA;
	//phan trang
	totalElements = 0;
	totalPages = 0;
	pages = {
		size: 10,
		page: 1,
	}
	//trangThai
	statusBtnNew: boolean = true;
	statusTaoMoi: boolean = true;
	status: boolean;
	disable: boolean;

	constructor(
		private quanLyVonPhiService: QuanLyVonPhiService,
		private danhMuc: DanhMucHDVService,
		private routerActive: ActivatedRoute,
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
		this.loai = this.routerActive.snapshot.paramMap.get('loai');

		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info

		this.searchFilter.denNgay = new Date();
		let newDate = new Date();
		newDate.setMonth(newDate.getMonth() - 1);
		this.searchFilter.tuNgay = newDate;
		this.searchFilter.maDviTao = this.userInfo?.dvql;

		await this.danhMuc.dMDonVi().toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.donVis = data.data;
					this.capDvi = this.donVis.find(e => e.maDvi == this.userInfo?.dvql)?.capDvi;
				} else {
					this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		);

		if (this.loai == "0") {
			if (ROLE_CAN_BO.includes(this.userRole)) {
				this.statusTaoMoi = false;
			}
			this.status = false;
		} else {
			this.status = true;
			this.searchFilter.trangThai = Utils.TT_BC_2;
		}

		if (this.capDvi == Utils.TONG_CUC && (this.loai == "0" || ROLE_LANH_DAO.includes(this.userRole))) {
			this.searchFilter.canCuGia = Utils.HD_TRUNG_THAU;
			this.searchFilter.loaiDn = Utils.MUA_VTU;
			this.disable = true;
		} else {
			this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
			this.disable = false;
		}

		this.searchFilter.maDviTao = this.userInfo?.dvql;
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
		this.statusBtnNew = true;
		let trangThais = [];
		if (this.searchFilter.trangThai) {
			trangThais = [this.searchFilter.trangThai];
		}
		let requestReport = {
			loaiTimKiem: this.searchFilter.loaiTimKiem,
			// maDvi: this.searchFilter.maDviTao,
			ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
			ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
			soQdChiTieu: this.searchFilter.qdChiTieu,
			canCuVeGia: this.searchFilter.canCuGia,
			loaiDnghi: this.searchFilter.loaiDn,
			maDnghi: this.searchFilter.maDn,
			paggingReq: {
				limit: this.pages.size,
				page: this.pages.page,
			},
			trangThais: trangThais,
		};
		this.spinner.show();
		await this.quanLyVonPhiService.timKiemDeNghi(requestReport).toPromise().then(
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
						e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
						e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
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
		this.searchFilter.maDn = null
		this.searchFilter.trangThai = null
		this.searchFilter.tuNgay = null
		this.searchFilter.denNgay = null
		this.searchFilter.qdChiTieu = null
		if (!this.disable) {
			this.searchFilter.canCuGia = null
			this.searchFilter.loaiDn = null
		}
	}

	taoMoi() {
		this.statusBtnNew = false;
		if (!this.searchFilter.qdChiTieu ||
			!this.searchFilter.canCuGia ||
			!this.searchFilter.loaiDn) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		let obj = {
			qdChiTieu: this.searchFilter.qdChiTieu,
			canCuGia: this.searchFilter.canCuGia,
			loaiDn: this.searchFilter.loaiDn,
		}
		this.dataSource.changeData(obj);
		if (this.searchFilter.canCuGia == Utils.HD_TRUNG_THAU) {
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/de-nghi-theo-quyet-dinh-trung-thau',
			])
		}
		else {
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/de-nghi-theo-quyet-dinh-don-gia-mua',
			])
		}
	}

	xemChiTiet(item: any) {
		if (item.canCuVeGia == Utils.HD_TRUNG_THAU) {
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/de-nghi-theo-quyet-dinh-trung-thau/' + this.loai + '/' + item.id,
			])
		} else {
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/de-nghi-theo-quyet-dinh-don-gia-mua/' + this.loai + '/' + item.id,
			])
		}
	}

	getStatusName(trangThai: string) {
		return this.trangThais.find(e => e.id == trangThai)?.tenDm;
	}

	xoaDeNghi(id: string) {
		let request = [];
		if (!id) {
			request = this.listIdDelete;
		} else {
			request = [id];
		}
		this.quanLyVonPhiService.xoaDeNghi(request).toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
					this.listIdDelete = [];
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

	checkDeleteReport(item: any): boolean {
		var check: boolean;
		if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8)
			&& ROLE_CAN_BO.includes(this.userRole)) {
			check = true;
		} else {
			check = false;
		}
		return check;
	}

	changeListIdDelete(id: any) {
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
			'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi',
		])
	}
}
