import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI, ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
@Component({
	selector: 'app-ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam',
	templateUrl: './ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam.component.html',
	styleUrls: ['./ds-bao-cao-tinh-hinh-sd-dtoan-thang-nam.component.scss']
})

export class DsBaoCaoTinhHinhSdDtoanThangNamComponent implements OnInit {

	totalElements = 0;
	totalPages = 0;
	errorMessage = "";
	url = '/bao-cao/';

	trangThais: any = TRANG_THAI_TIM_KIEM;
	trangThai!: string;
	listBcaoKqua: any[] = [];
	// lenght: any = 0;
	userInfo: any;
	roleUser: string;

	searchFilter = {
		maPhanBcao: '0',
		maDvi: '',
		ngayTaoTu: '',
		ngayTaoDen: '',
		trangThais: [],
		maBcao: '',
		maLoaiBcao: '526',
		namBcao: null,
		thangBcao: null,
		dotBcao: '',
		paggingReq: {
			limit: 10,
			page: 1
		},
		str: "",
		loaiTimKiem: '0',
	};

	donViTaos: any = [];
	baoCaos: any = LBC_QUY_TRINH_THUC_HIEN_DU_TOAN_CHI;
	constructor(
		private quanLyVonPhiService: QuanLyVonPhiService,
		private danhMuc: DanhMucHDVService,
		private router: Router,
		private datePipe: DatePipe,
		private notification: NzNotificationService,
		private location: Location,
		private spinner: NgxSpinnerService,
		private userService: UserService,
	) {
	}

	async ngOnInit(): Promise<void> {
		this.spinner.show();
		const userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		if (ROLE_CAN_BO.includes(this.userInfo?.roles[0]?.code)) {
			this.trangThai = '1';
			this.roleUser = 'canbo';
		} else if (ROLE_TRUONG_BO_PHAN.includes(this.userInfo?.roles[0]?.code)) {
			this.trangThai = '2';
			this.roleUser = 'truongBoPhan';
		} else if (ROLE_LANH_DAO.includes(this.userInfo?.roles[0]?.code)) {
			this.trangThai = '4';
			this.roleUser = 'lanhDao';
		}
		const date = new Date();
		this.searchFilter.ngayTaoDen = date.toDateString();
		this.searchFilter.namBcao = date.getFullYear();
		this.searchFilter.thangBcao = date.getMonth();
		date.setMonth(date.getMonth() - 1);
		this.searchFilter.ngayTaoTu = date.toDateString();
		this.searchFilter.maLoaiBcao = '526';
		this.onSubmit();
		//lay danh sach danh muc
		this.danhMuc.dMDonVi().toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.donViTaos = data.data;
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		);
		this.spinner.hide();
	}

	// lay ten don vi tao
	getUnitName(dvitao: string) {
		return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
	}

	//get user info
	async getUserInfo(username: string) {
		const userInfo = await this.userService.getUserInfo(username).toPromise().then(
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
		return userInfo;
	}

	async onSubmit() {
		this.spinner.show();
		const searchFilterTemp = Object.assign({}, this.searchFilter);
		searchFilterTemp.trangThais = [];
		searchFilterTemp.ngayTaoTu = this.datePipe.transform(searchFilterTemp.ngayTaoTu, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoTu;
		searchFilterTemp.ngayTaoDen = this.datePipe.transform(searchFilterTemp.ngayTaoDen, Utils.FORMAT_DATE_STR) || searchFilterTemp.ngayTaoDen;
		if (this.trangThai) {
			searchFilterTemp.trangThais.push(this.trangThai)
		} else {
			searchFilterTemp.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
		}
		await this.quanLyVonPhiService.timBaoCao(searchFilterTemp).toPromise().then(res => {
			if (res.statusCode == 0) {
				this.listBcaoKqua = res.data.content;
				this.listBcaoKqua.forEach(e => {
					e.ngayDuyet = this.datePipe.transform(e.ngayDuyet, Utils.FORMAT_DATE_STR);
					e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
					e.ngayTrinh = this.datePipe.transform(e.ngayTrinh, Utils.FORMAT_DATE_STR);
					e.ngayPheDuyet = this.datePipe.transform(e.ngayPheDuyet, Utils.FORMAT_DATE_STR);
					e.ngayTraKq = this.datePipe.transform(e.ngayTraKq, Utils.FORMAT_DATE_STR);
				})
				this.totalElements = res.data.totalElements;
				this.totalPages = res.data.totalPages;
			} else {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
		this.spinner.hide();
	}
	themMoi() {
		if (!this.searchFilter.namBcao || !this.searchFilter.maLoaiBcao || 
			(!this.searchFilter.thangBcao && (this.searchFilter.maLoaiBcao == '526' || this.searchFilter.maLoaiBcao == '528'))) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		if (this.searchFilter.namBcao >= 3000 || this.searchFilter.namBcao < 1000) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
			return;
		}

		this.router.navigate(["/qlkh-von-phi/quy-trinh-bc-thuc-hien-du-toan-chi-nsnn/" + this.url + '/' + this.searchFilter.maLoaiBcao + '/' + (this.searchFilter.maLoaiBcao != '527' ? this.searchFilter.thangBcao : '0') + '/' + this.searchFilter.namBcao])
	}

	//doi so trang
	onPageIndexChange(page) {
		this.searchFilter.paggingReq.page = page;
		this.onSubmit();
	}

	//doi so luong phan tu tren 1 trang
	onPageSizeChange(size) {
		this.searchFilter.paggingReq.limit = size;
		this.onSubmit();
	}

	close() {
		this.location.back();
	}

	deleteReport(id) {
		if (id) {
			this.quanLyVonPhiService.xoaBaoCao(id).toPromise().then(async res => {
				if (res.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
					this.onSubmit();
				} else {
					this.notification.error(MESSAGE.ERROR, res?.msg);
				}
			}, err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			})
		} else {
			this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING)
		}
	}

	// lay ten trang thai ban ghi
	getStatusName(id) {
		const utils = new Utils();
		return utils.getStatusName(id);
	}
}
