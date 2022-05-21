import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';
import { TRANGTHAIBAOCAO } from '../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';

@Component({
	selector: 'app-tim-kiem',
	templateUrl: './tim-kiem.component.html',
	styleUrls: ['./tim-kiem.component.scss'],
})
export class TimKiemComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	//thong tin tim kiem
	searchFilter = {
		nam: null,
		tuNgay: "",
		denNgay: "",
		maBaoCao: "",
		donViTao: "",
		trangThai: "",
	};
	//danh muc
	danhSachBaoCao: any[] = [];
	trangThais: any[] = TRANGTHAIBAOCAO;
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
		private notification: NzNotificationService,
		private fb: FormBuilder,
		private spinner: NgxSpinnerService,
		private userService: UserService,
	) {
	}

	async ngOnInit() {
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info

		this.searchFilter.donViTao = this.userInfo?.dvql;		
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
		let requestReport = {
			maBcao: this.searchFilter.maBaoCao,
			maDvi: this.searchFilter.donViTao,
			namBcao: this.searchFilter.nam,
			ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
			ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
			paggingReq: {
				limit: this.pages.size,
				page: this.pages.page,
			},
			str: "",
			trangThai: this.searchFilter.trangThai,
		};
		this.spinner.show();
		//let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
		await this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.danhSachBaoCao = data.data.content;
					this.danhSachBaoCao.forEach(e => {
						e.ngayTao = this.datePipe.transform(e.ngayTao, 'dd/MM/yyyy');
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
		if (!this.searchFilter.nam){
			this.router.navigate([
				'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao',
			]);
		} else {
			this.router.navigate([
				'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao/0/' + this.searchFilter.nam,
			]);
		}
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao/' + id,
		])
	}

	getStatusName(trangThai: string){
		return this.trangThais.find(e => e.id == trangThai).tenDm;
	}
}
