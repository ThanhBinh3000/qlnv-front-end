import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { MAIN_ROUTE_KE_HOACH } from 'src/app/pages/ke-hoach/ke-hoach.constant';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { LBC_KET_QUA_THUC_HIEN_HANG_DTQG, ROLE_CAN_BO, ROLE_LANH_DAO, ROLE_TRUONG_BO_PHAN, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { BAO_CAO_KET_QUA, MAIN_ROUTE_BAO_CAO } from '../../bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg.constant';
@Component({
	selector: 'app-tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG',
	templateUrl: './tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component.html',
	styleUrls: ['./tim-kiem-bao-cao-thuc-hien-von-phi-hang-DTQG.component.scss']
})
export class TimKiemBaoCaoThucHienVonPhiHangDTQGComponent implements OnInit {
	listBcaoKqua: any[] = [];

	searchFilter = {
		maPhanBcao: '1',
		maDvi: '',
		ngayTaoTu: '',
		ngayTaoDen: '',
		trangThais: [],
		maBcao: '',
		maLoaiBcao: '',
		namBcao: null,
		thangBcao: null,
		dotBcao: '',
		paggingReq: {
			limit: 10,
			page: 1
		},
		str: "",
		loaiTimKiem: '0',
	}
	trangThais: any = TRANG_THAI_TIM_KIEM;
	trangThai!: string;
	listIdDelete: string[] = [];
	totalElements = 0;
	totalPages = 0;

	donViTaos: any = [];
	userInfo: any;
	roleUser: string;

	baoCaos: any = LBC_KET_QUA_THUC_HIEN_HANG_DTQG;
	statusBtnNew = true;
	statusThemMoi = true;

	constructor(
		private quanLyVonPhiService: QuanLyVonPhiService,
		private danhMuc: DanhMucHDVService,
		private router: Router,
		private datePipe: DatePipe,
		private notification: NzNotificationService,
		private location: Location,
		private spinner: NgxSpinnerService,
		private userService: UserService,
		private dataSource: DataService,
	) {
	}

	async ngOnInit() {
		const userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		if (ROLE_CAN_BO.includes(this.userInfo?.roles[0]?.code)) {
			this.trangThai = '1';
			this.roleUser = 'canbo';
			this.statusThemMoi = false;
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
		date.setMonth(date.getMonth() - 1);
		this.searchFilter.ngayTaoTu = date.toDateString();

		this.searchFilter.maLoaiBcao = '1';
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

	// lay ten don vi tao
	getUnitName(dvitao: any) {
		return this.donViTaos.find(item => item.maDvi == dvitao)?.tenDvi;
	}

	async onSubmit() {
		this.statusBtnNew = true;
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
				this.listBcaoKqua = [];
				res.data.content.forEach(item => {
					if (this.listIdDelete.findIndex(e => e == item.id) == -1) {
						this.listBcaoKqua.push({
							...item,
							checked: false,
						})
					} else {
						this.listBcaoKqua.push({
							...item,
							checked: true,
						})
					}
				})
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



	async themMoi() {
		this.statusBtnNew = false;
		if (!this.searchFilter.namBcao || !this.searchFilter.maLoaiBcao || (!this.searchFilter.dotBcao && this.searchFilter.maLoaiBcao == '1')) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		if (this.searchFilter.namBcao >= 3000 || this.searchFilter.namBcao < 1000) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.WRONG_FORMAT);
			return;
		}

		let check = false;
		const request = {
			maPhanBcao: '1',
			trangThais: [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_4, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_9],
			maLoaiBcao: this.searchFilter.maLoaiBcao,
			namBcao: this.searchFilter.namBcao,
			dotBcao: this.searchFilter.dotBcao,
			paggingReq: {
				limit: 10,
				page: 1
			},
			str: "",
			loaiTimKiem: '0',
		}
		await this.quanLyVonPhiService.timBaoCao(request).toPromise().then(res => {
			if (res.statusCode == 0) {
				// if (res.data.content?.length > 0){
				// 	check = true;
				// }
				check = !res.data?.empty;
			} else {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})

		if (check) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.EXIST_REPORT);
			return;
		}
		this.router.navigate([
			MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_BAO_CAO + '/' + BAO_CAO_KET_QUA + "/bao-cao/" + this.searchFilter.maLoaiBcao + '/' + (this.searchFilter.maLoaiBcao == '1' ? this.searchFilter.dotBcao : '0') + '/' + this.searchFilter.namBcao
		])
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
		const obj = {
			tabSelected: 'ketqua',
		}
		this.dataSource.changeData(obj);
		this.router.navigate([
			MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_BAO_CAO,
		])
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_BAO_CAO + '/' + BAO_CAO_KET_QUA + '/bao-cao/' + id,
		])
	}

	deleteCondition() {
		this.searchFilter.maBcao = null
		this.searchFilter.namBcao = null
		this.searchFilter.dotBcao = null
		this.searchFilter.ngayTaoTu = null
		this.searchFilter.ngayTaoDen = null
		this.searchFilter.maLoaiBcao = null
		this.trangThai = null
	}

	deleteReport(id) {
		let request: string[] = [];
		if (id) {
			request = [id];
		} else {
			request = this.listIdDelete;
		}
		this.quanLyVonPhiService.xoaBaoCao(request).toPromise().then(async res => {
			if (res.statusCode == 0) {
				this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
				this.listIdDelete = [];
				this.onSubmit();
			} else {
				this.notification.error(MESSAGE.ERROR, res?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		})
	}

	checkAll() {
		let check = true;
		this.listBcaoKqua.forEach(item => {
			if (item.checked) {
				check = false;
			}
		})
		return check;
	}

	changeListIdDelete(id: string) {
		if (this.listIdDelete.findIndex(e => e == id) == -1) {
			this.listIdDelete.push(id);
		} else {
			this.listIdDelete = this.listIdDelete.filter(e => e != id);
		}
	}

	updateAllCheck() {
		this.listBcaoKqua.forEach(item => {
			if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8)
				&& ROLE_CAN_BO.includes(this.userInfo?.roles[0].code)) {
				item.checked = true;
				this.listIdDelete.push(item.id);
			}
		})
	}

	// lay ten trang thai ban ghi
	getStatusName(id) {
		const utils = new Utils();
		return utils.getStatusName(id);
	}

	checkDeleteReport(item: any): boolean {
		let check: boolean;
		if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8) &&
			ROLE_CAN_BO.includes(this.userInfo?.roles[0].code)) {
			check = true;
		} else {
			check = false;
		}
		return check;
	}

	checkApprove(item: any): boolean {
		let check = false;
		if ((this.trangThai == Utils.TT_BC_2 && ROLE_TRUONG_BO_PHAN.includes(this.userInfo?.roles[0].code)) ||
			(this.trangThai == Utils.TT_BC_4 && ROLE_LANH_DAO.includes(this.userInfo?.roles[0].code))) {
			check = true;
		}
		const DviCha = this.donViTaos.find(e => e.maDvi == item.maDvi)?.maDviCha;
		if (this.trangThai == Utils.TT_BC_7 && ROLE_CAN_BO.includes(this.userInfo?.roles[0].code) && DviCha == this.userInfo?.dvql) {
			check = true;
		}
		return check;
	}

}
