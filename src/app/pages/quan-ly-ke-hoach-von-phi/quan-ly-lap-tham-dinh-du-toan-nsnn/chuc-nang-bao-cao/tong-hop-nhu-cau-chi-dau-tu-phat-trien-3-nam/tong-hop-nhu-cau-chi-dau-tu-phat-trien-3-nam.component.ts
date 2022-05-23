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
import { DON_VI_TIEN, QLNV_KHVONPHI_TC_THOP_DTOAN_CHI_TX_HNAM } from "../../../../../Utility/utils";
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
	lstCTietBCao: ItemData[];
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

	trangThaiPhuLuc: string = '2';
	namHienHanh: number;
	maLoaiBaoCao: string = "14";
	maDviTien: any;
	listIdDelete: string = "";
	thuyetMinh: string;
	//trang thai cac nut
	status: boolean = false;
	statusBtnDone: boolean;
	statusBtnOK: boolean;
	statusBtnSave: boolean;

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
		this.namHienHanh = this.data.namHienHanh;
		this.lstCTietBCao = this.data?.lstCtietLapThamDinhs;
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
		const roles = new Role();
		this.statusBtnDone = roles.getRoleDone(this.trangThaiPhuLuc, 3);
		this.statusBtnOK = roles.getRoleOK(this.trangThaiPhuLuc, 3);
		this.statusBtnSave = roles.getRoleSaveBM(this.trangThaiPhuLuc, 3);
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

		this.lstCTietBCao.splice(id, 0, item);
		this.editCache[item.id] = {
			edit: true,
			data: { ...item }
		};
	}

	// xoa dong
	deleteById(id: any): void {
		const index = this.lstCTietBCao.findIndex(item => item.id === id);
		this.tinhTong(-1, this.lstCTietBCao[index]);
		this.lstCTietBCao = this.lstCTietBCao.filter(item => item.id != id)
		if (typeof id == "number") {
			this.listIdDelete += id + ",";
		}
	}

	// xóa với checkbox
	deleteSelected() {
		// add list delete id
		this.lstCTietBCao.forEach(item => {
			if (item.checked == true) {
				this.tinhTong(-1, item);
			}
			if (item.checked == true && typeof item.id == "number") {
				this.listIdDelete += item.id + ","
			}
		})
		// delete object have checked = true
		this.lstCTietBCao = this.lstCTietBCao.filter(item => item.checked != true)
		this.allChecked = false;
	}

	updateAllChecked(): void {
		if (this.allChecked) {
			this.lstCTietBCao = this.lstCTietBCao.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstCTietBCao = this.lstCTietBCao.map(item => ({
				...item,
				checked: false
			}));
		}
	}

	updateSingleChecked(): void {
		if (this.lstCTietBCao.every(item => !item.checked)) {
			this.allChecked = false;
		} else if (this.lstCTietBCao.every(item => item.checked)) {
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
		const index = this.lstCTietBCao.findIndex(item => item.id === id);  // lay vi tri hang minh sua
		if (!this.lstCTietBCao[index].maNdung) {
			this.deleteById(id);
			return;
		}
		this.editCache[id] = {
			data: { ...this.lstCTietBCao[index] },
			edit: false
		};
	}

	// luu thay doi
	saveEdit(id: string): void {
		if (!this.editCache[id].data.maNdung) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTEMPTYS);
			return;
		}
		this.editCache[id].data.checked = this.lstCTietBCao.find(item => item.id === id).checked; // set checked editCache = checked lstCTietBCao
		const index = this.lstCTietBCao.findIndex(item => item.id === id);   // lay vi tri hang minh sua
		this.tinhTong(-1, this.lstCTietBCao[index]);
		this.tinhTong(1, this.editCache[id].data);
		Object.assign(this.lstCTietBCao[index], this.editCache[id].data); // set lai data cua lstCTietBCao[index] = this.editCache[id].data
		this.editCache[id].edit = false;  // CHUYEN VE DANG TEXT
	}

	// gan editCache.data == lstCTietBCao
	updateEditCache(): void {
		this.lstCTietBCao.forEach(item => {
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
