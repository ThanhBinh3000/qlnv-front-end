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
import { TRANG_THAI_GUI_DVCT, TRANG_THAI_KIEM_TRA_BAO_CAO, Utils } from 'src/app/Utility/utils';



@Component({
	selector: 'app-tong-hop',
	templateUrl: './tong-hop.component.html',
	styleUrls: ['./tong-hop.component.scss']
})
export class TongHopComponent implements OnInit {
	//thong tin dang nhap
	userInfo: any;
	//thong tin tim kiem
	searchFilter = {
        loaiTimKiem: '1',
        maDeNghi: "",
        trangThai: "",
        tuNgay: "",
        denNgay: "",
        qdChiTieu: "",
        loaiDn: "",
        maDviTao: "",
    };
	//danh muc
	danhSachBaoCao: any[] = [];
	trangThais: any[] = TRANG_THAI_KIEM_TRA_BAO_CAO;
	donVis: any[] = [];
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
		private userService: UserService,
		private notification: NzNotificationService,
		private fb: FormBuilder,
		private location: Location,
		private spinner: NgxSpinnerService,
	) { }

	async ngOnInit() {
		let userName = this.userService.getUserName();
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
		let requestReport = {
			loaiTimKiem: this.searchFilter.loaiTimKiem,
			maDvi: this.searchFilter.maDviTao,
			ngayTaoDen: this.datePipe.transform(this.searchFilter.tuNgay, Utils.FORMAT_DATE_STR),
			ngayTaoTu: this.datePipe.transform(this.searchFilter.denNgay, Utils.FORMAT_DATE_STR),
            qdChiTieu: this.searchFilter.qdChiTieu,
            loaiDn: this.searchFilter.loaiDn,
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
						e.ngayTao = this.datePipe.transform(e.ngayTao, Utils.FORMAT_DATE_STR);
						e.ngayTrinhDuyet = this.datePipe.transform(e.ngayTrinhDuyet, Utils.FORMAT_DATE_STR);
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

	tongHop() {
		
		// this.router.navigate([
		// 	'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao-/' + this.maDviTao + '/' + this.namHienTai,
		// ])
	}


	dong() {
		this.location.back();
	}


	xemChiTiet(id: string) {
		// this.router.navigate([
		// 	'/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/bao-cao/1/' + id,
		// ])
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
		return this.trangThais.find(e => e.id == trangThai)?.ten;
	}

	getUnitName(maDvi: string){
		return this.donVis.find(e => e.maDvi == maDvi)?.tenDvi;
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
