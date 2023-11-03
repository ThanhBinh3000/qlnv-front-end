
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { Roles, Status, Utils } from 'src/app/Utility/utils';
import { MESSAGE } from 'src/app/constants/message';
import { BaoCaoThucHienDuToanChiService } from 'src/app/services/quan-ly-von-phi/baoCaoThucHienDuToanChi.service';
import { UserService } from 'src/app/services/user.service';
import { Globals } from 'src/app/shared/globals';
import { Dtc, Search } from '../bao-cao-thuc-hien-du-toan-chi.constant';
import { DialogTaoMoiComponent } from '../dialog-tao-moi/dialog-tao-moi.component';

@Component({
	selector: 'app-danh-sach-bao-cao-thuc-hien-du-toan-chi',
	templateUrl: './danh-sach-bao-cao-thuc-hien-du-toan-chi.component.html',
})
export class DanhSachBaoCaoThucHienDuToanChiComponent implements OnInit {
	@Output() dataChange = new EventEmitter();
	Status = Status;
	Utils = Utils;
	Dtc = Dtc;

	searchFilter: Search = new Search();

	userInfo: any;
	trangThai!: string;
	totalElements = 0;
	totalPages = 0;
	statusNewReport = true;
	statusDelete = true;
	allChecked = false;
	dataTable: any[] = [];
	dataTableAll: any[] = [];

	constructor(
		private spinner: NgxSpinnerService,
		private baoCaoThucHienDuToanChiService: BaoCaoThucHienDuToanChiService,
		private notification: NzNotificationService,
		private modal: NzModalService,
		public userService: UserService,
		public globals: Globals,
	) { }

	async ngOnInit() {
		this.userInfo = this.userService.getUserLogin();
		this.spinner.show();
		//khoi tao gia tri mac dinh
		// const date = new Date();
		// this.searchFilter.ngayTaoDen = date.toDateString();
		// this.searchFilter.namBcao = date.getFullYear();
		// this.searchFilter.thangBcao = date.getMonth();
		// date.setMonth(date.getMonth() - 1);
		// this.searchFilter.ngayTaoTu = date.toDateString();
		// this.searchFilter.maLoaiBcao = Dtc.BC_DINH_KY;
		//check quyen va cac nut chuc nang
		this.statusNewReport = this.userService.isAccessPermisson(Roles.DTC.ADD_REPORT);
		this.statusDelete = this.userService.isAccessPermisson(Roles.DTC.DEL_REPORT) || this.userService.isAccessPermisson(Roles.DTC.DEL_SYNTH_REPORT);
		if (this.userService.isAccessPermisson(Roles.DTC.ADD_REPORT)) {
			this.trangThai = Status.TT_01;
		} else if (this.userService.isAccessPermisson(Roles.DTC.PASS_REPORT) || this.userService.isAccessPermisson(Roles.DTC.PASS_SYNTH_REPORT)) {
			this.trangThai = Status.TT_02;
		} else if (this.userService.isAccessPermisson(Roles.DTC.APPROVE_REPORT) || this.userService.isAccessPermisson(Roles.DTC.APPROVE_SYNTH_REPORT)) {
			this.trangThai = Status.TT_04;
		}
		this.search();
		this.spinner.hide();
	}

	async search() {
		this.spinner.show();
		this.searchFilter.trangThais = this.trangThai ? [this.trangThai] : [Status.TT_01, Status.TT_02, Status.TT_03, Status.TT_04, Status.TT_05, Status.TT_07, Status.TT_08, Status.TT_09]
		await this.baoCaoThucHienDuToanChiService.timBaoCao(this.searchFilter.request()).toPromise().then(res => {
			if (res.statusCode == 0) {
				this.dataTable = [];
				res.data.content.forEach(item => {
					this.dataTable.push({
						...item,
						isEdit: this.checkEditStatus(item),
						isDelete: this.checkDeleteStatus(item),
						checked: false,
					})
				})
				this.dataTableAll = cloneDeep(this.dataTable);
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

	//doi so trang
	onPageIndexChange(page) {
		this.searchFilter.paggingReq.page = page;
		this.search();
	}

	//doi so luong phan tu tren 1 trang
	onPageSizeChange(size) {
		this.searchFilter.paggingReq.limit = size;
		this.search();
	}

	//reset tim kiem
	clearFilter() {
		this.searchFilter.clear();
		this.trangThai = null;
		this.search();
	}

	checkEditStatus(item: any) {
		const isSynthetic = item.tongHopTu && item.tongHopTu != "[]";
		return Status.check('saveWHist', item.trangThai) &&
			(isSynthetic ? this.userService.isAccessPermisson(Roles.DTC.EDIT_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.EDIT_REPORT));
	}

	checkDeleteStatus(item: any) {
		const isSynthetic = item.tongHopTu && item.tongHopTu != "[]";
		return Status.check('saveWHist', item.trangThai) &&
			(isSynthetic ? this.userService.isAccessPermisson(Roles.DTC.DEL_SYNTH_REPORT) : this.userService.isAccessPermisson(Roles.DTC.DEL_REPORT));
	}

	//them moi bao cao
	addNewReport() {
		const modalTuChoi = this.modal.create({
			nzTitle: 'Thông tin tạo mới báo cáo thực hiện dự toán chi NSNN',
			nzContent: DialogTaoMoiComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '900px',
			nzFooter: null,
			nzComponentParams: {
				isSynth: false,
			},
		});
		modalTuChoi.afterClose.toPromise().then(async (res) => {
			if (res) {
				const obj = {
					id: null,
					baoCao: res,
					tabSelected: Dtc.BAO_CAO_01,
					isSynthetic: false,
				}
				this.dataChange.emit(obj);
			}
		});
	}

	//xem chi tiet bao cao
	viewDetail(data: any) {
		const obj = {
			id: data.id,
			tabSelected: Dtc.BAO_CAO_01,
		}
		this.dataChange.emit(obj);
	}


	updateAllChecked(): void {
		if (this.dataTable && this.dataTable.length > 0) {
			this.dataTable.forEach(item => {
				if (item.isDelete) {
					item.checked = this.allChecked;
				}
			})
		}
	}

	updateSingleChecked(): void {
		if (this.dataTable.every((item) => item.checked || !item.isDelete)) {
			this.allChecked = true;
		} else {
			this.allChecked = false;
		}
	}

	//Xoa bao cao
	deleteReport(id: string) {
		this.modal.confirm({
			nzClosable: false,
			nzTitle: 'Xác nhận',
			nzContent: 'Bạn có chắc chắn muốn xóa?',
			nzOkText: 'Đồng ý',
			nzCancelText: 'Không',
			nzOkDanger: true,
			nzWidth: 310,
			nzOnOk: () => {
				this.spinner.show();
				let request = [];
				if (id) {
					request = [id];
				} else {
					if (this.dataTable && this.dataTable.length > 0) {
						this.dataTable.forEach(item => {
							if (item.checked) {
								request.push(item.id);
							}
						})
					}
				}
				this.baoCaoThucHienDuToanChiService.xoaBaoCao(request).toPromise().then(
					data => {
						if (data.statusCode == 0) {
							this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
							this.search();
							this.allChecked = false;
						} else {
							this.notification.error(MESSAGE.ERROR, data?.msg);
						}
					},
					err => {
						this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
					}
				)
				this.spinner.hide();
			},
		});
	}
}
