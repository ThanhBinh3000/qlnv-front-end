import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { startWith } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucHDVService } from 'src/app/services/danhMucHDV.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { displayNumber, divNumber, DON_VI_TIEN, exchangeMoney, LA_MA, mulNumber, sumNumber } from "src/app/Utility/utils";
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import * as uuid from "uuid";
import { DANH_MUC } from './phu-luc-02.constant';

export class ItemData {
	id: string;
	stt: string;
	level: number;
	// matHang: string;
	// tenMatHang: string;
	maDanhMuc: string;
	tenDanhMuc: string;
	dviTinh: string;
	thNamTruoc: number;
	namDtoan: number;
	namUocTh: number;
	sluongTaiKho: number;
	dmucTaiKho: number;
	ttienTaiKho: number;
	binhQuanNgoaiKho: number;
	ttienNgoaiKho: number;
	tongCong: number;
	checked: boolean;
}


@Component({
	selector: 'app-phu-luc-02',
	templateUrl: './phu-luc-02.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})
export class PhuLuc02Component implements OnInit {
	@Input() dataInfo;
	//thong tin chi tiet cua bieu mau
	formDetail: any;
	total: ItemData = new ItemData();
	maDviTien: string = '1';
	thuyetMinh: string;
	namTruoc: string;
	namBcao: number;
	namKeHoach: string;
	//danh muc
	linhVucChis: any[] = DANH_MUC;
	soLaMa: any[] = LA_MA;
	lstCtietBcao: ItemData[] = [];
	donViTiens: any[] = DON_VI_TIEN;
	//trang thai cac nut
	status = false;
	statusBtnFinish: boolean;
	statusBtnOk: boolean;
	statusPrint: boolean;
	editMoneyUnit = false;
	isDataAvailable = false;
	checkViewTD: boolean;
	checkEditTD: boolean;
	//nho dem
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
	listVatTu: any[] = [];
	listVatTu1: any[] = [];
	luongThuc: any[] = [];
	lstVatTuFull: any[] = [];
	lstvatTu: any[] = [];
	loaiHang: string;
	dsDinhMuc: any[] = [];
	allChecked = false;
	maDviTao: string;
	constructor(
		private _modalRef: NzModalRef,
		private spinner: NgxSpinnerService,
		private lapThamDinhService: LapThamDinhService,
		private notification: NzNotificationService,
		private modal: NzModalService,
		private danhMucService: DanhMucHDVService,
		private quanLyVonPhiService: QuanLyVonPhiService,

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
		this.namBcao = this.dataInfo?.namBcao;
		this.maDviTao = this.dataInfo?.maDvi;
		this.namTruoc = (Number(this.namBcao) - 1).toString();
		this.namKeHoach = (Number(this.namBcao) + 1).toString();
		this.thuyetMinh = this.formDetail?.thuyetMinh;
		this.status = this.dataInfo?.status;
		this.statusBtnFinish = this.dataInfo?.statusBtnFinish;
		this.statusPrint = this.dataInfo?.statusBtnPrint;
		this.checkViewTD = this.dataInfo?.viewAppraisalValue;
		this.checkEditTD = this.dataInfo?.editAppraisalValue;
		this.formDetail?.lstCtietLapThamDinhs.forEach(item => {
			this.lstCtietBcao.push({
				...item,
			})
		})
		if (this.lstCtietBcao.length == 0) {
			this.linhVucChis.forEach(e => {
				this.lstCtietBcao.push({
					...new ItemData(),
					id: uuid.v4() + 'FE',
					stt: e.ma,
					tenDanhMuc: e.giaTri,
					maDanhMuc: e.ma,
				})
			})
			this.setLevel();
			this.lstCtietBcao.forEach(item => {
				item.tenDanhMuc += this.getName(item.level, item.maDanhMuc);
			})
		} else if (!this.lstCtietBcao[0]?.stt) {
			this.lstCtietBcao.forEach(item => {
				item.stt = item.maDanhMuc;
			})
		}

		await this.getDinhMuc();
		this.lstCtietBcao.forEach(item => {
			if (!item.tenDanhMuc) {
				const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.maDanhMuc);
				item.tenDanhMuc = dinhMuc?.tenDinhMuc;
				item.dmucTaiKho = dinhMuc?.tongDmuc;
				item.dviTinh = dinhMuc?.donViTinh;
				item.ttienTaiKho = mulNumber(item.dmucTaiKho, item.sluongTaiKho);
			}
		})

		this.sortByIndex();
		this.getTotal();
		this.updateEditCache();
		this.getStatusButton();
		this.spinner.hide();
	}

	async getDinhMuc() {
		const request = {
			loaiDinhMuc: '02',
			maDvi: this.maDviTao,
		}
		await this.quanLyVonPhiService.getDinhMuc(request).toPromise().then(
			res => {
				if (res.statusCode == 0) {
					this.dsDinhMuc = res.data;
				} else {
					this.notification.error(MESSAGE.ERROR, res?.msg);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
			}
		)
	}

	getName(level: number, ma: string) {
		const type = this.getTail(ma);
		let str = '';
		return str;
	}

	getStatusButton() {
		if (this.dataInfo?.statusBtnOk && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5")) {
			this.statusBtnOk = false;
		} else {
			this.statusBtnOk = true;
		}
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
		if (lyDoTuChoi) {
			request.lyDoTuChoi = lyDoTuChoi;
		}
		request.trangThai = trangThai;
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
		this.getTotal()
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
				this.save(mcn, text);
			}
		});
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
			// xau = chiSo[n - 1].toString() + "." + chiSo[n].toString();
			xau = null;
		}
		if (n == 3) {
			xau = String.fromCharCode(k + 96);
		}
		if (n == 4) {
			xau = "-";
		}
		return xau;
	}
	// lấy phần đầu của số thứ tự, dùng để xác định phần tử cha
	getHead(str: string): string {
		return str.substring(0, str.lastIndexOf('.'));
	}
	// lấy phần đuôi của stt
	getTail(str: string): number {
		return parseInt(str.substring(str.lastIndexOf('.') + 1, str.length), 10);
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

	// start edit
	startEdit(data: any): void {
		const id = data?.id;
		if (data.stt.startsWith("0.1")) {
			this.loaiHang = "LT"
		} else if (data.stt.startsWith("0.2")) {
			this.loaiHang = "VT"
		}
		if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
			this.editCache[id].edit = true;
		} else {
			this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
			return;
		}
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

	// luu thay doi
	saveEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		this.sum(this.lstCtietBcao[index].stt);
		this.getTotal()
		this.updateEditCache();
	}

	changeVatTu(maDanhMuc: any, id: any) {
		this.editCache[id].data.tenDanhMuc = this.lstVatTuFull.find(vt => vt.id === maDanhMuc)?.ten;
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

	setLevel() {
		this.lstCtietBcao.forEach(item => {
			const str: string[] = item.stt.split('.');
			item.level = str.length - 2;
		})
	}
	changeModel(id: string): void {
		this.editCache[id].data.ttienTaiKho = mulNumber(this.editCache[id].data.sluongTaiKho, this.editCache[id].data.dmucTaiKho);
		this.editCache[id].data.binhQuanNgoaiKho = divNumber(this.editCache[id].data.ttienNgoaiKho, this.editCache[id].data.sluongTaiKho);
		this.editCache[id].data.tongCong = sumNumber([this.editCache[id].data.ttienNgoaiKho, this.editCache[id].data.ttienTaiKho]);
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
				maDanhMuc: data.maDanhMuc,
				tenDanhMuc: data.tenDanhMuc,
				level: data.level,
			}
			this.lstCtietBcao.forEach(item => {
				if (this.getHead(item.stt) == stt) {
					this.lstCtietBcao[index].thNamTruoc = sumNumber([this.lstCtietBcao[index].thNamTruoc, item.thNamTruoc])
					this.lstCtietBcao[index].namDtoan = sumNumber([this.lstCtietBcao[index].namDtoan, item.namDtoan])
					this.lstCtietBcao[index].namUocTh = sumNumber([this.lstCtietBcao[index].namUocTh, item.namUocTh])
					// this.lstCtietBcao[index].sluongTaiKho = sumNumber([this.lstCtietBcao[index].sluongTaiKho, item.sluongTaiKho])
					this.lstCtietBcao[index].dmucTaiKho = sumNumber([this.lstCtietBcao[index].dmucTaiKho, item.dmucTaiKho])
					this.lstCtietBcao[index].ttienTaiKho = this.lstCtietBcao[index].dmucTaiKho * this.lstCtietBcao[index].sluongTaiKho
					this.lstCtietBcao[index].ttienNgoaiKho = sumNumber([this.lstCtietBcao[index].ttienNgoaiKho, item.ttienNgoaiKho])
					// this.lstCtietBcao[index].binhQuanNgoaiKho = this.lstCtietBcao[index].ttienNgoaiKho / this.lstCtietBcao[index].sluongTaiKho
					this.lstCtietBcao[index].binhQuanNgoaiKho = sumNumber([this.lstCtietBcao[index].binhQuanNgoaiKho, item.binhQuanNgoaiKho])
					this.lstCtietBcao[index].tongCong = this.lstCtietBcao[index].ttienNgoaiKho + this.lstCtietBcao[index].ttienTaiKho
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
				this.total.thNamTruoc = sumNumber([this.total.thNamTruoc, item.thNamTruoc]);
				this.total.namDtoan = sumNumber([this.total.namDtoan, item.namDtoan]);
				this.total.namUocTh = sumNumber([this.total.namUocTh, item.namUocTh]);
				// this.total.sluongTaiKho = sumNumber([this.total.sluongTaiKho, item.sluongTaiKho]);
				this.total.dmucTaiKho = sumNumber([this.total.dmucTaiKho, item.dmucTaiKho]);
				this.total.ttienTaiKho = mulNumber(this.total.sluongTaiKho, this.total.dmucTaiKho);
				this.total.ttienNgoaiKho = sumNumber([this.total.ttienNgoaiKho, item.ttienNgoaiKho]);
				this.total.tongCong = this.total.ttienNgoaiKho + this.total.ttienTaiKho;
				this.total.binhQuanNgoaiKho = divNumber(this.total.ttienNgoaiKho, this.total.sluongTaiKho);
				this.total.binhQuanNgoaiKho = sumNumber([this.total.binhQuanNgoaiKho, item.binhQuanNgoaiKho])
			}
		})
	}

	checkEdit(stt: string) {
		const lstTemp = this.lstCtietBcao.filter(e => e.stt !== stt);
		return lstTemp.every(e => !e.stt.startsWith(stt));
	}

	checkAdd(data: ItemData) {
		if ((data.level == 0 && data.maDanhMuc)) {
			return true;
		}
		return false;
	}
	// checkDelete(maDa: string) {
	//   if (!maDa) {
	//     return true;
	//   }
	//   return false;
	// }

	checkDelete(stt: string) {
		const level = stt.split('.').length - 2;
		if (level == 1) {
			return true;
		}
		return false;
	}

	//xóa dòng
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

	//thay thế các stt khi danh sách được cập nhật, heSo=1 tức là tăng stt lên 1, heso=-1 là giảm stt đi 1
	replaceIndex(lstIndex: number[], heSo: number) {
		if (heSo == -1) {
			lstIndex.reverse();
		}
		//thay doi lai stt cac vi tri vua tim duoc
		lstIndex.forEach(item => {
			const str = this.getHead(this.lstCtietBcao[item].stt) + "." + (this.getTail(this.lstCtietBcao[item].stt) + heSo).toString();
			const nho = this.lstCtietBcao[item].stt;
			this.lstCtietBcao.forEach(item => {
				item.stt = item.stt.replace(nho, str);
			})
		})
	}

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
	selectGoods() {
		const modalTuChoi = this.modal.create({
			nzTitle: 'Danh sách hàng hóa',
			nzContent: DialogDanhSachVatTuHangHoaComponent,
			nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '900px',
			nzFooter: null,
			nzComponentParams: {},
		});
		modalTuChoi.afterClose.subscribe(async (data) => {
			if (data) {
				const dm = this.dsDinhMuc.find(e => e.cloaiVthh == data.ma);
				if (this.lstCtietBcao.findIndex(e => e.maDanhMuc == data.ma) == -1) {
					let stt: any;
					const index = this.lstCtietBcao.findIndex(e => e.maDanhMuc == '0.2');
					if (data.ma.startsWith('02')) {
						stt = '0.2.' + (this.lstCtietBcao.length - index).toString();
						//them vat tu moi vao bang
						this.lstCtietBcao.push({
							... new ItemData(),
							id: uuid.v4() + 'FE',
							stt: stt,
							maDanhMuc: data.ma,
							tenDanhMuc: data.ten,
							dviTinh: dm?.donViTinh,
							dmucTaiKho: dm?.tongDmuc,
							level: 1,
						})
						this.lstCtietBcao.forEach(e => {
							if(e.stt.startsWith("0.2.")){
								this.lstCtietBcao[index].dmucTaiKho = null;
								this.lstCtietBcao[index].thNamTruoc = null;
								this.lstCtietBcao[index].namDtoan = null;
								this.lstCtietBcao[index].namUocTh = null;
								this.lstCtietBcao[index].sluongTaiKho = null;
								this.lstCtietBcao[index].dmucTaiKho = null;
								this.lstCtietBcao[index].ttienTaiKho = null;
								this.lstCtietBcao[index].ttienNgoaiKho = null;
								this.lstCtietBcao[index].tongCong = null;
								this.lstCtietBcao[index].binhQuanNgoaiKho = null;
							}
						})
						this.getTotal()
						this.updateEditCache();
					} else {
						stt = '0.1.' + index.toString();
						this.lstCtietBcao.splice(index, 0, {
							... new ItemData(),
							id: uuid.v4() + 'FE',
							stt: stt,
							maDanhMuc: data.ma,
							tenDanhMuc: data.ten,
							dviTinh: dm?.donViTinh,
							dmucTaiKho: dm?.tongDmuc,
							level: 1,
						})
						const index2 = this.lstCtietBcao.findIndex(e => e.maDanhMuc == '0.1');
						this.lstCtietBcao.forEach(e => {
							if(e.stt.startsWith("0.1.")){
								this.lstCtietBcao[index2].dmucTaiKho = null;
								this.lstCtietBcao[index2].thNamTruoc = null;
								this.lstCtietBcao[index2].namDtoan = null;
								this.lstCtietBcao[index2].namUocTh = null;
								this.lstCtietBcao[index2].sluongTaiKho = null;
								this.lstCtietBcao[index2].dmucTaiKho = null;
								this.lstCtietBcao[index2].ttienTaiKho = null;
								this.lstCtietBcao[index2].ttienNgoaiKho = null;
								this.lstCtietBcao[index2].tongCong = null;
								this.lstCtietBcao[index2].binhQuanNgoaiKho = null;
							}
						})
						this.getTotal()
						this.updateEditCache();
					}

				}
			}
		});
	}

	deleteAllChecked() {
		const lstId: any[] = [];
		this.lstCtietBcao.forEach(item => {
			if (item.checked) {
				lstId.push(item.id);
			}
		})
		lstId.forEach(item => {
			if (this.lstCtietBcao.findIndex(e => e.id == item) != 0) {
				this.deleteLine(item);
			}
		})
	}

	// click o checkbox single
	updateSingleChecked(): void {
		if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked = true;
		} else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
			this.allChecked = false;
		}
	}

	updateAllChecked(): void {
		this.lstCtietBcao.forEach(item => {
			item.checked = this.allChecked;
		})
	}
}

