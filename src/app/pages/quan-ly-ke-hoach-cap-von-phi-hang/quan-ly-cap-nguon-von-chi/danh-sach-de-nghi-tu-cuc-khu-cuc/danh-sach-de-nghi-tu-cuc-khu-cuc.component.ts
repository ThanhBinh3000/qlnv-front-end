import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { CVNC, LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';
import { CAP_VON_NGUON_CHI, MAIN_ROUTE_CAPVON } from '../../quan-ly-ke-hoach-von-phi-hang.constant';



@Component({
	selector: 'app-danh-sach-de-nghi-tu-cuc-khu-cuc',
	templateUrl: './danh-sach-de-nghi-tu-cuc-khu-cuc.component.html',
	styleUrls: ['./danh-sach-de-nghi-tu-cuc-khu-cuc.component.scss']
})
export class DanhSachDeNghiTuCucKhuVucComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	//thong tin tim kiem
	searchFilter = {
		loaiTimKiem: '1',
		trangThai: Utils.TT_BC_7,
		tuNgay: "",
		denNgay: "",
		qdChiTieu: "",
		loaiDn: "",
		maDviTao: "",
	};
	//danh muc
	danhSachBaoCao: any[] = [];
	trangThais: any[] = [
		{
			id: Utils.TT_BC_7,
			tenDm: "Lãnh đạo cấp dưới duyệt",
		}
	];
	donVis: any[] = [];
	loaiDns: any[] = LOAI_DE_NGHI;
	//phan trang
	totalElements = 0;
	totalPages = 0;
	pages = {
		size: 10,
		page: 1,
	}
	//trang thai
	statusBtnNew = true;
	statusSynthetic = true;

	constructor(
		private quanLyVonPhiService: QuanLyVonPhiService,
		private danhMuc: DanhMucHDVService,
		private router: Router,
		private datePipe: DatePipe,
		private userService: UserService,
		private notification: NzNotificationService,
		private location: Location,
		private spinner: NgxSpinnerService,
		private dataSource: DataService,
	) { }

	async ngOnInit() {
		this.userInfo = this.userService.getUserLogin();
		this.spinner.show();
		this.searchFilter.maDviTao = this.userInfo?.MA_DVI;
		this.statusSynthetic = !this.userService.isAccessPermisson(CVNC.ADD_SYNTHETIC_CKV);

		await this.dataSource.currentData.subscribe(obj => {
			this.searchFilter.qdChiTieu = obj?.qdChiTieu;
		})
		//lay danh sach danh muc
		this.danhMuc.dMDviCon().toPromise().then(
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
		this.onSubmit();
	}

	//search list bao cao theo tieu chi
	async onSubmit() {
		let trangThais = [];
		if (this.searchFilter.trangThai) {
			trangThais = [this.searchFilter.trangThai];
		}
		const requestReport = {
			loaiTimKiem: this.searchFilter.loaiTimKiem,
			maDvi: "",
			ngayTaoDen: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
			ngayTaoTu: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
			soQdChiTieu: this.searchFilter.qdChiTieu,
			loaiDn: this.searchFilter.loaiDn,
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
					this.danhSachBaoCao = data.data.content;
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

	tongHop() {
		this.statusBtnNew = false;
		if (!this.searchFilter.qdChiTieu) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		const obj = {
			qdChiTieu: this.searchFilter.qdChiTieu,
			maDvi: this.searchFilter.maDviTao,
		}
		this.dataSource.changeData(obj);
		this.router.navigate([
			MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/tong-hop-tu-cuc-khu-vuc'
		])
	}


	close() {
		this.location.back();
	}


	async xemChiTiet(id: string) {
		await this.quanLyVonPhiService.ctietDeNghi(id).toPromise().then(
			async (data) => {
				if (data.statusCode == 0) {
					if (data.data.loaiDn == Utils.HD_TRUNG_THAU) {
						this.router.navigate([
							MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/de-nghi-theo-quyet-dinh-trung-thau/' + id,
						])
					} else {
						this.router.navigate([
							MAIN_ROUTE_CAPVON + '/' + CAP_VON_NGUON_CHI + '/de-nghi-theo-quyet-dinh-don-gia-mua/' + id,
						])
					}
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);
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
		return this.trangThais.find(e => e.id == trangThai)?.tenDm;
	}

	getUnitName(maDvi: string) {
		return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
	}
}
