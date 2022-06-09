import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { UserService } from 'src/app/services/user.service';
import { CAN_CU_GIA, LOAI_DE_NGHI, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
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
	loai: string;
	//thong tin tim kiem
	searchFilter = {
		maDn: null,
		trangThai: "",
		tuNgay: "",
		denNgay: "",
		qdChiTieu: "",
		canCuGia: "",
		loaiDn: "",
		maDviTao: "",
		loaiTimKiem: "0",
	};
	capDvi: string;
	//danh muc
	danhSachBaoCao: any[] = [];
	trangThais: any[] = [
        {
            id: Utils.TT_BC_1,
            tenDm: "Đang soạn",
        },
        {
            id: Utils.TT_BC_4,
            tenDm: "Trình duyệt",
        },
        {
            id: Utils.TT_BC_5,
            tenDm: "Lãnh đạo từ chối",
        },
        {
            id: Utils.TT_BC_7,
            tenDm: "Lãnh đạo duyệt",
        },
        {
            id: Utils.TT_BC_8,
            tenDm: "Từ chối",
        },
        {
            id: Utils.TT_BC_9,
            tenDm: "Tiếp nhận",
        }
    ];
	donVis: any[] = [];
	loaiDns: any[] = LOAI_DE_NGHI;
	canCuGias: any[] = CAN_CU_GIA;
	//phan trang
	totalElements = 0;
	totalPages = 0;
	pages = {
		size: 10,
		page: 1,
	}
	//trangThai
	statusBtnNew: boolean = true;
	status: boolean;
	disable: boolean;

	constructor(
		private quanLyVonPhiService: QuanLyVonPhiService,
		private danhMuc: DanhMucHDVService,
		private routerActive: ActivatedRoute,
		private router: Router,
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
		this.searchFilter.maDviTao = this.userInfo?.dvql;

		if (this.loai == "0"){
			this.status = false;
		} else {
			this.status = true;
			if (this.userInfo?.roles[0]?.code == Utils.NHAN_VIEN){
				this.searchFilter.trangThai = Utils.TT_BC_6;
				this.trangThais = [{
					id: Utils.TT_BC_6,
					tenDm: "Mới",
				}]
			} else {
				this.searchFilter.trangThai = Utils.TT_BC_4;
			}
		}

		await this.danhMuc.dMDonVi().toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.donVis = data.data;
					this.capDvi = this.donVis.find(e => e.maDvi == this.userInfo?.dvql)?.capDvi;
				} else {
					this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		);

		if (this.capDvi == Utils.TONG_CUC) {
			this.searchFilter.canCuGia = Utils.HD_TRUNG_THAU;
			this.searchFilter.loaiDn = Utils.MUA_VTU;
			this.disable = true;
		} else {
			this.loaiDns = this.loaiDns.filter(e => e.id != Utils.MUA_VTU);
			this.disable = false;
		}

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

	//search list bao cao theo tieu chi
	async onSubmit() {
		this.statusBtnNew = true;
		let trangThais = [];
		if (this.searchFilter.trangThai) {
			trangThais = [this.searchFilter.trangThai];
		}
		let requestReport = {
			loaiTimKiem: this.searchFilter.loaiTimKiem,
			maDvi: this.searchFilter.maDviTao,
			ngayTaoDen: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
			ngayTaoTu: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
			soQdChiTieu: this.searchFilter.qdChiTieu,
			canCuVeGia: this.searchFilter.canCuGia,
			loaiDnghi: this.searchFilter.loaiDn,
			maDnghi: this.searchFilter.maDn,
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
		this.statusBtnNew = false;
		if (!this.searchFilter.qdChiTieu ||
			!this.searchFilter.canCuGia ||
			!this.searchFilter.loaiDn) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		if (this.searchFilter.canCuGia == Utils.HD_TRUNG_THAU) {
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/de-nghi-theo-quyet-dinh-trung-thau/' + this.searchFilter.loaiDn + '/' + this.searchFilter.qdChiTieu,
			])
		}
		else {
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/de-nghi-theo-quyet-dinh-don-gia-mua/' + this.searchFilter.loaiDn + '/' + this.searchFilter.qdChiTieu,
			])
		}
	}

	xemChiTiet(item: any) {
		if (item.canCuVeGia == Utils.HD_TRUNG_THAU){
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/de-nghi-theo-quyet-dinh-trung-thau/' + item.id,
			])
		} else {
			this.router.navigate([
				'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/de-nghi-theo-quyet-dinh-don-gia-mua/' + item.id,
			])
		}
	}

	getStatusName(trangThai: string) {
		return this.trangThais.find(e => e.id == trangThai)?.tenDm;
	}

	xoaDeNghi(id: any) {
		this.quanLyVonPhiService.xoaDeNghi(id).toPromise().then(
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
		if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8) &&
			this.userInfo?.username == item.nguoiTao) {
			check = true;
		} else {
			check = false;
		}
		return check;
	}
}
