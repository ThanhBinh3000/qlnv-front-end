import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DataService } from 'src/app/pages/quan-ly-ke-hoach-von-phi/quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg/data.service';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { NGUON_BAO_CAO, ROLE_CAN_BO, ROLE_TRUONG_BO_PHAN, TRANG_THAI_GUI_DVCT, TRANG_THAI_KIEM_TRA_BAO_CAO, Utils } from 'src/app/Utility/utils';



@Component({
	selector: 'app-tong-hop',
	templateUrl: './tong-hop.component.html',
	styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	userRole: any;
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
	statusBtnNew: boolean = true;
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
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info

		this.searchFilter.denNgay = new Date();
		let newDate = new Date();
		newDate.setMonth(newDate.getMonth() - 1);
		this.searchFilter.tuNgay = newDate;

		this.searchFilter.maDviTao = this.userInfo?.dvql;

		if (this.loai == "0") {
			this.status = false;
			this.disable = false;
		} else {
			this.status = true;
			this.disable = true;
			if (ROLE_TRUONG_BO_PHAN.includes(this.userRole)){
				this.searchFilter.trangThai = Utils.TT_BC_2;
			} else {
				this.searchFilter.trangThai = Utils.TT_BC_4;
			}
		}
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
		let requestReport = {
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
					this.danhSachBaoCao = data.data.content;
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
		if (this.searchFilter.loaiDn == Utils.THOP_TAI_TC) {
			let obj = {
				qdChiTieu: this.searchFilter.qdChiTieu,
			}
			this.dataSource.changeData(obj);
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/tong-hop-tai-tong-cuc'
			])
		} else {
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/danh-sach-de-nghi-tu-cuc-khu-cuc'
			])
		}
	}


	dong() {
		this.router.navigate([
			'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi',
		])
	}


	xemChiTiet(item: any) {
		if (item.loaiDnghi == Utils.THOP_TAI_TC) {
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/tong-hop-tai-tong-cuc/' + this.loai + '/' + item.id
			])
		} else {
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/tong-hop-tu-cuc-khu-vuc/' + this.loai + '/' + item.id
			])
		}
	}

	//doi so trang
	onPageIndexChange(page) {
		this.pages.page = page;
	}

	//doi so luong phan tu tren 1 trang
	onPageSizeChange(size) {
		this.pages.size = size;
	}
	redirectChiTieuKeHoachNam() {
		this.location.back()
	}

	getStatusName(trangThai: string) {
		return this.trangThais.find(e => e.id == trangThai)?.tenDm;
	}

	getUnitName(maDvi: string) {
		return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
	}

	xoaDeNghi(id: any) {
		this.quanLyVonPhiService.xoaDeNghiThop(id).toPromise().then(
			data => {
				if (data.statusCode == 0) {
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
}
