import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { UserService } from 'src/app/services/user.service';
import { ROLE_CAN_BO, Utils } from 'src/app/Utility/utils';

@Component({
	selector: 'app-quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc',
	templateUrl: './quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.component.html',
	styleUrls: ['./quy-trinh-bao-ket-qua-THVP-hang-DTQG-tai-tong-cuc.component.scss'],
})
export class QuytrinhbaocaoketquaTHVPhangDTQGtaitongtucComponent implements OnInit {
	@ViewChild('nzTreeComponent', { static: false })
	nzTreeComponent!: NzTreeComponent;

	statusSearch = true;
	statusApprove = false;
	statusCheck = false;
	statusSynthetic = false; 
	statusExploit = false;

	userInfo: any;
	donVis: any[] = [];
	capDvi: string;

	constructor(
		private router: Router,
		private userService: UserService,
		private spinner: NgxSpinnerService,
		private notification: NzNotificationService,
		private danhMuc: DanhMucHDVService,
	) { }

	async ngOnInit(): Promise<void> {
		this.spinner.show();
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
		if (ROLE_CAN_BO.includes(this.userInfo?.roles[0]?.code) && (this.capDvi != Utils.CHI_CUC)){
			this.statusApprove = true;
			this.statusCheck = true;
			this.statusSynthetic = true;
		}
		if (ROLE_CAN_BO.includes(this.userInfo?.roles[0]?.code) && (this.capDvi == Utils.TONG_CUC)){
			this.statusExploit = true;
		}
		this.spinner.hide();
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
}
