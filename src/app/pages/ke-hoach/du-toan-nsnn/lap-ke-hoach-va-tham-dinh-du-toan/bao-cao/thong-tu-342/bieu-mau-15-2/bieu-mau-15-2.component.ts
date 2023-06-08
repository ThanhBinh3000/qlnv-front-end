import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { displayNumber, exchangeMoney, sumNumber } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, DON_VI_TIEN, LA_MA, MONEY_LIMIT } from 'src/app/Utility/utils';
import * as uuid from 'uuid';

export class ItemData {
	id: any;
	stt: string;
	donVi: string;
	tenDmuc: string;
	dtTsoNguoiLv: number;
	dtTongQlPcap: number;
	dtQlPcapTso: number;
	dtQlPcapLuongBac: number;
	dtQlPcapPcapLuong: number;
	dtQlPcapDgopLuong: number;
	dtQlPcapHdLd: number;
	dtKphiNsnn: number;
	dtKphiSnDvu: number;
	dtKphiPhiDlai: number;
	dtKphiHphap: number;
	uocThTsoNguoiLv: number;
	uocThTsoBcTdiem: number;
	uocThTsoVcCc: number;
	uocThTongQlPcap: number;
	uocThQlPcapTso: number;
	uocThQlPcapLuongBac: number;
	uocThQlPcapPcapLuong: number;
	uocThQlPcapDgopLuong: number;
	uocThQlPcapHdLd: number;
	uocThKphiNsnn: number;
	uocThKphiSnDvu: number;
	uocThKphiPhiDlai: number;
	uocThKphiHphap: number;
	namKhTsoNguoiLv: number;
	namKhTongQlPcap: number;
	namKhQlPcapTso: number;
	namKhQlPcapLuongBac: number;
	namKhQlPcapPcapLuong: number;
	namKhQlPcapDgopLuong: number;
	namKhQlPcapHdLd: number;
	namKhKphiNsnn: number;
	namKhKphiSnDvu: number;
	namKhKphiPhiDlai: number;
	namKhKphiHphap: number;
	level: any;
	checked: boolean;
}
@Component({
	selector: 'app-bieu-mau-15-2',
	templateUrl: './bieu-mau-15-2.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})
export class BieuMau152Component implements OnInit {
	@Input() dataInfo;

	donViTiens: any[] = DON_VI_TIEN;
	editMoneyUnit = false;
	maDviTien: string = '1';
	lstCtietBcao: ItemData[] = [];
	formDetail: any;
	thuyetMinh: string;
	status = false;
	statusBtnFinish: boolean;
	statusBtnOk: boolean;
	statusPrint: boolean;
	listDonVi: any[] = [];
	lstVatTuFull = [];
	isDataAvailable = false;
	dsDinhMuc: any[] = [];
	maDviTao: any;
	soLaMa: any[] = LA_MA;
	allChecked = false;
	total: ItemData;
	namBaoCao: string;
	namTruoc: string;
	namKeHoach: string;
	BOX_SIZE = 250;

	scrollX: string;

	checkViewTD: boolean;
	checkEditTD: boolean;
	//nho dem
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
	amount = AMOUNT;

	constructor(
		private _modalRef: NzModalRef,
		private spinner: NgxSpinnerService,
		private lapThamDinhService: LapThamDinhService,
		private notification: NzNotificationService,
		private modal: NzModalService,
		private danhMucService: DanhMucDungChungService,
	) {
	}


	async ngOnInit() {
		this.initialization().then(() => {
			this.isDataAvailable = true;
		})
	}


	async initialization() {
		this.spinner.show();
		this.formDetail = this.dataInfo?.data;
		this.maDviTao = this.dataInfo?.maDvi;
		this.namBaoCao = this.dataInfo?.namBcao;
		this.namTruoc = (Number(this.namBaoCao) - 1).toString();
		this.namKeHoach = (Number(this.namBaoCao) + 1).toString();
		this.thuyetMinh = this.formDetail?.thuyetMinh;
		this.status = !this.dataInfo?.status;
		if (this.status) {
			const category = await this.danhMucService.danhMucChungGetAll('LTD_TT342_BM152');
			if (category) {
				this.listDonVi = category.data;
			}
			this.scrollX = (560 + this.BOX_SIZE * 35).toString() + 'px';
		} else {
			this.scrollX = (400 + this.BOX_SIZE * 35).toString() + 'px';
		}
		this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
		this.statusPrint = this.dataInfo?.statusBtnPrint;
		// this.checkEditTD = this.dataInfo?.editAppraisalValue;
		// this.checkViewTD = this.dataInfo?.viewAppraisalValue;
		this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
			this.lstCtietBcao.push({
				...item,
			})
		})

		if (this.lstCtietBcao.length == 0) {
			this.listDonVi.forEach(e => {
				this.lstCtietBcao.push({
					...new ItemData(),
					id: uuid.v4() + 'FE',
					stt: e.ma,
					donVi: e.ma,
					tenDmuc: e.giaTri,
					dtTsoNguoiLv: null,
					dtTongQlPcap: null,
					dtQlPcapTso: null,
					dtQlPcapLuongBac: null,
					dtQlPcapPcapLuong: null,
					dtQlPcapDgopLuong: null,
					dtQlPcapHdLd: null,
					dtKphiNsnn: null,
					dtKphiSnDvu: null,
					dtKphiPhiDlai: null,
					dtKphiHphap: null,
					uocThTsoNguoiLv: null,
					uocThTsoBcTdiem: null,
					uocThTsoVcCc: null,
					uocThTongQlPcap: null,
					uocThQlPcapTso: null,
					uocThQlPcapLuongBac: null,
					uocThQlPcapPcapLuong: null,
					uocThQlPcapDgopLuong: null,
					uocThQlPcapHdLd: null,
					uocThKphiNsnn: null,
					uocThKphiSnDvu: null,
					uocThKphiPhiDlai: null,
					uocThKphiHphap: null,
					namKhTsoNguoiLv: null,
					namKhTongQlPcap: null,
					namKhQlPcapTso: null,
					namKhQlPcapLuongBac: null,
					namKhQlPcapPcapLuong: null,
					namKhQlPcapDgopLuong: null,
					namKhQlPcapHdLd: null,
					namKhKphiNsnn: null,
					namKhKphiSnDvu: null,
					namKhKphiPhiDlai: null,
					namKhKphiHphap: null,
					level: '',
					checked: false,
				})
			})
			this.setLevel();
			this.lstCtietBcao.forEach(item => {
				item.tenDmuc += this.getName(item.level, item.donVi);
			})
		} else if (!this.lstCtietBcao[0]?.stt) {
			this.lstCtietBcao.forEach(item => {
				item.stt = item.donVi;
			})
		}
		this.sortByIndex();
		this.getTotal();
		this.updateEditCache();
		this.getStatusButton();

		this.spinner.hide();
	}














	// luu
	async save(trangThai: string, lyDoTuChoi: string) {
		let checkSaveEdit;
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
		const lstCtietBcaoTemp: ItemData[] = [];
		let checkMoneyRange = true;
		this.lstCtietBcao.forEach(item => {
			if (item.dtTsoNguoiLv > MONEY_LIMIT || item.dtTongQlPcap > MONEY_LIMIT || item.dtQlPcapTso > MONEY_LIMIT || item.dtQlPcapLuongBac > MONEY_LIMIT
				|| item.dtQlPcapPcapLuong > MONEY_LIMIT || item.dtQlPcapDgopLuong > MONEY_LIMIT || item.dtQlPcapHdLd > MONEY_LIMIT || item.dtKphiNsnn > MONEY_LIMIT || item.dtKphiSnDvu > MONEY_LIMIT ||
				item.dtKphiPhiDlai > MONEY_LIMIT || item.dtKphiHphap > MONEY_LIMIT || item.uocThTsoNguoiLv > MONEY_LIMIT || item.uocThTsoBcTdiem > MONEY_LIMIT || item.uocThTsoVcCc > MONEY_LIMIT || item.uocThTongQlPcap > MONEY_LIMIT ||
				item.uocThQlPcapTso > MONEY_LIMIT || item.uocThQlPcapLuongBac > MONEY_LIMIT || item.uocThQlPcapPcapLuong > MONEY_LIMIT || item.uocThQlPcapDgopLuong > MONEY_LIMIT || item.uocThQlPcapHdLd > MONEY_LIMIT || item.uocThKphiNsnn > MONEY_LIMIT ||
				item.uocThKphiSnDvu > MONEY_LIMIT || item.uocThKphiPhiDlai > MONEY_LIMIT || item.uocThKphiHphap > MONEY_LIMIT || item.namKhTsoNguoiLv > MONEY_LIMIT || item.namKhTongQlPcap > MONEY_LIMIT || item.namKhQlPcapTso > MONEY_LIMIT || item.namKhQlPcapLuongBac > MONEY_LIMIT ||
				item.namKhQlPcapPcapLuong > MONEY_LIMIT || item.namKhQlPcapDgopLuong > MONEY_LIMIT || item.namKhQlPcapHdLd > MONEY_LIMIT || item.namKhKphiNsnn > MONEY_LIMIT || item.namKhKphiSnDvu > MONEY_LIMIT || item.namKhKphiPhiDlai > MONEY_LIMIT || item.namKhKphiHphap > MONEY_LIMIT) {
				checkMoneyRange = false;
				return;
			}
			lstCtietBcaoTemp.push({
				...item,
			})
		})

		if (!checkMoneyRange) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			return;
		}

		// replace nhung ban ghi dc them moi id thanh null
		lstCtietBcaoTemp.forEach(item => {
			if (item.id?.length == 38) {
				item.id = null;
			}
		})

		const request = JSON.parse(JSON.stringify(this.formDetail));
		request.lstCtietLapThamDinhs = lstCtietBcaoTemp;
		request.trangThai = trangThai;

		if (lyDoTuChoi) {
			request.lyDoTuChoi = lyDoTuChoi;
		}

		this.spinner.show();
		this.lapThamDinhService.updateLapThamDinh(request).toPromise().then(
			async data => {
				if (data.statusCode == 0) {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
					this.formDetail = data.data;
					this._modalRef.close({
						formDetail: this.formDetail,
					});
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

	// chuc nang check role
	async onSubmit(mcn: string, lyDoTuChoi: string) {
		if (!this.formDetail?.id) {
			this.notification.warning(MESSAGE.WARNING, MESSAGE.MESSAGE_DELETE_WARNING);
			return;
		}
		const requestGroupButtons = {
			id: this.formDetail.id,
			trangThai: mcn,
			lyDoTuChoi: lyDoTuChoi,
		};
		this.spinner.show();
		await this.lapThamDinhService.approveCtietThamDinh(requestGroupButtons).toPromise().then(async (data) => {
			if (data.statusCode == 0) {
				this.formDetail.trangThai = mcn;
				this.getStatusButton();
				if (mcn == "0") {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.REJECT_SUCCESS);
				} else {
					this.notification.success(MESSAGE.SUCCESS, MESSAGE.APPROVE_SUCCESS);
				}
				this._modalRef.close({
					formDetail: this.formDetail,
				});
			} else {
				this.notification.error(MESSAGE.ERROR, data?.msg);
			}
		}, err => {
			this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
		});
		this.spinner.hide();
	}

	// luu thay doi
	saveEdit(id: string): void {

		const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		// this.tinhTong();
		this.sum(this.lstCtietBcao[index].stt);
		this.updateEditCache();
	}
	// huy thay doi
	cancelEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id);
		// lay vi tri hang minh sua
		this.editCache[id] = {
			data: { ...this.lstCtietBcao[index] },
			edit: false
		};
	}

	deleteAllChecked() {
		const lstId: any[] = [];
		this.lstCtietBcao.forEach(item => {
			if (item.checked) {
				lstId.push(item.id);
			}
		})
		lstId.forEach(item => {
			if (this.lstCtietBcao.findIndex(e => e.id == item) != -1) {
				this.deleteLine(item);
			}
		})
	}

	// xoa dong
	deleteById(id: string): void {
		// this.tongTien -= this.lstCtietBcao.find(e => e.id == id).thanhTien;
		this.lstCtietBcao = this.lstCtietBcao.filter(item => item.id != id)
	}

	checkEdit(stt: string) {
		const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
		return lstTemp.every(e => !e.stt.startsWith(stt));
	}

	// start edit
	startEdit(id: string): void {
		this.editCache[id].edit = true;
	}

	// click o checkbox single
	updateSingleChecked(): void {
		if (this.lstCtietBcao.every(item => item.checked)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked = true;
		} else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
			this.allChecked = false;
		}
	}

	// click o checkbox all
	updateAllChecked(): void {
		if (this.allChecked) {                                    // checkboxall == true thi set lai lstCTietBCao.checked = true
			this.lstCtietBcao = this.lstCtietBcao.map(item => ({
				...item,
				checked: true
			}));
		} else {
			this.lstCtietBcao = this.lstCtietBcao.map(item => ({    // checkboxall == false thi set lai lstCTietBCao.checked = false
				...item,
				checked: false
			}));
		}
	}

	deleteLine(stt: string) {
		const head = this.getHead(stt);
		const tail = this.getTail(stt);
		this.lstCtietBcao = this.lstCtietBcao.filter(e => e.stt !== stt);
		this.lstCtietBcao.forEach(item => {
			if (item.stt.startsWith(head) && item.stt != head && this.getTail(item.stt) > tail) {
				item.stt = head + '.' + (this.getTail(item.stt) - 1).toString();
			}
		})
		this.sum(stt);
		this.updateEditCache();
	}
	// them dong moi


	addLine(stt: string) {
		let index = -1;
		for (let i = this.lstCtietBcao.length - 1; i >= 0; i--) {
			if (this.lstCtietBcao[i].stt.startsWith(stt)) {
				index = i;
				break;
			}
		}

		const tail = stt == this.lstCtietBcao[index]?.stt ? '1' : (this.getTail(this.lstCtietBcao[index]?.stt) + 1).toString();
		const item: ItemData = {
			... new ItemData(),
			id: uuid.v4() + 'FE',
			stt: stt + '.' + tail,
			donVi: null,
			tenDmuc: null,
			dtTsoNguoiLv: null,
			dtTongQlPcap: null,
			dtQlPcapTso: null,
			dtQlPcapLuongBac: null,
			dtQlPcapPcapLuong: null,
			dtQlPcapDgopLuong: null,
			dtQlPcapHdLd: null,
			dtKphiNsnn: null,
			dtKphiSnDvu: null,
			dtKphiPhiDlai: null,
			dtKphiHphap: null,
			uocThTsoNguoiLv: null,
			uocThTsoBcTdiem: null,
			uocThTsoVcCc: null,
			uocThTongQlPcap: null,
			uocThQlPcapTso: null,
			uocThQlPcapLuongBac: null,
			uocThQlPcapPcapLuong: null,
			uocThQlPcapDgopLuong: null,
			uocThQlPcapHdLd: null,
			uocThKphiNsnn: null,
			uocThKphiSnDvu: null,
			uocThKphiPhiDlai: null,
			uocThKphiHphap: null,
			namKhTsoNguoiLv: null,
			namKhTongQlPcap: null,
			namKhQlPcapTso: null,
			namKhQlPcapLuongBac: null,
			namKhQlPcapPcapLuong: null,
			namKhQlPcapDgopLuong: null,
			namKhQlPcapHdLd: null,
			namKhKphiNsnn: null,
			namKhKphiSnDvu: null,
			namKhKphiPhiDlai: null,
			namKhKphiHphap: null,
			level: '',
			checked: false,
		}
		const str: string[] = item.stt.split('.');
		item.level = str.length - 2;
		this.lstCtietBcao.splice(index + 1, 0, item);
		this.editCache[item.id] = {
			edit: false,
			data: { ...item }
		};
		this.sortByIndex();
	}


	checkAdd(data: ItemData) {
		if (data.stt.length == 3) {
			return true;
		}
		return false;
	}

	checkDelete(stt: string) {
		if (stt.length != 3) {
			return true;
		}
		return false;
	}

	getChiMuc(str: string): string {
		str = str.substring(str.indexOf('.') + 1, str.length);
		let xau = "";
		const chiSo: string[] = str.split('.');
		const n: number = chiSo.length - 1;
		let k: number = parseInt(chiSo[n], 10);
		if (n == 0) {
			for (let i = 0; i < this.soLaMa.length; i++) {
				while (k >= this.soLaMa[i].gTri) {
					xau += this.soLaMa[i].kyTu;
					k -= this.soLaMa[i].gTri;
				}
			}
		}
		if (n == 1) {
			xau = chiSo[n];
		}
		if (n == 2) {
			xau = chiSo[n];
		}
		if (n == 3) {
			xau = String.fromCharCode(k + 96);
		}
		if (n == 4) {
			xau = "-";
		}
		return xau;
	}

	sortByIndex() {
		this.setLevel();
		this.lstCtietBcao.sort((item1, item2) => {
			if (item1.level > item2.level) {
				return 1;
			}
			if (item1.level < item2.level) {
				return -1;
			}
			if (this.getTail(item1.stt) > this.getTail(item2.stt)) {
				return -1;
			}
			if (this.getTail(item1.stt) < this.getTail(item2.stt)) {
				return 1;
			}
			return 0;
		});
		const lstTemp: ItemData[] = [];
		this.lstCtietBcao.forEach(item => {
			const index: number = lstTemp.findIndex(e => e.stt == this.getHead(item.stt));
			if (index == -1) {
				lstTemp.splice(0, 0, item);
			} else {
				lstTemp.splice(index + 1, 0, item);
			}
		})

		this.lstCtietBcao = lstTemp;
	}


	// lấy phần đuôi của stt
	getTail(str: string): number {
		return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
	}

	// lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
	getHead(str: string): string {
		return str.substring(0, str.lastIndexOf('.'));
	}

	sum(stt: string) {
		stt = this.getHead(stt);
		while (stt != '0') {
			const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
			const data = this.lstCtietBcao[index];
			this.lstCtietBcao[index] = {
				...new ItemData(),
				id: data.id,
				stt: data.stt,
				donVi: data.donVi,
				tenDmuc: data.tenDmuc,
				level: data.level,
			}
			this.lstCtietBcao.forEach(item => {
				if (this.getHead(item.stt) == stt) {
					this.lstCtietBcao[index].dtTsoNguoiLv = sumNumber([this.lstCtietBcao[index].dtTsoNguoiLv, item.dtTsoNguoiLv]);
					this.lstCtietBcao[index].dtTongQlPcap = sumNumber([this.lstCtietBcao[index].dtTongQlPcap, item.dtTongQlPcap]);
					this.lstCtietBcao[index].dtQlPcapTso = sumNumber([this.lstCtietBcao[index].dtQlPcapTso, item.dtQlPcapTso]);
					this.lstCtietBcao[index].dtQlPcapLuongBac = sumNumber([this.lstCtietBcao[index].dtQlPcapLuongBac, item.dtQlPcapLuongBac]);
					this.lstCtietBcao[index].dtQlPcapPcapLuong = sumNumber([this.lstCtietBcao[index].dtQlPcapPcapLuong, item.dtQlPcapPcapLuong]);
					this.lstCtietBcao[index].dtQlPcapDgopLuong = sumNumber([this.lstCtietBcao[index].dtQlPcapDgopLuong, item.dtQlPcapDgopLuong]);
					this.lstCtietBcao[index].dtQlPcapHdLd = sumNumber([this.lstCtietBcao[index].dtQlPcapHdLd, item.dtQlPcapHdLd]);
					this.lstCtietBcao[index].dtKphiNsnn = sumNumber([this.lstCtietBcao[index].dtKphiNsnn, item.dtKphiNsnn]);
					this.lstCtietBcao[index].dtKphiSnDvu = sumNumber([this.lstCtietBcao[index].dtKphiSnDvu, item.dtKphiSnDvu]);
					this.lstCtietBcao[index].dtKphiPhiDlai = sumNumber([this.lstCtietBcao[index].dtKphiPhiDlai, item.dtKphiPhiDlai]);
					this.lstCtietBcao[index].dtKphiHphap = sumNumber([this.lstCtietBcao[index].dtKphiHphap, item.dtKphiHphap]);
					this.lstCtietBcao[index].uocThTsoNguoiLv = sumNumber([this.lstCtietBcao[index].uocThTsoNguoiLv, item.uocThTsoNguoiLv]);
					this.lstCtietBcao[index].uocThTsoBcTdiem = sumNumber([this.lstCtietBcao[index].uocThTsoBcTdiem, item.uocThTsoBcTdiem]);
					this.lstCtietBcao[index].uocThTsoVcCc = sumNumber([this.lstCtietBcao[index].uocThTsoVcCc, item.uocThTsoVcCc]);
					this.lstCtietBcao[index].uocThTongQlPcap = sumNumber([this.lstCtietBcao[index].uocThTongQlPcap, item.uocThTongQlPcap]);
					this.lstCtietBcao[index].uocThQlPcapTso = sumNumber([this.lstCtietBcao[index].uocThQlPcapTso, item.uocThQlPcapTso]);
					this.lstCtietBcao[index].uocThQlPcapLuongBac = sumNumber([this.lstCtietBcao[index].uocThQlPcapLuongBac, item.uocThQlPcapLuongBac]);
					this.lstCtietBcao[index].uocThQlPcapPcapLuong = sumNumber([this.lstCtietBcao[index].uocThQlPcapPcapLuong, item.uocThQlPcapPcapLuong]);
					this.lstCtietBcao[index].uocThQlPcapDgopLuong = sumNumber([this.lstCtietBcao[index].uocThQlPcapDgopLuong, item.uocThQlPcapDgopLuong]);
					this.lstCtietBcao[index].uocThQlPcapHdLd = sumNumber([this.lstCtietBcao[index].uocThQlPcapHdLd, item.uocThQlPcapHdLd]);
					this.lstCtietBcao[index].uocThKphiNsnn = sumNumber([this.lstCtietBcao[index].uocThKphiNsnn, item.uocThKphiNsnn]);
					this.lstCtietBcao[index].uocThKphiSnDvu = sumNumber([this.lstCtietBcao[index].uocThKphiSnDvu, item.uocThKphiSnDvu]);
					this.lstCtietBcao[index].uocThKphiPhiDlai = sumNumber([this.lstCtietBcao[index].uocThKphiPhiDlai, item.uocThKphiPhiDlai]);
					this.lstCtietBcao[index].uocThKphiHphap = sumNumber([this.lstCtietBcao[index].uocThKphiHphap, item.uocThKphiHphap]);
					this.lstCtietBcao[index].namKhTsoNguoiLv = sumNumber([this.lstCtietBcao[index].namKhTsoNguoiLv, item.namKhTsoNguoiLv]);
					this.lstCtietBcao[index].namKhTongQlPcap = sumNumber([this.lstCtietBcao[index].namKhTongQlPcap, item.namKhTongQlPcap]);
					this.lstCtietBcao[index].namKhQlPcapTso = sumNumber([this.lstCtietBcao[index].namKhQlPcapTso, item.namKhQlPcapTso]);
					this.lstCtietBcao[index].namKhQlPcapLuongBac = sumNumber([this.lstCtietBcao[index].namKhQlPcapLuongBac, item.namKhQlPcapLuongBac]);
					this.lstCtietBcao[index].namKhQlPcapPcapLuong = sumNumber([this.lstCtietBcao[index].namKhQlPcapPcapLuong, item.namKhQlPcapPcapLuong]);
					this.lstCtietBcao[index].namKhQlPcapDgopLuong = sumNumber([this.lstCtietBcao[index].namKhQlPcapDgopLuong, item.namKhQlPcapDgopLuong]);
					this.lstCtietBcao[index].namKhQlPcapHdLd = sumNumber([this.lstCtietBcao[index].namKhQlPcapHdLd, item.namKhQlPcapHdLd]);
					this.lstCtietBcao[index].namKhKphiNsnn = sumNumber([this.lstCtietBcao[index].namKhKphiNsnn, item.namKhKphiNsnn]);
					this.lstCtietBcao[index].namKhKphiSnDvu = sumNumber([this.lstCtietBcao[index].namKhKphiSnDvu, item.namKhKphiSnDvu]);
					this.lstCtietBcao[index].namKhKphiPhiDlai = sumNumber([this.lstCtietBcao[index].namKhKphiPhiDlai, item.namKhKphiPhiDlai]);
					this.lstCtietBcao[index].namKhKphiHphap = sumNumber([this.lstCtietBcao[index].namKhKphiHphap, item.namKhKphiHphap]);
				}
			})
			stt = this.getHead(stt);
		}
		this.getTotal();
	}

	getTotal() {
		this.total = new ItemData();
		this.lstCtietBcao.forEach(item => {
			if (item.level == 0) {
				this.total.dtTsoNguoiLv = sumNumber([this.total.dtTsoNguoiLv, item.dtTsoNguoiLv]);
				this.total.dtTongQlPcap = sumNumber([this.total.dtTongQlPcap, item.dtTongQlPcap]);
				this.total.dtQlPcapTso = sumNumber([this.total.dtQlPcapTso, item.dtQlPcapTso]);
				this.total.dtQlPcapLuongBac = sumNumber([this.total.dtQlPcapLuongBac, item.dtQlPcapLuongBac]);
				this.total.dtQlPcapPcapLuong = sumNumber([this.total.dtQlPcapPcapLuong, item.dtQlPcapPcapLuong]);
				this.total.dtQlPcapDgopLuong = sumNumber([this.total.dtQlPcapDgopLuong, item.dtQlPcapDgopLuong]);
				this.total.dtQlPcapHdLd = sumNumber([this.total.dtQlPcapHdLd, item.dtQlPcapHdLd]);
				this.total.dtKphiNsnn = sumNumber([this.total.dtKphiNsnn, item.dtKphiNsnn]);
				this.total.dtKphiSnDvu = sumNumber([this.total.dtKphiSnDvu, item.dtKphiSnDvu]);
				this.total.dtKphiPhiDlai = sumNumber([this.total.dtKphiPhiDlai, item.dtKphiPhiDlai]);
				this.total.dtKphiHphap = sumNumber([this.total.dtKphiHphap, item.dtKphiHphap]);
				this.total.uocThTsoNguoiLv = sumNumber([this.total.uocThTsoNguoiLv, item.uocThTsoNguoiLv]);
				this.total.uocThTsoBcTdiem = sumNumber([this.total.uocThTsoBcTdiem, item.uocThTsoBcTdiem]);
				this.total.uocThTsoVcCc = sumNumber([this.total.uocThTsoVcCc, item.uocThTsoVcCc]);
				this.total.uocThTongQlPcap = sumNumber([this.total.uocThTongQlPcap, item.uocThTongQlPcap]);
				this.total.uocThQlPcapTso = sumNumber([this.total.uocThQlPcapTso, item.uocThQlPcapTso]);
				this.total.uocThQlPcapLuongBac = sumNumber([this.total.uocThQlPcapLuongBac, item.uocThQlPcapLuongBac]);
				this.total.uocThQlPcapPcapLuong = sumNumber([this.total.uocThQlPcapPcapLuong, item.uocThQlPcapPcapLuong]);
				this.total.uocThQlPcapDgopLuong = sumNumber([this.total.uocThQlPcapDgopLuong, item.uocThQlPcapDgopLuong]);
				this.total.uocThQlPcapHdLd = sumNumber([this.total.uocThQlPcapHdLd, item.uocThQlPcapHdLd]);
				this.total.uocThKphiNsnn = sumNumber([this.total.uocThKphiNsnn, item.uocThKphiNsnn]);
				this.total.uocThKphiSnDvu = sumNumber([this.total.uocThKphiSnDvu, item.uocThKphiSnDvu]);
				this.total.uocThKphiPhiDlai = sumNumber([this.total.uocThKphiPhiDlai, item.uocThKphiPhiDlai]);
				this.total.uocThKphiHphap = sumNumber([this.total.uocThKphiHphap, item.uocThKphiHphap]);
				this.total.namKhTsoNguoiLv = sumNumber([this.total.namKhTsoNguoiLv, item.namKhTsoNguoiLv]);
				this.total.namKhTongQlPcap = sumNumber([this.total.namKhTongQlPcap, item.namKhTongQlPcap]);
				this.total.namKhQlPcapTso = sumNumber([this.total.namKhQlPcapTso, item.namKhQlPcapTso]);
				this.total.namKhQlPcapLuongBac = sumNumber([this.total.namKhQlPcapLuongBac, item.namKhQlPcapLuongBac]);
				this.total.namKhQlPcapPcapLuong = sumNumber([this.total.namKhQlPcapPcapLuong, item.namKhQlPcapPcapLuong]);
				this.total.namKhQlPcapDgopLuong = sumNumber([this.total.namKhQlPcapDgopLuong, item.namKhQlPcapDgopLuong]);
				this.total.namKhQlPcapHdLd = sumNumber([this.total.namKhQlPcapHdLd, item.namKhQlPcapHdLd]);
				this.total.namKhKphiNsnn = sumNumber([this.total.namKhKphiNsnn, item.namKhKphiNsnn]);
				this.total.namKhKphiSnDvu = sumNumber([this.total.namKhKphiSnDvu, item.namKhKphiSnDvu]);
				this.total.namKhKphiPhiDlai = sumNumber([this.total.namKhKphiPhiDlai, item.namKhKphiPhiDlai]);
				this.total.namKhKphiHphap = sumNumber([this.total.namKhKphiHphap, item.namKhKphiHphap]);
			}
		})
	}
	setLevel() {
		this.lstCtietBcao.forEach(item => {
			const str: string[] = item.stt.split('.');
			item.level = str.length - 2;
		})
	}

	getName(level: number, ma: string) {
		const type = this.getTail(ma);
		let str = '';
		if (level == 1) {
			switch (type) {
				case 1:
					str = (Number(this.namBaoCao) - 1).toString();
					break;
				case 2:
					str = this.namBaoCao.toString();
					break;
				case 3:
					str = this.namBaoCao.toString();
					break;
				case 4:
					str = (Number(this.namBaoCao) - 2).toString() + '-' + (this.namBaoCao + 2).toString();
					break;
				default:
					break;
			}
		}
		return str;
	}
	selectTaisan(idTaiSan: any, idRow: any) {
		// const taiSan = this.lstVatTuFull.find(ts => ts.id === idTaiSan);
		// this.editCache[idRow].data.dviTinh = taiSan.dviTinh;
	}

	changeModel(id: string): void {
		this.editCache[id].data.dtQlPcapTso = this.editCache[id].data.dtQlPcapLuongBac + this.editCache[id].data.dtQlPcapPcapLuong + this.editCache[id].data.dtQlPcapDgopLuong;
		this.editCache[id].data.uocThQlPcapTso = this.editCache[id].data.uocThQlPcapLuongBac + this.editCache[id].data.uocThQlPcapPcapLuong + this.editCache[id].data.uocThQlPcapDgopLuong;
		this.editCache[id].data.namKhQlPcapTso = this.editCache[id].data.namKhQlPcapLuongBac + this.editCache[id].data.namKhQlPcapPcapLuong + this.editCache[id].data.namKhQlPcapDgopLuong;
		this.editCache[id].data.dtTongQlPcap = this.editCache[id].data.dtQlPcapTso + this.editCache[id].data.dtQlPcapHdLd;
		this.editCache[id].data.uocThTongQlPcap = this.editCache[id].data.uocThQlPcapTso + this.editCache[id].data.uocThQlPcapHdLd;
		this.editCache[id].data.namKhTongQlPcap = this.editCache[id].data.namKhQlPcapTso + this.editCache[id].data.namKhQlPcapHdLd;

	}


	//tìm vị trí cần để thêm mới
	findVt(str: string): number {
		const start: number = this.lstCtietBcao.findIndex(e => e.stt == str);
		let index: number = start;
		for (let i = start + 1; i < this.lstCtietBcao.length; i++) {
			if (this.lstCtietBcao[i].stt.startsWith(str)) {
				index = i;
			}
		}
		return index;
	}



	//show popup tu choi
	tuChoi(mcn: string) {
		const modalTuChoi = this.modal.create({
			nzTitle: 'Từ chối',
			nzContent: DialogTuChoiComponent,
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '900px',
			nzFooter: null,
			nzComponentParams: {},
		});
		modalTuChoi.afterClose.subscribe(async (text) => {
			if (text) {
				this.onSubmit(mcn, text);
			}
		});
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

	getStatusButton() {
		if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
			this.statusBtnOk = false;
		} else {
			this.statusBtnOk = true;
		}
	}
	// action print
	doPrint() {
		const WindowPrt = window.open(
			'',
			'',
			'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
		);
		let printContent = '';
		printContent = printContent + '<div>';
		printContent =
			printContent + document.getElementById('tablePrint').innerHTML;
		printContent = printContent + '</div>';
		WindowPrt.document.write(printContent);
		WindowPrt.document.close();
		WindowPrt.focus();
		WindowPrt.print();
		WindowPrt.close();
	}

	displayValue(num: number): string {
		num = exchangeMoney(num, '1', this.maDviTien);
		return displayNumber(num);
	}
	getMoneyUnit() {
		return this.donViTiens.find(e => e.id == this.maDviTien)?.tenDm;
	}

	handleCancel() {
		this._modalRef.close();
	}

}
