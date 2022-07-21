import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { UserService } from 'src/app/services/user.service';
import { QUAN_LY_THONG_TIN_QUYET_TOAN_LIST } from './quan-ly-thong-tin-quyet-toan.constant';

@Component({
  selector: 'app-quan-ly-thong-tin-quyet-toan',
  templateUrl: './quan-ly-thong-tin-quyet-toan.component.html',
  styleUrls: ['./quan-ly-thong-tin-quyet-toan.component.scss'],
})
export class QuanLyThongTinQuyetToanComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false })

  //thong tin dang nhap
	userInfo: any;
	donVis: any[] = [];
	capDvi: string;

  QuanLyThongTinQuyetToanList = QUAN_LY_THONG_TIN_QUYET_TOAN_LIST;
  danhSach: any[] = [];


  constructor(
    private router: Router,
		private userService: UserService,
		private spinner: NgxSpinnerService,
		private notification: NzNotificationService,
		private danhMuc: DanhMucHDVService,
  ) { }

  async ngOnInit() {

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
		this.QuanLyThongTinQuyetToanList.forEach(data => {
			data.Role.forEach(item => {
				if (item?.role.includes(this.userInfo?.roles[0]?.code) && this.capDvi == item.unit){
					this.danhSach.push(data);
					return;
				}
			})
		})
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

  redirectThongTinChiTieuKeHoachNam() {
    this.router.navigate([
      '/kehoach/thong-tin-chi-tieu-ke-hoach-nam-cap-tong-cuc',
      1,
    ]);
  }
}
