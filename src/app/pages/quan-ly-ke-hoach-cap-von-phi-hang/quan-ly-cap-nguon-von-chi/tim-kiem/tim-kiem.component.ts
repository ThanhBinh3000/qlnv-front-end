import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { DanhMucHDVService } from '../../../../services/danhMucHDV.service';
import { QuanLyVonPhiService } from '../../../../services/quanLyVonPhi.service';

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
		maDn: null,
        trangThai: "",
        tuNgay: "",
        denNgay: "",
        qdChiTieu: "",
        qdTrungThau: "",
        qdDonGiaMua: "",
        loaiDn: "",
        maDviTao: "",
        loaiTimKiem: "0",
	};
	//danh muc
	danhSachBaoCao: any[] = [];
	trangThais: any[] = TRANG_THAI_TIM_KIEM;
	loaiDns: any[] = [];
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

		this.searchFilter.maDviTao = this.userInfo?.dvql;	
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
		let trangThais = [];
		if (this.searchFilter.trangThai){
			trangThais = [this.searchFilter.trangThai];
		}
		let requestReport = {
			loaiTimKiem: this.searchFilter.loaiTimKiem,
			maDvi: this.searchFilter.maDviTao,
			ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
			ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
            qdChiTieu: this.searchFilter.qdChiTieu,
            qdTrungThau: this.searchFilter.qdTrungThau,
            qdDonGiaMua: this.searchFilter.qdDonGiaMua,
            loaiDn: this.searchFilter.loaiDn,
			paggingReq: {
				limit: this.pages.size,
				page: this.pages.page,
			},
			trangThais: trangThais,
		};
		this.spinner.show();
		await this.quanLyVonPhiService.timBaoCaoLapThamDinh(requestReport).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.danhSachBaoCao = data.data.content;
					this.danhSachBaoCao.forEach(e => {
						e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
						e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
						e.ngayTrinhDuyet = this.datePipe.transform(e.ngayTrinhDuyet, Utils.FORMAT_DATE_STR);
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
		this.searchFilter.maDn =  null
        this.searchFilter.trangThai = null
        this.searchFilter.tuNgay = null
        this.searchFilter.denNgay = null
        this.searchFilter.qdChiTieu = null
        this.searchFilter.qdTrungThau = null
        this.searchFilter.qdDonGiaMua = null
        this.searchFilter.loaiDn = null
	}

	taoMoi() {
		
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao/' + id,
		])
	}

	getStatusName(trangThai: string){
		return this.trangThais.find(e => e.id == trangThai).tenDm;
	}

	xoaBaoCao(id: any){
		this.quanLyVonPhiService.xoaBaoCaoLapThamDinh(id).toPromise().then(
			data => {
				if (data.statusCode == 0){
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
	}

	checkDeleteReport(item: any): boolean{
		var check: boolean;
		if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8) &&
		this.userInfo?.username == item.nguoiTao){
			check = true;
		} else {
			check = false;
		}
		return check;
	}
}
