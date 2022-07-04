import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { UserService } from 'src/app/services/user.service';
import { QUAN_LY_CAP_NGUON_VON_CHI_NSNN_LIST } from './quan-ly-cap-nguon-von-chi.constant';

@Component({
	selector: 'app-quan-ly-dieu-chinh-du-toan-chi-nsnn',
	templateUrl: './quan-ly-cap-nguon-von-chi.component.html',
	styleUrls: ['./quan-ly-cap-nguon-von-chi.component.scss'],
})
export class QuanLyCapNguonVonChiNSNNComponent implements OnInit {
	@ViewChild('nzTreeComponent', { static: false })

	userInfo: any;

	donVis: any[] = [];
	capDvi: string;
	QuanLyCapVonNguonChiNsnnList = QUAN_LY_CAP_NGUON_VON_CHI_NSNN_LIST;
	danhSach: any[] = [];

	constructor(
		private router: Router,
		private userService: UserService,
		private notification: NzNotificationService,
		private danhMuc: DanhMucHDVService,
	) { }

	async ngOnInit(): Promise<void> {
		let userName = this.userService.getUserName();
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
		this.QuanLyCapVonNguonChiNsnnList.forEach(data => {
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
