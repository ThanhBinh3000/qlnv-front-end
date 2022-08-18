import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { ROLE_CAN_BO, Utils } from 'src/app/Utility/utils';
import * as uuid from "uuid";
import { DataService } from '../data.service';
import { LAP_THAM_DINH, MAIN_ROUTE_DU_TOAN, MAIN_ROUTE_KE_HOACH } from '../lap-tham-dinh.constant';


@Component({
	selector: 'app-tong-hop',
	templateUrl: './tong-hop.component.html',
	styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	//thong tin tim kiem
	namHienTai: number;
	trangThai: string = Utils.TT_BC_9;
	maDviTao: string;
	//danh muc
	danhSachBaoCao: any[] = [];
	trangThais: any[] = [
		{
			id: '9',
			ten: 'Tiếp nhận'
		},
		{
			id: '7',
			ten: 'Mới'
		},
		{
			id: '-1',
			ten: 'Chưa gửi đơn vị cấp trên'
		},
	];
	donVis: any[] = [];
	//phan trang
	totalElements = 0;
	totalPages = 0;
	pages = {
		size: 10,
		page: 1,
	}

	statusBtnValidate = true;
	statusTaoMoi = true;

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
		private dataSource: DataService,
	) { }

	async ngOnInit() {
		const userName = this.userService.getUserName();
		this.spinner.show();
		await this.getUserInfo(userName); //get user info
		this.maDviTao = this.userInfo?.dvql;
		//lay danh sach danh muc
		this.danhMuc.dMDonVi().toPromise().then(
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
		this.spinner.hide();

		if (ROLE_CAN_BO.includes(this.userInfo?.roles[0]?.code)) {
			this.statusTaoMoi = false;
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
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);
	}

	//search list bao cao theo tieu chi
	async onSubmit() {
		if (this.namHienTai >= 3000 || this.namHienTai < 1000) {
			this.statusBtnValidate = false;
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
			return;
		}
		this.statusBtnValidate = true;
		let trangThais: string[] = [];
		if (this.trangThai) {
			trangThais = [this.trangThai];
		} else[
			trangThais = [Utils.TT_BC_9, Utils.TT_BC_7]
		]
		const requestReport = {
			loaiTimKiem: "1",
			maDvi: this.maDviTao,
			namBcao: this.namHienTai,
			ngayTaoDen: "",
			ngayTaoTu: "",
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
					this.danhSachBaoCao = data.data.content;
					this.danhSachBaoCao.forEach(e => {
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

	async tongHop() {
		this.statusBtnValidate = false;
		if (!this.namHienTai) {
			this.notification.warning(MESSAGE.ERROR, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		if (this.namHienTai < 1000 || this.namHienTai > 2999) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
			return;
		}
		const request = {
			maDvi: this.maDviTao,
			namHienTai: this.namHienTai,
			lstLapThamDinhs: [],
			lstDviTrucThuoc: [],
		}
		this.spinner.show();
		await this.quanLyVonPhiService.tongHop(request).toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					request.lstLapThamDinhs = data.data.lstLapThamDinhs;
					request.lstDviTrucThuoc = data.data.lstBcaoDviTrucThuocs;
					request.lstLapThamDinhs.forEach(item => {
						if (!item.id) {
							item.id = uuid.v4() + 'FE';
						}
						item.nguoiBcao = this.userInfo?.username;
						item.maDviTien = '1';
					})
					request.lstDviTrucThuoc.forEach(item => {
						item.ngayDuyet = this.datePipe.transform(item.ngayDuyet, Utils.FORMAT_DATE_STR);
						item.ngayPheDuyet = this.datePipe.transform(item.ngayPheDuyet, Utils.FORMAT_DATE_STR);
					})
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		);
		this.spinner.hide();
		if (request.lstDviTrucThuoc?.length == 0) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOT_EXIST_REPORT);
			return;
		}
		this.dataSource.changeData(request);
		this.router.navigate([
			MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/bao-cao/',
		])
	}


	close() {
		this.router.navigate([
			MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN,
		])
	}


	xemChiTiet(id: string) {
		this.router.navigate([
			MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_DU_TOAN + '/' + LAP_THAM_DINH + '/bao-cao/1/' + id,
		])
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
		return this.trangThais.find(e => e.id == trangThai)?.ten;
	}

	getUnitName(maDvi: string) {
		return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
	}
}
