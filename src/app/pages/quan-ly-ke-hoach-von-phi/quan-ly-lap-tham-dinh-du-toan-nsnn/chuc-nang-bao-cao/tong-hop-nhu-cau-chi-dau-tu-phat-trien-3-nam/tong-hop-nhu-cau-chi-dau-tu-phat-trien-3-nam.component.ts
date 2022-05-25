import { DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { divMoney, DON_VI_TIEN, MONEY_LIMIT, mulMoney, QLNV_KHVONPHI_TC_THOP_DTOAN_CHI_TX_HNAM } from "../../../../../Utility/utils";
import { Role } from '../../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';



export class ItemData {
	id: any;
	stt!: number;
	maNdung: string;
	thNamHienHanhN1: number;
	ncauNamDtoanN: number;
	ncauNamN1: number;
	ncauNamN2: number;
	checked!: boolean;
}

@Component({
	selector: 'app-tong-hop-nhu-cau-chi-dau-tu-phat-trien-3-nam',
	templateUrl: './tong-hop-nhu-cau-chi-dau-tu-phat-trien-3-nam.component.html',
	styleUrls: ['../bao-cao/bao-cao.component.scss']
})
export class TongHopNhuCauChiDauTuPhatTrien3NamComponent implements OnInit {
	@Input() data;
	//@Output() output: EventEmitter<any> = new EventEmitter();
	//danh muc
	donVis: any = [];
	lstCtietBcao: ItemData[];
	donViTiens: any[] = DON_VI_TIEN;
	//thong tin chung
	tong: ItemData = {
		id: "",
		stt: 0,
		maNdung: "",
		thNamHienHanhN1: 0,
		ncauNamDtoanN: 0,
		ncauNamN1: 0,
		ncauNamN2: 0,
		checked: false,
	};
	id: any;
	trangThaiPhuLuc: string;
	namHienHanh: number;
	maBieuMau: string = "14";
	maDviTien: any;
	listIdDelete: string = "";
	thuyetMinh: string;
	//trang thai cac nut
	status: boolean = false;
	statusBtnFinish: boolean;
	statusBtnOk: boolean;

	allChecked = false;
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

	constructor(private router: Router,
		private routerActive: ActivatedRoute,
		private spinner: NgxSpinnerService,
		private quanLyVonPhiService: QuanLyVonPhiService,
		private datePipe: DatePipe,
		private sanitizer: DomSanitizer,
		private userService: UserService,
		private danhMucService: DanhMucHDVService,
		private notification: NzNotificationService,
		private location: Location,
		private fb: FormBuilder,
		private modal: NzModalService,
	) {
	}


	async ngOnInit() {
		this.id = this.data?.id;
		this.maBieuMau = this.data?.maBieuMau;
		this.maDviTien = this.data?.maDviTien;
		this.thuyetMinh = this.data?.thuyetMinh;
		this.trangThaiPhuLuc = this.data?.trangThai;
		this.namHienHanh = this.data?.namHienHanh;
		this.status = this.data?.status;
		this.statusBtnFinish = this.data?.statusBtnFinish;
		this.data?.lstCtietLapThamDinhs.forEach(item => {
			this.lstCtietBcao.push({
				...item,
				thNamHienHanhN1: divMoney(item.thNamHienHanhN1, this.maDviTien),
				ncauNamDtoanN: divMoney(item.ncauNamDtoanN, this.maDviTien),
				ncauNamN1: divMoney(item.ncauNamN1, this.maDviTien),
				ncauNamN2: divMoney(item.ncauNamN2, this.maDviTien),
			})
		})
		this.updateEditCache();

		//lay danh sach danh muc don vi
		await this.danhMucService.dMDonVi().toPromise().then(
			(data) => {
				if (data.statusCode == 0) {
					this.donVis = data.data;
				} else {
					this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
				}
			},
			(err) => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		);
		this.getStatusButton();
		this.spinner.hide();
	}

	getStatusButton() {
		if (this.data?.statusBtnOk && (this.trangThaiPhuLuc == "2" || this.trangThaiPhuLuc == "5")) {
			this.statusBtnOk = false;
		} else {
			this.statusBtnOk = true;
		}
	}

	// luu
	async save() {
		let checkSaveEdit;
		if (!this.maDviTien) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}
		//check xem tat ca cac dong du lieu da luu chua?
		//chua luu thi bao loi, luu roi thi cho di
		this.lstCtietBcao.forEach(element => {
			if (this.editCache[element.id].edit === true) {
				checkSaveEdit = false
			}
		});
		if (checkSaveEdit == false) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}
		//tinh lai don vi tien va kiem tra gioi han cua chung
		let lstCtietBcaoTemp: any = [];
		let checkMoneyRange = true;
		this.lstCtietBcao.forEach(item => {
			let thNamHienHanhN1 = mulMoney(item.thNamHienHanhN1, this.maDviTien);
			let ncauNamDtoanN = mulMoney(item.ncauNamDtoanN, this.maDviTien);
			let ncauNamN1 = mulMoney(item.ncauNamN1, this.maDviTien);
			let ncauNamN2 = mulMoney(item.ncauNamN2, this.maDviTien);
			if (thNamHienHanhN1 > MONEY_LIMIT || ncauNamDtoanN > MONEY_LIMIT ||
				ncauNamN1 > MONEY_LIMIT || ncauNamN2 > MONEY_LIMIT) {
				checkMoneyRange = false;
				return;
			}
			lstCtietBcaoTemp.push({
				...item,
				thNamHienHanhN1: thNamHienHanhN1,
				ncauNamDtoanN: ncauNamDtoanN,
				ncauNamN1: ncauNamN1,
				ncauNamN2: ncauNamN2,
			})
		})

		if (!checkMoneyRange == true) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			return;
		}
		// replace nhung ban ghi dc them moi id thanh null
		lstCtietBcaoTemp.forEach(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
		})

		let request = {
			id: this.id,
			lstCtietLapThamDinhs: lstCtietBcaoTemp,
			maBieuMau: this.maBieuMau,
			maDviTien: this.maDviTien,
			nguoiBcao: this.data?.nguoiBcao,
			lyDoTuChoi: this.data?.lyDoTuChoi,
			thuyetMinh: this.thuyetMinh,
			trangThai: this.trangThaiPhuLuc,
		};
		this.quanLyVonPhiService.updateLapThamDinh(request).toPromise().then(
			async data => {
				if (data.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			},
		);

		this.spinner.hide();
	}

	// them dong moi
	addLine(id: number): void {
		let item: ItemData = {
			id: uuid.v4(),
			stt: 0,
			maNdung: "",
			thNamHienHanhN1: 0,
			ncauNamDtoanN: 0,
			ncauNamN1: 0,
			ncauNamN2: 0,
			checked: false,
		}

		this.lstCtietBcao.splice(id, 0, item);
		this.editCache[item.id] = {
			edit: true,
			data: { ...item }
		};
	}

	// xoa dong
	deleteById(id: any): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id);
		this.tinhTong(-1, this.lstCtietBcao[index]);
		this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
		if (typeof id == "number") {
			this.listIdDelete += id + ",";
		}
	}

	// xóa với checkbox
	deleteSelected() {
		// add list delete id
		this.lstCtietBcao.forEach(item => {
			if (item.checked == true) {
				this.tinhTong(-1, item);
			}
			if (item.checked == true && typeof item.id == "number") {
				this.listIdDelete += item.id + ","
			}
		})
		// delete object have checked = true
		this.lstCtietBcao = this.lstCtietBcao.filter(item => item.checked != true)
		this.allChecked = false;
	}

	updateAllChecked(): void {
		if (this.allChecked) {
			this.lstCtietBcao = this.lstCtietBcao.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstCtietBcao = this.lstCtietBcao.map(item => ({
				...item,
				checked: false
			}));
		}
	}

	updateSingleChecked(): void {
		if (this.lstCtietBcao.every(item => !item.checked)) {
			this.allChecked = false;
		} else if (this.lstCtietBcao.every(item => item.checked)) {
			this.allChecked = true;
		}
	}

	redirectChiTieuKeHoachNam() {
		// this.router.navigate(['/qlkh-von-phi/quan-ly-lap-tham-dinh-du-toan-nsnn/tim-kiem']);
		this.location.back()
	}

	startEdit(id: string): void {
		this.editCache[id].edit = true;
	}

	// huy thay doi
	cancelEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
		if (!this.lstCtietBcao[index].maNdung) {
			this.deleteById(id);
			return;
		}
		this.editCache[id] = {
			data: { ...this.lstCtietBcao[index] },
			edit: false
		};
	}

	// luu thay doi
	saveEdit(id: string): void {
		if (!this.editCache[id].data.maNdung) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		this.editCache[id].data.checked = this.lstCtietBcao.find(item => item.id === id).checked; // set checked editCache = checked lstCtietBcao
		const index = this.lstCtietBcao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
		this.tinhTong(-1, this.lstCtietBcao[index]);
		this.tinhTong(1, this.editCache[id].data);
		Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
		this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
	}

	// gan editCache.data == lstCtietBcao
	updateEditCache(): void {
		this.lstCtietBcao.forEach(item => {
			this.editCache[item.id] = {
				edit: false,
				data: { ...item }
			};
		});
	}

	// changeModel(id: string): void {
	// 	let k: any = this.editCache[id].data;
	// 	this.editCache[id].data.k331KhongTchuCoDmucCong = k.k331KhongTchuCoDmucNx + k.k331KhongTchuCoDmucVtct + k.k331KhongTchuCoDmucBquan;
	// 	this.editCache[id].data.k331KhongTchuChuaDmucCong = k.k331KhongTchuChuaDmucCntt + k.k331KhongTchuChuaDmucThueKho + k.k331KhongTchuChuaDmucMsamTsan + k.k331KhongTchuChuaDmucBhiemHhoa + k.k331KhongTchuChuaDmucPhongChongMoiKplb + k.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem + k.k331KhongTchuChuaDmucSchuaKhoTang;
	// 	this.editCache[id].data.k331Tcong = k.k331KhongTchuCoDmucCong + k.k331KhongTchuChuaDmucCong;
	// 	this.editCache[id].data.k341Tcong = k.k341LuongTuChu + k.k341TxTheoDmucTuChu + k.k341ChiTxKhongDmucTuChu + k.k341LuongKhongTuChu + k.k341TxTheoDmucKhongTuChu + k.k341ChiTxKhongDmucKhongTuChu;
	// 	this.editCache[id].data.tongCong = k.k331Tcong + k.k341Tcong + k.k085DaoTao + k.k102NghienCuuKhoaHoc + k.k398DamBaoXaHoi;
	// }

	tinhTong(heSo: number, item: ItemData) {
		this.tong.thNamHienHanhN1 += heSo * item.thNamHienHanhN1;
		this.tong.ncauNamDtoanN += heSo * item.ncauNamDtoanN;
		this.tong.ncauNamN1 += heSo * item.ncauNamN1;
		this.tong.ncauNamN2 += heSo * item.ncauNamN2;
	}

}
