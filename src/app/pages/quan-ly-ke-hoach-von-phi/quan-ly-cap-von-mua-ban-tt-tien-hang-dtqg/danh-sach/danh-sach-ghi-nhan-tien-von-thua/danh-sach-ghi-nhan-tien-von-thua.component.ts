import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { LOAI_VON, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../../services/quanLyVonPhi.service';

@Component({
	selector: 'app-danh-sach-ghi-nhan-tien-von-thua',
	templateUrl: './danh-sach-ghi-nhan-tien-von-thua.component.html',
	styleUrls: ['../danh-sach.component.scss'],
})
export class DanhSachGhiNhanTienVonThuaComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	loai: string;
	//thong tin tim kiem
	searchFilter = {
		maCvUv: "",
		trangThai: "",
		tuNgay: "",
		denNgay: "",
		maTienThua: "",
		ngayLap: "",
		maDviGui: "",
		maDvi: "",
	};
	//danh muc
	danhSach: any[] = [];
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
			tenDm: "TBP từ chối",
		},
		{
			id: Utils.TT_BC_4,
			tenDm: "TBP chấp nhận",
		},
		{
			id: Utils.TT_BC_5,
			tenDm: "Lãnh đạo từ chối",
		},
		{
			id: Utils.TT_BC_7,
			tenDm: "Lãnh đạo chấp nhận",
		},
		{
			id: Utils.TT_BC_8,
			tenDm: "Từ chối",
		},
		{
			id: Utils.TT_BC_9,
			tenDm: "Tiếp nhận",
		},
	];
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

		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info

		this.searchFilter.maDvi = this.userInfo?.dvql;

		await this.danhMuc.dMDonVi().toPromise().then(
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
			if (this.userInfo?.roles[0]?.code == Utils.NHAN_VIEN) {
				this.searchFilter.trangThai = Utils.TT_BC_7;
				this.trangThais = [
					{
						id: Utils.TT_BC_7,
						tenDm: "Mới",
					}
				]
			} else {
				if (this.userInfo?.roles[0]?.code == Utils.TRUONG_BO_PHAN) {
					this.searchFilter.trangThai = Utils.TT_BC_2;
				} else {
					this.searchFilter.trangThai = Utils.TT_BC_4;
				}
			}
		}

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
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		);
	}

	//search list bao cao theo tieu chi
	async onSubmit() {

		let trangThais = [];
		if (this.searchFilter.trangThai) {
			trangThais = [this.searchFilter.trangThai];
		}
		let requestReport = {
			loaiTimKiem: "0",
			// maBcao: this.searchFilter.maBaoCao,
			// maDvi: this.searchFilter.donViTao,
			// namBcao: this.searchFilter.nam,
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
					this.danhSach = data.data.content;
					this.danhSach.forEach(e => {
						e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
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

	taoMoi() {
		// if (this.searchFilter.nam || this.searchFilter.nam === 0) {
		// 	if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
		// 		this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
		// 		return;
		// 	}
		// }
		// if (!this.searchFilter.nam){
		// 	this.router.navigate([
		// 		'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao',
		// 	]);
		// } else {
		// 	this.router.navigate([
		// 		'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao-/' + this.searchFilter.nam,
		// 	]);
		// }
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao/0/' + id,
		])
	}

	getStatusName(trangThai: string) {
		return this.trangThais.find(e => e.id == trangThai).tenDm;
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
		var check: boolean;
		if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8) &&
			this.userInfo?.username == item.nguoiTao) {
			check = true;
		} else {
			check = false;
		}
		return check;
	}

	close() {
		this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn'])
	}
}
