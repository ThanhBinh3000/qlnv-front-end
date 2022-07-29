import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';

@Component({
	selector: 'app-phe-duyet',
	templateUrl: './phe-duyet.component.html',
	styleUrls: ['./phe-duyet.component.scss'],
})
export class PheDuyetComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	//thong tin tim kiem
	userRole: any;
	maDviTao: string;
	searchFilter = {
		loaiTimKiem: "",
		nam: null,
		tuNgay:null,
		denNgay: null,
		maBaoCao: "",
		donViTao: "",
		trangThai: "",
	};
	newDate = new Date();
	//danh muc
	danhSachBaoCao: any = [];
	trangThais: any[] = [];
	donVis: any[] = [];
	//phan trang
	totalElements = 0;
	totalPages = 0;
	pages = {
		size: 10,
		page: 1,
	}
	//trang thai
	status: boolean;

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
	) {
	}

	async ngOnInit() {
		this.maDviTao = this.userInfo?.dvql;
		this.searchFilter.denNgay = new Date();
		this.newDate.setMonth(this.newDate.getMonth() -1);
		this.searchFilter.tuNgay = this.newDate;

		const userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		//lay danh sach danh muc
		this.spinner.show();
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
		
		if (ROLE_CAN_BO.includes(this.userRole)) {
			this.status = false;
			this.searchFilter.trangThai = Utils.TT_BC_7;
			this.searchFilter.loaiTimKiem = '1';
			//this.donVis = this.donVis.filter(e => e?.maDviCha == this.maDviTao);
			this.trangThais.push({
				id: Utils.TT_BC_7,
				tenDm: "Mới",
			});
			this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_8));
			this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_9));
		} else {
			this.status = true;
			this.searchFilter.loaiTimKiem = '0';
			this.searchFilter.donViTao = this.maDviTao;
			if (ROLE_TRUONG_BO_PHAN.includes(this.userRole)) {
				this.searchFilter.trangThai = Utils.TT_BC_2;
				this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_2));
			} else {
				this.searchFilter.trangThai = Utils.TT_BC_4;
				this.trangThais.push(TRANG_THAI_TIM_KIEM.find(e => e.id == Utils.TT_BC_4));
			}
		}
		
		this.onSubmit();
		this.spinner.hide();
	}

	//get user info
	async getUserInfo(username: string) {
		await this.userService.getUserInfo(username).toPromise().then(
			(data) => {
				if (data?.statusCode == 0) {
					this.userInfo = data?.data;
					this.userRole = this.userInfo?.roles[0].code;
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
		if (this.searchFilter.nam || this.searchFilter.nam === 0) {
			if (this.searchFilter.nam >= 3000 || this.searchFilter.nam < 1000) {
				this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
				return;
			}
		}
		if (!ROLE_CAN_BO.includes(this.userRole)){
			this.searchFilter.loaiTimKiem = "0";
		} else {
			if (this.searchFilter.donViTao && this.searchFilter.donViTao != this.maDviTao){
				this.searchFilter.loaiTimKiem = "0";
			} else {
				this.searchFilter.loaiTimKiem = "1";
			}
		}
		let lstTrangThai = [];
		if (!this.searchFilter.trangThai){
			if (this.userInfo?.roles[0].code == Utils.NHAN_VIEN){
				lstTrangThai = [Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9];
			} else if (this.userInfo?.roles[0].code == Utils.TRUONG_BO_PHAN) {
				lstTrangThai = [Utils.TT_BC_2];
			} else {
				lstTrangThai = [Utils.TT_BC_4];
			}
		} else {
			lstTrangThai = [this.searchFilter.trangThai];
		}
		const requestReport = {
			loaiTimKiem: this.searchFilter.loaiTimKiem,
			maBcao: this.searchFilter.maBaoCao,
			maDvi: this.searchFilter.donViTao,
			namBcao: this.searchFilter.nam,
			ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
			ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
			paggingReq: {
				limit: this.pages.size,
				page: this.pages.page,
			},
			trangThais: lstTrangThai,
		};
		this.spinner.show();
		//let latest_date =this.datepipe.transform(this.tuNgay, 'yyyy-MM-dd');
		await this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.danhSachBaoCao = data.data.content;
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
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao/' + id,
		])
	}

	getStatusName(trangThai: string) {
		return this.trangThais.find(e => e.id == trangThai).tenDm;
	}

	getUnitName(maDvi: string){
		return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
	}

	close() {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn',
		])
	}
}
