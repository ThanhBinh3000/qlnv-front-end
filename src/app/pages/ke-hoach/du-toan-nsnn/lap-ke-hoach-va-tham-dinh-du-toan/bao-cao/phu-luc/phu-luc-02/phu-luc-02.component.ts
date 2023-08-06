import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from "src/app/Utility/utils";
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { DanhMucDungChungService } from 'src/app/services/danh-muc-dung-chung.service';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from "uuid";
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';

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
	ykienDviCtren: string;
	checked: boolean;

	constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
		Object.assign(this, data);
	}

	changeModel() {
		this.ttienTaiKho = Operator.mul(this.sluongTaiKho, this.dmucTaiKho);
		this.ttienNgoaiKho = Operator.mul(this.binhQuanNgoaiKho, this.sluongTaiKho);
		this.tongCong = Operator.sum([this.ttienNgoaiKho, this.ttienTaiKho]);
		this.tdinhKhoTtien = Operator.mul(this.tdinhKhoSluong, this.dmucTaiKho);
		this.tdinhTcong = Operator.sum([this.tdinhKhoTtien, this.ttienNgoaiKho]);
		this.chenhLech = Operator.sum([this.tdinhTcong, -this.tongCong]);
	}

	upperBound() {
		return this.thNamTruoc > Utils.MONEY_LIMIT || this.namDtoan > Utils.MONEY_LIMIT || this.namUocTh > Utils.MONEY_LIMIT || this.tongCong > Utils.MONEY_LIMIT || this.tdinhTcong > Utils.MONEY_LIMIT;
	}

	index() {
		const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
		const chiSo: string[] = str.split('.');
		const n: number = chiSo.length - 1;
		let k: number = parseInt(chiSo[n], 10);
		switch (n) {
			case 0:
				return Utils.laMa(k);
			case 1:
				return chiSo[n];
			default:
				return null;
		}
	}

	clear() {
		Object.keys(this).forEach(key => {
			if (typeof this[key] === 'number' && !['level'].includes(key)) {
				this[key] = null;
			}
		})
	}

	sum(data: ItemData) {
		Object.keys(data).forEach(key => {
			if (!['level', 'sluongTaiKho', 'dmucTaiKho', 'binhQuanNgoaiKho'].includes(key) && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
				this[key] = Operator.sum([this[key], data[key]]);
			}
		})
	}

	request() {
		const temp = Object.assign({}, this);
		if (this.id?.length == 38) {
			temp.id = null;
		}
		return temp;
	}
}

