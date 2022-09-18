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
	roles: string[] = [];
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
		this.roles = this.userInfo?.roles;
		this.isTongCuc = this.userService.isTongCuc();
		console.log(this.roles.filter(e => e.startsWith('VONPHIHANG_VONMBANTT')))

		QUAN_LY_CAP_VOM_MUA_BAN_TT_TIEN_HANG_DTQG_LIST.forEach(data => {
			let check = false;
			data.Role.forEach(item => {
				if (this.roles.includes(item)) {
					check = true;
					return;
				}
			})
			const temp = data?.isDisabled ? data?.isDisabled == '1' : true;
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
