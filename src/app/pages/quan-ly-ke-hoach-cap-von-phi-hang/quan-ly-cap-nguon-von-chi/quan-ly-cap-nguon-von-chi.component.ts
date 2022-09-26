import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';
import { UserAPIService } from 'src/app/services/user/userApi.service';
import { QUAN_LY_CAP_NGUON_VON_CHI_NSNN_LIST } from './quan-ly-cap-nguon-von-chi.constant';

@Component({
	selector: 'app-quan-ly-dieu-chinh-du-toan-chi-nsnn',
	templateUrl: './quan-ly-cap-nguon-von-chi.component.html',
	styleUrls: ['./quan-ly-cap-nguon-von-chi.component.scss'],
})
export class QuanLyCapNguonVonChiNSNNComponent implements OnInit {
	@ViewChild('nzTreeComponent', { static: false })

	userInfo: any;
	user: any;

	donVis: any[] = [];
	capDvi: string;
	QuanLyCapVonNguonChiNsnnList = QUAN_LY_CAP_NGUON_VON_CHI_NSNN_LIST;
	danhSach: any[] = [];

	constructor(
		private router: Router,
		private userService: UserService,
		private spinner: NgxSpinnerService,
		private userApiService: UserAPIService,
	) { }

	async ngOnInit(): Promise<void> {
		this.userInfo = this.userService.getUserLogin();
		this.spinner.show();
		this.QuanLyCapVonNguonChiNsnnList.forEach(data => {
			let check = false;
			data.Role.forEach(item => {
				if (this.userService.isAccessPermisson(item)) {
					check = true;
					return;
				}
			})
			if (check) {
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
