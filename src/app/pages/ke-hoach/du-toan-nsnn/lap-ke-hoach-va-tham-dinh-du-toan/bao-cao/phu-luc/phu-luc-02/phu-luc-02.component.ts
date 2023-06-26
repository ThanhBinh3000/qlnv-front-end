import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import * as fileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { FileFunction, GeneralFunction, NumberFunction, TableFunction } from 'src/app/Utility/func';
import { AMOUNT, BOX_NUMBER_WIDTH, DON_VI_TIEN, LA_MA, Utils } from "src/app/Utility/utils";
import * as uuid from "uuid";
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.class';

export class ItemData {
	id: string;
	stt: string;
	level: number;
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
	tdinhKhoSluong: number;
	tdinhKhoTtien: number;
	tdinhTcong: number;
	chenhLech: number;
	ghiChu: string;
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
	formDetail: Form = new Form();
	total: ItemData = new ItemData();
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	linhVucChis: any[] = [];
	lstCtietBcao: ItemData[] = [];
	donViTiens: any[] = DON_VI_TIEN;
	keys = ['thNamTruoc', 'namDtoan', 'namUocTh', 'ttienTaiKho', 'ttienNgoaiKho', 'tongCong', 'tdinhKhoTtien', 'tdinhTcong', 'chenhLech']
	lstVatTuFull: any[] = [];
	dsDinhMuc: any[] = [];
	amount = AMOUNT;
	scrollX: string;
	//trang thai cac nut
	status: BtnStatus = new BtnStatus();
	editMoneyUnit = false;
	isDataAvailable = false;
	allChecked = false;
	//nho dem
	editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};

	fileList: NzUploadFile[] = [];
	listFile: File[] = [];
	listIdDeleteFiles: string[] = [];

	beforeUpload = (file: NzUploadFile): boolean => {
		this.fileList = this.fileList.concat(file);
		return false;
	};

	// them file vao danh sach
	handleUpload(): void {
		this.fileList.forEach((file: any) => {
			const id = file?.lastModified.toString();
			this.formDetail.lstFiles.push({
				... new Doc(),
				id: id,
				fileName: file?.name
			});
			this.listFile.push(file);
		});
		this.fileList = [];
	};

	constructor(
		private _modalRef: NzModalRef,
		private spinner: NgxSpinnerService,
		private lapThamDinhService: LapThamDinhService,
		private notification: NzNotificationService,
		private modal: NzModalService,
		private danhMucService: DanhMucDungChungService,
		private quanLyVonPhiService: QuanLyVonPhiService,
		public numFunc: NumberFunction,
		public genFunc: GeneralFunction,
		private fileFunc: FileFunction,
		private tableFunc: TableFunction,
	) { }

	async ngOnInit() {
		this.initialization().then(() => {
			this.isDataAvailable = true;
		})
	}

	async initialization() {
		this.spinner.show();
		Object.assign(this.status, this.dataInfo.status);
		await this.getFormDetail();
		this.namBcao = this.dataInfo.namBcao;
		if (this.status.general) {
			const category = await this.danhMucService.danhMucChungGetAll('LTD_PL2');
			if (category) {
				this.linhVucChis = category.data;
			}
			this.scrollX = this.genFunc.setTableWidth(350, 10, BOX_NUMBER_WIDTH, 110);
		} else {
			this.scrollX = this.genFunc.setTableWidth(350, 10, BOX_NUMBER_WIDTH, 0);
		}
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
				item.ttienTaiKho = this.numFunc.mul(item.dmucTaiKho, item.sluongTaiKho);
			}
		})

		if (this.dataInfo.isSynthetic) {
			this.lstCtietBcao.forEach(item => {
				const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.maDanhMuc);
				item.dmucTaiKho = dinhMuc?.tongDmuc;
				item.ttienTaiKho = this.numFunc.mul(item.dmucTaiKho, item.sluongTaiKho);
				item.tongCong = this.numFunc.sum([item.ttienTaiKho, item.ttienNgoaiKho])
			})
			this.sum1()
		}

		this.lstCtietBcao = this.tableFunc.sortByIndex(this.lstCtietBcao);
		this.getTotal();
		this.updateEditCache();
		this.getStatusButton();
		this.spinner.hide();
	}

	async getDinhMuc() {
		const request = {
			loaiDinhMuc: '02',
			maDvi: this.dataInfo.maDvi,
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

	getStatusButton() {
		this.status.ok = this.status.ok && (this.formDetail.trangThai == "2" || this.formDetail.trangThai == "5");
	};

	getFormDetail() {
		this.lapThamDinhService.ctietBieuMau(this.dataInfo.id).toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.formDetail = data.data;
					this.formDetail.maDviTien = '1';
					this.listFile = [];
					this.getStatusButton();
				} else {
					this.notification.error(MESSAGE.ERROR, data?.msg);
				}
			},
			err => {
				this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR_CALL_SERVICE);
			}
		)
	}

	// luu
	async save(trangThai: string, lyDoTuChoi: string) {
		if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}

		// if (this.lstCtietBcao.some(e => e.ncauChiTongSo > MONEY_LIMIT)) {
		// 	this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
		// 	return;
		// }

		if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
			return;
		}

		const lstCtietBcaoTemp: ItemData[] = [];
		this.lstCtietBcao.forEach(item => {
			lstCtietBcaoTemp.push({
				...item,
				id: item.id?.length == 38 ? null : item.id,
			})
		})

		const request = JSON.parse(JSON.stringify(this.formDetail));

		request.fileDinhKems = [];
		for (let iterator of this.listFile) {
			request.fileDinhKems.push(await this.fileFunc.uploadFile(iterator, this.dataInfo.path));
		}

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
					this._modalRef.close({
						trangThai: data.data.trangThai,
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
		const chiSo: string[] = str.split('.');
		const n: number = chiSo.length - 1;
		let k: number = parseInt(chiSo[n], 10);
		switch (n) {
			case 0:
				return this.genFunc.laMa(k);
			case 1:
				return chiSo[n];
			default:
				return null;
		}
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

	changeModel(id: string): void {
		this.editCache[id].data.ttienTaiKho = this.numFunc.mul(this.editCache[id].data.sluongTaiKho, this.editCache[id].data.dmucTaiKho);
		this.editCache[id].data.ttienNgoaiKho = this.numFunc.mul(this.editCache[id].data.binhQuanNgoaiKho, this.editCache[id].data.sluongTaiKho);
		this.editCache[id].data.tongCong = this.numFunc.sum([this.editCache[id].data.ttienNgoaiKho, this.editCache[id].data.ttienTaiKho]);
		this.editCache[id].data.tdinhKhoTtien = this.numFunc.mul(this.editCache[id].data.tdinhKhoSluong, this.editCache[id].data.dmucTaiKho);
		this.editCache[id].data.tongCong = this.numFunc.sum([this.editCache[id].data.tdinhKhoTtien, this.editCache[id].data.ttienNgoaiKho]);
		this.editCache[id].data.chenhLech = this.editCache[id].data.tongCong - this.editCache[id].data.tongCong;
	}

	sum(stt: string) {
		stt = this.tableFunc.getHead(stt);
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
				if (this.tableFunc.getHead(item.stt) == stt) {
					this.keys.forEach(key => {
						this.lstCtietBcao[index][key] = this.numFunc.sum([this.lstCtietBcao[index][key], item[key]]);
					})
				}
			})
			stt = this.tableFunc.getHead(stt);
		}
		this.getTotal();
	}

	sum1() {
		this.lstCtietBcao.forEach(item => {
			this.sum(item.stt);
		})
	}

	getTotal() {
		this.total = new ItemData();
		this.lstCtietBcao.forEach(item => {
			if (item.level == 0) {
				this.keys.forEach(key => {
					this.total[key] = this.numFunc.sum([this.total[key], item[key]]);
				})
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

	checkDelete(stt: string) {
		const level = stt.split('.').length - 2;
		if (level == 1) {
			return true;
		}
		return false;
	}

	//xóa dòng
	deleteLine(id: string) {
		const stt = this.lstCtietBcao.find(e => e.id === id)?.stt;
		this.lstCtietBcao = this.tableFunc.deleteRow(id, this.lstCtietBcao);
		this.sum(stt);
		this.updateEditCache();
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
							if (e.stt.startsWith("0.2.")) {
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
							if (e.stt.startsWith("0.1.")) {
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
	};

	// xoa file trong bang file
	deleteFile(id: string): void {
		this.formDetail.lstFiles = this.formDetail.lstFiles.filter((a: any) => a.id !== id);
		this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
		this.formDetail.listIdDeleteFiles.push(id);
	}

	async downloadFile(id: string) {
		let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
		let doc: any = this.formDetail.lstFiles.find(element => element?.id == id);
		await this.fileFunc.downloadFile(file, doc);
	}
}

