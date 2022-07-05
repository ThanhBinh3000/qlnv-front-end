import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
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
	capDvi: string;
	donVis: any[] = [];
	danhSach: any[] = [];

	constructor(
		private router: Router,
		private userService: UserService,
		private notification: NzNotificationService,
		private danhMuc: DanhMucHDVService,
	) { }

	async ngOnInit(): Promise<void> {
		const userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		//lay danh sach danh muc
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

		QUAN_LY_CAP_VOM_MUA_BAN_TT_TIEN_HANG_DTQG_LIST.forEach(data => {
			data.Role.forEach(item => {
				if (item.role.includes(this.userInfo?.roles[0]?.code) && this.capDvi == item.unit) {
					this.danhSach.push(data);
					return;
				}
			})
		})
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

	redirectThongTinChiTieuKeHoachNam() {
		this.router.navigate([
			'/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
			1,
		]);
	}
}
