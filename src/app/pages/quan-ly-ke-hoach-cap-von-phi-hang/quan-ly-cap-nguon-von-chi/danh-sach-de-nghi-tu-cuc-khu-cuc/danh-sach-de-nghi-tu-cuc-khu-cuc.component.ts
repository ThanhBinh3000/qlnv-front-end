import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DataService } from 'src/app/pages/quan-ly-ke-hoach-von-phi/quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg/data.service';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import { LOAI_DE_NGHI, Utils } from 'src/app/Utility/utils';



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
		await this.getUserInfo(userName); //get user info
		this.searchFilter.maDviTao = this.userInfo?.dvql;
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
		
		let trangThais = [];
		if (this.searchFilter.trangThai){
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
		if (!this.searchFilter.qdChiTieu){
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		const obj = {
			qdChiTieu: this.searchFilter.qdChiTieu,
			maDvi: this.searchFilter.maDviTao,
		}
		this.dataSource.changeData(obj);
		this.router.navigate([
			'qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/tong-hop-tu-cuc-khu-vuc'
		])
	}


	close() {
		this.location.back();
    }


	async xemChiTiet(id: string) {
		await this.quanLyVonPhiService.ctietDeNghi(id).toPromise().then(
            async (data) => {
                if (data.statusCode == 0) {
                    if (data.data.loaiDn == Utils.HD_TRUNG_THAU){
                        this.router.navigate([
                            '/qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/de-nghi-theo-quyet-dinh-trung-thau/' + id,
                        ])
                    } else {
                        this.router.navigate([
                            '/qlcap-von-phi-hang/quan-ly-cap-nguon-von-chi/de-nghi-theo-quyet-dinh-don-gia-mua/' + id,
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
	}

	//doi so luong phan tu tren 1 trang
	onPageSizeChange(size) {
		this.pages.size = size;
	}
	redirectChiTieuKeHoachNam() {
		this.location.back()
	}

	getStatusName(trangThai: string){
		return this.trangThais.find(e => e.id == trangThai)?.tenDm;
	}

	getUnitName(maDvi: string){
		return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
	}

    checkDeleteReport(item: any): boolean{
		let check: boolean;
		if ((item.trangThai == Utils.TT_BC_1 || item.trangThai == Utils.TT_BC_3 || item.trangThai == Utils.TT_BC_5 || item.trangThai == Utils.TT_BC_8) &&
		this.userInfo?.username == item.nguoiTao){
			check = true;
		} else {
			check = false;
		}
		return check;
	}
}
