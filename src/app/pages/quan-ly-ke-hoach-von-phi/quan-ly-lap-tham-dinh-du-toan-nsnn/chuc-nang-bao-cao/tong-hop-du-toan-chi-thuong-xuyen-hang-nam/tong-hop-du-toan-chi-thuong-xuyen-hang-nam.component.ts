import { DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as fileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { MESSAGE } from 'src/app/constants/message';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from "uuid";
import { DanhMucHDVService } from '../../../../../services/danhMucHDV.service';
import { DONVITIEN, mulMoney, QLNV_KHVONPHI_TC_THOP_DTOAN_CHI_TX_HNAM, Utils } from "../../../../../Utility/utils";
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DialogCopyComponent } from 'src/app/components/dialog/dialog-copy/dialog-copy.component';
import { Role } from '../../quan-ly-lap-tham-dinh-du-toan-nsnn.constant';



export class ItemData {
	id: any;
	stt!: number;
	maDvi!: string;
	tongCong!: number;
	k331Tcong!: number;
	k331KhongTchuCoDmucCong!: number;
	k331KhongTchuCoDmucNx!: number;
	k331KhongTchuCoDmucVtct!: number;
	k331KhongTchuCoDmucBquan!: number;
	k331KhongTchuChuaDmucCong!: number;
	k331KhongTchuChuaDmucCntt!: number;
	k331KhongTchuChuaDmucThueKho!: number;
	k331KhongTchuChuaDmucMsamTsan!: number;
	k331KhongTchuChuaDmucBhiemHhoa!: number;
	k331KhongTchuChuaDmucPhongChongMoiKplb!: number;
	k331KhongTchuChuaDmucVchuyenBquanTsanQhiem!: number;
	k331KhongTchuChuaDmucSchuaKhoTang!: number;
	k341Tcong!: number;
	k341LuongTuChu!: number;
	k341TxTheoDmucTuChu!: number;
	k341ChiTxKhongDmucTuChu!: number;
	k341LuongKhongTuChu!: number;
	k341TxTheoDmucKhongTuChu!: number;
	k341ChiTxKhongDmucKhongTuChu!: number;
	k085DaoTao!: number;
	k102NghienCuuKhoaHoc!: number;
	k398DamBaoXaHoi!: number;
	checked!: boolean;
}

@Component({
	selector: 'app-tong-hop-du-toan-chi-thuong-xuyen-hang-nam',
	templateUrl: './tong-hop-du-toan-chi-thuong-xuyen-hang-nam.component.html',
	styleUrls: ['../bao-cao/bao-cao.component.scss']
})
export class TongHopDuToanChiThuongXuyenHangNamComponent implements OnInit {
	@Input() data;
	//@Output() output: EventEmitter<any> = new EventEmitter();
	//danh muc
	donVis: any = [];
	lstCTietBCao: ItemData[];
	donViTiens: any[] = DONVITIEN;
	//thong tin chung
	tong: ItemData = {
		id: "",
		stt: 0,
		maDvi: "",
		tongCong: 0,
		k331Tcong: 0,
		k331KhongTchuCoDmucCong: 0,
		k331KhongTchuCoDmucNx: 0,
		k331KhongTchuCoDmucVtct: 0,
		k331KhongTchuCoDmucBquan: 0,
		k331KhongTchuChuaDmucCong: 0,
		k331KhongTchuChuaDmucCntt: 0,
		k331KhongTchuChuaDmucThueKho: 0,
		k331KhongTchuChuaDmucMsamTsan: 0,
		k331KhongTchuChuaDmucBhiemHhoa: 0,
		k331KhongTchuChuaDmucPhongChongMoiKplb: 0,
		k331KhongTchuChuaDmucVchuyenBquanTsanQhiem: 0,
		k331KhongTchuChuaDmucSchuaKhoTang: 0,
		k341Tcong: 0,
		k341LuongTuChu: 0,
		k341TxTheoDmucTuChu: 0,
		k341ChiTxKhongDmucTuChu: 0,
		k341LuongKhongTuChu: 0,
		k341TxTheoDmucKhongTuChu: 0,
		k341ChiTxKhongDmucKhongTuChu: 0,
		k085DaoTao: 0,
		k102NghienCuuKhoaHoc: 0,
		k398DamBaoXaHoi: 0,
		checked!: false,
	};

	trangThaiPhuLuc: string = '2';
	namBcao: any;
	maLoaiBaoCao: string = QLNV_KHVONPHI_TC_THOP_DTOAN_CHI_TX_HNAM;
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

