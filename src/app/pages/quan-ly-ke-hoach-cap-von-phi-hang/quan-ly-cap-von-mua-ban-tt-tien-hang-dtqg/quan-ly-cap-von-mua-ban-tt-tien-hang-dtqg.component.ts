import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { QUAN_LY_CAP_VOM_MUA_BAN_TT_TIEN_HANG_DTQG_LIST } from './quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.constant';

@Component({
	selector: 'app-quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg',
	templateUrl: './quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.component.html',
	styleUrls: ['./quan-ly-cap-von-mua-ban-tt-tien-hang-dtqg.component.scss'],
})
export class QuanLyCapVonMuaBanTtTienHangDtqgComponent implements OnInit {
	@ViewChild('nzTreeComponent', { static: false })
	//thong tin chung
	userInfo: any;
	isTongCuc: boolean;
	danhSach: any[] = [];

	constructor(
		private router: Router,
		private userService: UserService,
		private spinner: NgxSpinnerService,
	) { }

	async ngOnInit(): Promise<void> {
		this.spinner.show();
		this.userInfo = this.userService.getUserLogin();
		this.isTongCuc = this.userService.isTongCuc();

		QUAN_LY_CAP_VOM_MUA_BAN_TT_TIEN_HANG_DTQG_LIST.forEach(data => {
			let check = false;
			data.Role.forEach(item => {
				if (this.userService.isAccessPermisson(item)) {
					check = true;
					return;
				}
			})
			const temp = data?.isDisabled ? data?.isDisabled.includes(this.userInfo.CAP_DVI) : true;
			if (check && temp) {
				this.danhSach.push(data);
			}
		})
		this.spinner.hide();
	}

	redirectThongTinChiTieuKeHoachNam() {
		this.router.navigate([
			'/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
			1,
		]);
	}
}
