import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { MESSAGE } from 'src/app/constants/message';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { UserService } from 'src/app/services/user.service';
import { QUAN_LY_THAM_DINH_DU_TOAN_NSNN_LIST } from './quan-ly-lap-tham-dinh-du-toan-nsnn.constant';
interface DataItem {
	name: string;
	age: number;
	street: string;
	building: string;
	number: number;
	companyAddress: string;
	companyName: string;
	gender: string;
}
@Component({
	selector: 'app-quan-ly-lap-tham-dinh-du-toan-nsnn',
	templateUrl: './quan-ly-lap-tham-dinh-du-toan-nsnn.component.html',
	styleUrls: ['./quan-ly-lap-tham-dinh-du-toan-nsnn.component.scss'],
})
export class QuanLyLapThamDinhDuToanNSNNComponent implements OnInit {
	@ViewChild('nzTreeComponent', { static: false })

	//thong tin dang nhap
	userInfo: any;
	donVis: any[] = [];
	capDvi: string;

	nzTreeComponent!: NzTreeComponent;
	visible = false;
	nodes: any = [];
	nodeDetail: any;
	listDonViDuoi = [];
	cureentNodeParent: any = [];
	datasNguoiDung: any = [];
	nodeSelected: any = [];
	listHTDV: any = [];
	listKPB: any = [];
	detailDonVi: FormGroup;
	noParent = true;
	searchValue = '';
	QuanLyLapThamDinhDuToanNSNNList = QUAN_LY_THAM_DINH_DU_TOAN_NSNN_LIST;
	searchFilter = {
		soDeXuat: '',
	};
	////////
	listOfData: DataItem[] = [];
	sortAgeFn = (a: DataItem, b: DataItem): number => a.age - b.age;
	nameFilterFn = (list: string[], item: DataItem): boolean =>
		list.some((name) => item.name.indexOf(name) !== -1);
	filterName = [
		{ text: 'Joe', value: 'Joe' },
		{ text: 'John', value: 'John' },
	];
	/////////

	constructor(
		private router: Router,
		private userService: UserService,
		private notification: NzNotificationService,
		private danhMuc: DanhMucHDVService,
	) { }

	async ngOnInit() {
		let userName = this.userService.getUserName();
		await this.getUserInfo(userName); //get user info
		//lay danh sach danh muc
		await this.danhMuc.dMDonVi().toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.donVis = data.data;
					this.donVis.forEach(item => {
						if (item.maDvi == this.userInfo?.dvql) {
							this.capDvi = item.capDvi;
							return;
						}
					})
				} else {
					this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		);
		this.QuanLyLapThamDinhDuToanNSNNList.forEach(data => {
			data.unRole.forEach(item => {
				if (this.userInfo?.roles[0]?.code == item.role && this.capDvi == item.unit){
					data.isDisabled = true;
					return;
				}
			})
		})
		this.QuanLyLapThamDinhDuToanNSNNList = this.QuanLyLapThamDinhDuToanNSNNList.filter(item => item.isDisabled == false);
		/////////
		const data = [];
		for (let i = 0; i < 100; i++) {
			data.push({
				name: 'John Brown',
				age: i + 1,
				street: 'Lake Park',
				building: 'C',
				number: 2035,
				companyAddress: 'Lake Street 42',
				companyName: 'SoftLake Co',
				gender: 'M',
			});
		}
		this.listOfData = data;
		//////////////
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