		this.lstCTietBCao = this.data?.lstCTiet;
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
			maDvi: "",
			tongCong: 0,
			k331KhongTchuCoDmucNx: 0,
			k331KhongTchuCoDmucVtct: 0,
			k331KhongTchuCoDmucBquan: 0,
			k331KhongTchuCoDmucCong: 0, // 3=4+5+6
			k331KhongTchuChuaDmucCntt: 0,
			k331KhongTchuChuaDmucThueKho: 0,
			k331KhongTchuChuaDmucMsamTsan: 0,
			k331KhongTchuChuaDmucBhiemHhoa: 0,
			k331KhongTchuChuaDmucPhongChongMoiKplb: 0,
			k331KhongTchuChuaDmucVchuyenBquanTsanQhiem: 0,
			k331KhongTchuChuaDmucSchuaKhoTang: 0,
			k331KhongTchuChuaDmucCong: 0,
			k331Tcong: 0, //2=3+7
			k341Tcong: 0,
			k341LuongTuChu: 0,
			k341TxTheoDmucTuChu: 0,
			k341ChiTxKhongDmucTuChu: 0,
			k341LuongKhongTuChu: 0,
			k341TxTheoDmucKhongTuChu: 0,
			k341ChiTxKhongDmucKhongTuChu: 0,
			k085DaoTao: 0,
			k102NghienCuuKhoaHoc: 0,
			k398DamBaoXaHoi: 0,
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
		if (!this.lstCTietBCao[index].maDvi) {
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
		if (!this.editCache[id].data.maDvi) {
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

	changeModel(id: string): void {
		let k: any = this.editCache[id].data;
		this.editCache[id].data.k331KhongTchuCoDmucCong = k.k331KhongTchuCoDmucNx + k.k331KhongTchuCoDmucVtct + k.k331KhongTchuCoDmucBquan;
		this.editCache[id].data.k331KhongTchuChuaDmucCong = k.k331KhongTchuChuaDmucCntt + k.k331KhongTchuChuaDmucThueKho + k.k331KhongTchuChuaDmucMsamTsan + k.k331KhongTchuChuaDmucBhiemHhoa + k.k331KhongTchuChuaDmucPhongChongMoiKplb + k.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem + k.k331KhongTchuChuaDmucSchuaKhoTang;
		this.editCache[id].data.k331Tcong = k.k331KhongTchuCoDmucCong + k.k331KhongTchuChuaDmucCong;
		this.editCache[id].data.k341Tcong = k.k341LuongTuChu + k.k341TxTheoDmucTuChu + k.k341ChiTxKhongDmucTuChu + k.k341LuongKhongTuChu + k.k341TxTheoDmucKhongTuChu + k.k341ChiTxKhongDmucKhongTuChu;
		this.editCache[id].data.tongCong = k.k331Tcong + k.k341Tcong + k.k085DaoTao + k.k102NghienCuuKhoaHoc + k.k398DamBaoXaHoi;
	}

	tinhTong(heSo: number, item: ItemData) {
		this.tong.tongCong += heSo * item.tongCong;
		this.tong.k331Tcong += heSo * item.k331Tcong;
		this.tong.k331KhongTchuCoDmucCong += heSo * item.k331KhongTchuCoDmucCong;
		this.tong.k331KhongTchuCoDmucNx += heSo * item.k331KhongTchuCoDmucNx;
		this.tong.k331KhongTchuCoDmucVtct += heSo * item.k331KhongTchuCoDmucVtct;
		this.tong.k331KhongTchuCoDmucBquan += heSo * item.k331KhongTchuCoDmucBquan;
		this.tong.k331KhongTchuChuaDmucCong += heSo * item.k331KhongTchuChuaDmucCong;
		this.tong.k331KhongTchuChuaDmucCntt += heSo * item.k331KhongTchuChuaDmucCntt;
		this.tong.k331KhongTchuChuaDmucThueKho += heSo * item.k331KhongTchuChuaDmucThueKho;
		this.tong.k331KhongTchuChuaDmucMsamTsan += heSo * item.k331KhongTchuChuaDmucMsamTsan;
		this.tong.k331KhongTchuChuaDmucBhiemHhoa += heSo * item.k331KhongTchuChuaDmucBhiemHhoa;
		this.tong.k331KhongTchuChuaDmucPhongChongMoiKplb += heSo * item.k331KhongTchuChuaDmucPhongChongMoiKplb;
		this.tong.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem += heSo * item.k331KhongTchuChuaDmucVchuyenBquanTsanQhiem;
		this.tong.k331KhongTchuChuaDmucSchuaKhoTang += heSo * item.k331KhongTchuChuaDmucSchuaKhoTang;
		this.tong.k341Tcong += heSo * item.k341Tcong;
		this.tong.k341LuongTuChu += heSo * item.k341LuongTuChu;
		this.tong.k341TxTheoDmucTuChu += heSo * item.k341TxTheoDmucTuChu;
		this.tong.k341ChiTxKhongDmucTuChu += heSo * item.k341ChiTxKhongDmucTuChu;
		this.tong.k341LuongKhongTuChu += heSo * item.k341LuongKhongTuChu;
		this.tong.k341TxTheoDmucKhongTuChu += heSo * item.k341TxTheoDmucKhongTuChu;
		this.tong.k341ChiTxKhongDmucKhongTuChu += heSo * item.k341ChiTxKhongDmucKhongTuChu;
		this.tong.k085DaoTao += heSo * item.k085DaoTao;
		this.tong.k102NghienCuuKhoaHoc += heSo * item.k102NghienCuuKhoaHoc;
		this.tong.k398DamBaoXaHoi += heSo * item.k398DamBaoXaHoi;
	}

}