@Component({
	selector: 'app-phu-luc-02',
	templateUrl: './phu-luc-02.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})

export class PhuLuc02Component implements OnInit {
	@Input() dataInfo;
	Op = new Operator('1');
	Utils = Utils;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData({});
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	linhVucChis: any[] = [];
	lstCtietBcao: ItemData[] = [];
	lstVatTuFull: any[] = [];
	dsDinhMuc: any[] = [];
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
			this.scrollX = Table.tableWidth(350, 10, 1, 110);
		} else {
			if (this.status.editAppVal) {
				this.scrollX = Table.tableWidth(350, 14, 2, 60);
			} else if (this.status.viewAppVal) {
				this.scrollX = Table.tableWidth(350, 14, 2, 0);
			} else {
				this.scrollX = Table.tableWidth(350, 10, 1, 0);
			}
		}
		if (this.lstCtietBcao.length == 0) {
			this.linhVucChis.forEach(e => {
				this.lstCtietBcao.push(new ItemData({
					id: uuid.v4() + 'FE',
					stt: e.ma,
					tenDanhMuc: e.giaTri,
					maDanhMuc: e.ma,
				}))
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
				item.ttienTaiKho = Operator.mul(item.dmucTaiKho, item.sluongTaiKho);
			}
		})

		if (this.dataInfo.isSynthetic) {
			this.lstCtietBcao.forEach(item => {
				const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.maDanhMuc);
				item.dmucTaiKho = dinhMuc?.tongDmuc;
				item.changeModel();
			})
			this.sum1()
		}

		this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
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
		this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
	};

	async getFormDetail() {
		await this.lapThamDinhService.ctietBieuMau(this.dataInfo.id).toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.formDetail = data.data;
					this.formDetail.maDviTien = '1';
					this.formDetail.lstCtietLapThamDinhs.forEach(item => {
						this.lstCtietBcao.push(new ItemData(item));
					})
					this.listFile = [];
					this.formDetail.listIdDeleteFiles = [];
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

		if (this.lstCtietBcao.some(e => e.upperBound())) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			return;
		}

		if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
			return;
		}

		const lstCtietBcaoTemp: ItemData[] = [];
		this.lstCtietBcao.forEach(item => {
			lstCtietBcaoTemp.push(item.request())
		})

		if (this.status.general && !this.dataInfo.isOffice) {
			lstCtietBcaoTemp?.forEach(item => {
				item.tdinhKhoSluong = item.sluongTaiKho;
				item.tdinhKhoTtien = item.ttienTaiKho;
				item.tdinhTcong = item.tongCong;
				item.chenhLech = 0;
			})
		}

		const request = JSON.parse(JSON.stringify(this.formDetail));

		request.fileDinhKems = [];
		for (let iterator of this.listFile) {
			request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path));
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

	// gan editCache.data == lstCtietBcao
	updateEditCache(): void {
		this.lstCtietBcao.forEach(item => {
			this.editCache[item.id] = {
				edit: false,
				data: new ItemData(item)
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
			data: new ItemData(this.lstCtietBcao[index]),
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

	sum(stt: string) {
		stt = Table.preIndex(stt);
		while (stt != '0') {
			const index = this.lstCtietBcao.findIndex(e => e.stt == stt);
			this.lstCtietBcao[index].clear();
			this.lstCtietBcao.forEach(item => {
				if (Table.preIndex(item.stt) == stt) {
					this.lstCtietBcao[index].sum(item);
				}
			})
			stt = Table.preIndex(stt);
		}
		this.getTotal();
	}

	sum1() {
		this.lstCtietBcao.forEach(item => {
			this.sum(item.stt);
		})
	}

	getTotal() {
		this.total.clear();
		this.lstCtietBcao.forEach(item => {
			if (item.level == 0) {
				this.total.sum(item);
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
		this.lstCtietBcao = Table.deleteRow(id, this.lstCtietBcao);
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
						this.lstCtietBcao.push(new ItemData({
							id: uuid.v4() + 'FE',
							stt: stt,
							maDanhMuc: data.ma,
							tenDanhMuc: data.ten,
							dviTinh: dm?.donViTinh,
							dmucTaiKho: dm?.tongDmuc,
							level: 1,
						}))
						this.lstCtietBcao.forEach(e => {
							if (e.stt.startsWith("0.2.")) {
								this.lstCtietBcao[index].clear();
							}
						})
						this.getTotal()
						this.updateEditCache();
					} else {
						stt = '0.1.' + index.toString();
						this.lstCtietBcao.splice(index, 0, new ItemData({
							id: uuid.v4() + 'FE',
							stt: stt,
							maDanhMuc: data.ma,
							tenDanhMuc: data.ten,
							dviTinh: dm?.donViTinh,
							dmucTaiKho: dm?.tongDmuc,
							level: 1,
						}))
						const index2 = this.lstCtietBcao.findIndex(e => e.maDanhMuc == '0.1');
						this.lstCtietBcao.forEach(e => {
							if (e.stt.startsWith("0.1.")) {
								this.lstCtietBcao[index2].clear();
							}
						})
						this.getTotal()
						this.updateEditCache();
					}

				}
			}
		});
	}

	// xoa file trong bang file
	deleteFile(id: string): void {
		this.formDetail.lstFiles = this.formDetail.lstFiles.filter((a: any) => a.id !== id);
		this.listFile = this.listFile.filter((a: any) => a?.lastModified.toString() !== id);
		this.formDetail.listIdDeleteFiles.push(id);
	}

	async downloadFile(id: string) {
		let file: any = this.listFile.find(element => element?.lastModified.toString() == id);
		let doc: any = this.formDetail.lstFiles.find(element => element?.id == id);
		await this.quanLyVonPhiService.downFile(file, doc);
	}

	exportToExcel() {
		const header = [
			{ t: 0, b: 6, l: 0, r: 17, val: null },
			{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
			{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
			{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
			{ t: 4, b: 6, l: 0, r: 0, val: 'STT' },
			{ t: 4, b: 6, l: 1, r: 1, val: 'Danh mục' },
			{ t: 4, b: 6, l: 2, r: 2, val: 'Đơn vị tính' },
			{ t: 4, b: 6, l: 3, r: 3, val: 'Thực hiện năm trước' },
			{ t: 4, b: 4, l: 4, r: 5, val: 'Năm ' + (this.namBcao - 1).toString() },
			{ t: 5, b: 6, l: 4, r: 4, val: 'Dự toán' },
			{ t: 5, b: 6, l: 5, r: 5, val: 'Ước thực hiện' },
			{ t: 4, b: 4, l: 6, r: 11, val: 'Năm dự toán' },
			{ t: 5, b: 5, l: 6, r: 8, val: 'Chi phí tại cửa kho' },
			{ t: 6, b: 6, l: 6, r: 6, val: 'Số lượng' },
			{ t: 6, b: 6, l: 7, r: 7, val: 'Định mức' },
			{ t: 6, b: 6, l: 8, r: 8, val: 'Thành tiền' },
			{ t: 5, b: 5, l: 9, r: 10, val: 'Chí phí ngoài cửa kho' },
			{ t: 6, b: 6, l: 9, r: 9, val: 'Bình quân' },
			{ t: 6, b: 6, l: 10, r: 10, val: 'Thành tiền' },
			{ t: 5, b: 6, l: 11, r: 11, val: 'Tổng cộng' },
			{ t: 4, b: 4, l: 12, r: 14, val: 'Thẩm định' },
			{ t: 5, b: 5, l: 12, r: 13, val: 'Chi phí tại cửa kho' },
			{ t: 6, b: 6, l: 12, r: 12, val: 'Số lượng' },
			{ t: 6, b: 6, l: 13, r: 13, val: 'Thành tiền' },
			{ t: 5, b: 6, l: 14, r: 14, val: 'Tổng cộng' },
			{ t: 4, b: 6, l: 15, r: 15, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
			{ t: 4, b: 6, l: 16, r: 16, val: 'Ghi chú' },
			{ t: 4, b: 6, l: 17, r: 17, val: 'Ý kiến của đơn vị cấp trên' },
		]
		const fieldOrder = ['stt', 'tenDanhMuc', 'dviTinh', 'thNamTruoc', 'namDtoan', 'namUocTh', 'sluongTaiKho', 'dmucTaiKho', 'ttienTaiKho',
			'binhQuanNgoaiKho', 'ttienNgoaiKho', 'tongCong', 'tdinhKhoSluong', 'tdinhKhoTtien', 'tdinhTcong', 'chenhLech', 'ghiChu', 'ykienDviCtren']

		const filterData = this.lstCtietBcao.map(item => {
			const row: any = {};
			fieldOrder.forEach(field => {
				row[field] = field == 'stt' ? item.index() : item[field]
			})
			return row;
		})

		const workbook = XLSX.utils.book_new();
		const worksheet = Table.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_luc_II.xlsx');
	}
}

