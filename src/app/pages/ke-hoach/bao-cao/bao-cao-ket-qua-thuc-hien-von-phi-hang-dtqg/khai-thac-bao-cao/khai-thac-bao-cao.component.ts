import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { DataService } from 'src/app/services/data.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { LBC_KET_QUA_THUC_HIEN_HANG_DTQG, TRANG_THAI_TIM_KIEM, Utils } from 'src/app/Utility/utils';
import { BAO_CAO_KET_QUA, MAIN_ROUTE_BAO_CAO, MAIN_ROUTE_KE_HOACH } from '../bao-cao-ket-qua-thuc-hien-von-phi-hang-dtqg.constant';

@Component({
	selector: 'app-khai-thac-bao-cao',
	templateUrl: './khai-thac-bao-cao.component.html',
	styleUrls: ['./khai-thac-bao-cao.component.scss']
})
export class KhaiThacBaoCaoComponent implements OnInit {

	@ViewChild('nzTreeComponent', { static: false })

	totalElements = 0;
	totalPages = 0;

	maDonVi: any;
	listBcaoKqua: any[] = [];

	trangThais: any = TRANG_THAI_TIM_KIEM;
	trangThai!: string;

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
	};


	pages = {
		size: 10,
		page: 1,
	}
	donViTaos: any = [];
	baoCaos: any = LBC_KET_QUA_THUC_HIEN_HANG_DTQG;
	constructor(
		private quanLyVonPhiService: QuanLyVonPhiService,
		private danhMuc: DanhMucHDVService,
		private router: Router,
		private datePipe: DatePipe,
		private notification: NzNotificationService,
		private spinner: NgxSpinnerService,
		private dataSource: DataService,
	) {
	}

	async ngOnInit(): Promise<void> {

	}

	async onSubmit() {
		this.spinner.show();
		this.searchFilter.trangThais = [];
		this.searchFilter.ngayTaoTu = this.datePipe.transform(this.searchFilter.ngayTaoTu, Utils.FORMAT_DATE_STR) || this.searchFilter.ngayTaoTu;
		this.searchFilter.ngayTaoDen = this.datePipe.transform(this.searchFilter.ngayTaoDen, Utils.FORMAT_DATE_STR) || this.searchFilter.ngayTaoDen;
		if (this.trangThai) {
			this.searchFilter.trangThais.push(this.trangThai)
		} else {
			this.searchFilter.trangThais = [Utils.TT_BC_1, Utils.TT_BC_2, Utils.TT_BC_3, Utils.TT_BC_4, Utils.TT_BC_5, Utils.TT_BC_6, Utils.TT_BC_7, Utils.TT_BC_8, Utils.TT_BC_9]
		}
		await this.quanLyVonPhiService.timBaoCao(this.searchFilter).toPromise().then(res => {
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


	//doi so trang
	onPageIndexChange(page) {
		this.pages.page = page;
	}

	//doi so luong phan tu tren 1 trang
	onPageSizeChange(size) {
		this.pages.size = size;
	}

	// lay ten trang thai ban ghi
	getStatusName(id) {
		const utils = new Utils();
		return utils.getStatusName(id);
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

	deleteCondition() {
		this.searchFilter.maBcao = null
		this.searchFilter.namBcao = null
		this.searchFilter.dotBcao = null
		this.searchFilter.ngayTaoTu = null
		this.searchFilter.ngayTaoDen = null
		this.searchFilter.maLoaiBcao = null
		this.trangThai = null
	}

	xemChiTiet(id: string) {
		this.router.navigate([
			MAIN_ROUTE_KE_HOACH + '/' + MAIN_ROUTE_BAO_CAO + '/' + BAO_CAO_KET_QUA + '/bao-cao/' + id,
		])
	}

}
