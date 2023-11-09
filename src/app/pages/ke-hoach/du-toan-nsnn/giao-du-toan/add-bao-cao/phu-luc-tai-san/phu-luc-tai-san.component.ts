import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { GiaoDuToanChiService } from 'src/app/services/quan-ly-von-phi/giaoDuToanChi.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import * as uuid from 'uuid';
import { DialogSelectTaiSanComponent } from '../../dialogSelectTaiSan/dialogSelectTaiSan.component';
import { BtnStatus, Doc, Form } from '../../giao-du-toan.constant';
import * as XLSX from 'xlsx-js-style';

export class ItemData {
	id: any;
	danhMuc: string;
	maDmuc: string;
	tenDanhMuc: string;
	dviTinh: string;
	sluongTdiemBc: number;
	sluongDaNhan: number;
	sluongDaPd: number;
	sluongCong: number;
	sluongDmuc: number;
	sluongDtoan: number;
	mucGia: number;
	ttien: number;
	stt: string;
	level: any;
	checked: boolean;

	constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
		Object.assign(this, data);
	}

	changeModel() {
		this.sluongCong = Operator.sum([this.sluongTdiemBc, this.sluongDaPd, this.sluongDaNhan]);
		this.ttien = Operator.mul(this.sluongDtoan, this.mucGia);
	}

	upperBound() {
		return this.sluongDtoan > Utils.MONEY_LIMIT;
	}

	clear() {
		Object.keys(this).forEach(key => {
			if (typeof this[key] === 'number' && key != 'level') {
				this[key] = null;
			}
		})
	}

	sum(data: ItemData) {
		Object.keys(data).forEach(key => {
			if (key != 'level' && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
				this[key] = Operator.sum([this[key], data[key]]);
			}
		})
	}

	index() {
		const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
		const chiSo: string[] = str.split('.');
		const n: number = chiSo.length - 1;
		let k: number = parseInt(chiSo[n], 10);
		switch (n) {
			case 0:
				return chiSo[n];
			case 1:
				return "-";
			case 2:
				return String.fromCharCode(k + 96);
			case 3:
				return "-";
			default:
				return "";
		}
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
	selector: 'app-phu-luc-tai-san',
	templateUrl: './phu-luc-tai-san.component.html',
	styleUrls: ['../add-bao-cao.component.scss'],
})

export class PhuLucTaiSanComponent implements OnInit {
	@Input() dataInfo;
	Op = new Operator('1');
	Utils = Utils;
	//thong tin chi tiet cua bieu mau
	formDetail: Form = new Form();
	total: ItemData = new ItemData({});
	maDviTien: string = '1';
	namBcao: number;
	//danh muc
	listVtu: any[] = [];
	lstCtietBcaos: ItemData[] = [];
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
	dsDinhMuc: any[] = [];
	statusCanhBao = true;
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
		private giaoDuToanService: GiaoDuToanChiService,
		private notification: NzNotificationService,
		private modal: NzModalService,
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
			this.scrollX = Table.tableWidth(350, 8, 1, 360);
		} else {
			if (this.status.editAppVal) {
				this.scrollX = Table.tableWidth(350, 11, 2, 60);
			} else if (this.status.viewAppVal) {
				this.scrollX = Table.tableWidth(350, 11, 2, 0);
			} else {
				this.scrollX = Table.tableWidth(350, 8, 1, 0);
			}
		}
		if (!this.lstCtietBcaos[0]?.stt) {
			let sttItem = 1
			this.lstCtietBcaos.forEach(item => {
				const stt = "0." + sttItem
				item.stt = stt;
				sttItem++
			})
		}
		this.lstCtietBcaos = Table.sortByIndex(this.lstCtietBcaos);
		this.tinhTong();
		this.updateEditCache();
		this.getStatusButton();
		this.spinner.hide();
	}

	getStatusButton() {
		this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
	}

	async getFormDetail() {
		await this.giaoDuToanService.ctietBieuMau(this.dataInfo.id).toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.formDetail = data.data;
					this.formDetail.maDviTien = '1';
					this.formDetail.lstCtietBcaos.forEach(item => {
						this.lstCtietBcaos.push(new ItemData(item));
					})
					this.formDetail.listIdDeleteFiles = [];
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
		if (this.lstCtietBcaos.some(e => this.editCache[e.id].edit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}

		if (this.lstCtietBcaos.some(e => e.upperBound())) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.MONEYRANGE);
			return;
		}

		if (this.listFile.some(file => file.size > Utils.FILE_SIZE)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.OVER_SIZE);
			return;
		}

		const lstCtietBcaoTemp: ItemData[] = [];
		this.lstCtietBcaos.forEach(item => {
			lstCtietBcaoTemp.push(item.request())
		})


		const request = JSON.parse(JSON.stringify(this.formDetail));

		request.fileDinhKems = [];
		for (let iterator of this.listFile) {
			const id = iterator?.lastModified.toString();
			const noiDung = this.formDetail.lstFiles.find(e => e.id == id)?.noiDung;
			request.fileDinhKems.push(await this.quanLyVonPhiService.upFile(iterator, this.dataInfo.path, noiDung));
		}
		request.fileDinhKems = request.fileDinhKems.concat(this.formDetail.lstFiles.filter(e => typeof e.id == 'number'))

		request.lstCtietBcaos = lstCtietBcaoTemp;
		request.trangThai = trangThai;

		if (lyDoTuChoi) {
			request.lyDoTuChoi = lyDoTuChoi;
		}

		this.spinner.show();
		this.giaoDuToanService.updateCTietBcao(request).toPromise().then(
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


	async getDinhMuc(code: string) {
		const request = {
			loaiDinhMuc: code,
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

	setIndex() {
		const lstVtuTemp = this.lstCtietBcaos.filter(e => !e.danhMuc);
		for (let i = 0; i < lstVtuTemp.length; i++) {
			const stt = '0.' + (i + 1).toString();
			const index = this.lstCtietBcaos.findIndex(e => e.id == lstVtuTemp[i].id);
			this.lstCtietBcaos[index].stt = stt;
			const lstDmTemp = this.lstCtietBcaos.filter(e => e.danhMuc == lstVtuTemp[i].danhMuc && !!e.danhMuc);
			for (let j = 0; j < lstDmTemp.length; j++) {
				const ind = this.lstCtietBcaos.findIndex(e => e.id == lstDmTemp[j].id);
				this.lstCtietBcaos[ind].stt = stt + '.' + (j + 1).toString();
			}
		}
		lstVtuTemp.forEach(item => {
			this.sum(item);
			this.tinhTong();
		})
	}

	checkDelete(stt: string) {
		const level = stt.split('.').length - 2;
		return level == 0;
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
	};


	checkEdit(stt: string) {
		const lstTemp = this.lstCtietBcaos.filter(e => e.stt !== stt);
		return lstTemp.every(e => !e.stt.startsWith(stt));
	}

	// start edit
	startEdit(id: string): void {
		if (this.lstCtietBcaos.every(e => !this.editCache[e.id].edit)) {
			this.editCache[id].edit = true;
		} else {
			this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
			return;
		}
	}

	// luu thay doi
	saveEdit(id: string): void {
		const index = this.lstCtietBcaos.findIndex(item => item.id === id); // lay vi tri hang minh sua
		if (this.editCache[id].data.sluongDtoan > (this.editCache[id].data.sluongDmuc - this.editCache[id].data.sluongCong)) {
			this.notification.warning(
				MESSAGE.WARNING,
				"Số lượng dự toán đề nghị  không vượt quá hiệu của số lượng tiêu chuẩn định mức tối đa và tổng tài sản hiện có (cột 6 <= cột 5 - cột 4)"
			).onClose.subscribe(() => {
				this.statusCanhBao = false
			})
			return
		} else {
			Object.assign(this.lstCtietBcaos[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
			this.statusCanhBao = true
		}
		Object.assign(this.lstCtietBcaos[index], this.editCache[id].data); // set lai data cua lstCtietBcaos[index] = this.editCache[id].data
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		this.updateEditCache();
		this.tinhTong();
	};

	// huy thay doi
	cancelEdit(id: string): void {
		const index = this.lstCtietBcaos.findIndex(item => item.id === id);
		// lay vi tri hang minh sua
		this.editCache[id] = {
			data: new ItemData(this.lstCtietBcaos[index]),
			edit: false
		};
	}

	deleteLine(id: string) {
		const data = this.lstCtietBcaos.find(e => e.id === id);
		this.lstCtietBcaos = Table.deleteRow(id, this.lstCtietBcaos);
		this.sum(data)
		this.tinhTong()
		this.updateEditCache();
	}

	selectGoods() {
		const modalTuChoi = this.modal.create({
			nzTitle: 'Danh sách hàng hóa',
			nzContent: DialogSelectTaiSanComponent,
			nzBodyStyle: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' },
			nzMaskClosable: false,
			nzClosable: false,
			nzWidth: '900px',
			nzFooter: null,
			nzComponentParams: {},
		});
		modalTuChoi.afterClose.subscribe(async (data) => {
			if (data) {
				if (this.lstCtietBcaos.findIndex(e => e.danhMuc == data.ma) == -1) {
					//tim so thu tu cho loai vat tu moi
					let index = 1;
					this.lstCtietBcaos.forEach(item => {
						if (item.danhMuc && !item.maDmuc) {
							index += 1;
						}
					})
					const stt = '0.' + index.toString();
					//them vat tu moi vao bang
					this.lstCtietBcaos.push(new ItemData({
						id: uuid.v4() + 'FE',
						stt: stt,
						danhMuc: data.maTaiSan,
						tenDanhMuc: data.tenTaiSan,
						dviTinh: data.dviTinh,
						level: 0,
					}))
					this.updateEditCache();
				}
			}
		});
	}

	// tinh tong tu cap duoi
	sum(data: ItemData) {
		Object.keys(data).forEach(key => {
			if (key != 'level' && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
				this[key] = Operator.sum([this[key], data[key]]);
			}
		})
	}

	tinhTong() {
		this.total.clear();
		this.lstCtietBcaos.forEach(item => {
			this.total.sum(item);
		})
	}


	// gan editCache.data == lstCtietBcaos
	updateEditCache(): void {
		this.lstCtietBcaos.forEach(item => {
			this.editCache[item.id] = {
				edit: false,
				data: new ItemData(item)
			};
		});
	}

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
		if (this.lstCtietBcaos.some(e => this.editCache[e.id].edit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}
		const header = [
			{ t: 0, b: 6, l: 0, r: 10, val: null },

			{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
			{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
			{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
			{ t: 3, b: 3, l: 0, r: 8, val: 'Trạng thái báo cáo: ' + this.dataInfo.tenTrangThai },

			{ t: 4, b: 5, l: 0, r: 0, val: 'STT' },
			{ t: 4, b: 5, l: 1, r: 1, val: 'Tên tài sản (theo danh mục được phê duyệt tại Quyết định số 149/QĐ-TCDT)' },
			{ t: 4, b: 5, l: 2, r: 2, val: 'ĐVT' },
			{ t: 4, b: 5, l: 3, r: 7, val: 'Số lượng tài sản, máy móc, thiết bị hiện có' },
			{ t: 4, b: 5, l: 8, r: 10, val: 'Dự toán đề nghị trang bị năm ' + (this.namBcao - 1).toString() },

			{ t: 5, b: 5, l: 3, r: 3, val: 'Số lượng đến thời điểm báo cáo' },
			{ t: 5, b: 5, l: 4, r: 4, val: 'Số lượng đã nhận chưa có QĐ điều chuyển' },
			{ t: 5, b: 5, l: 5, r: 5, val: 'Số lượng đã được phê duyệt mua sắm năm' + + (this.namBcao - 2).toString() },
			{ t: 5, b: 5, l: 6, r: 6, val: 'Cộng' },

			{ t: 5, b: 5, l: 7, r: 7, val: 'Tiêu chuẩn định mức tối đa được phê duyệt' },
			{ t: 5, b: 5, l: 8, r: 8, val: 'Số lượng ' },
			{ t: 5, b: 5, l: 9, r: 9, val: 'Mức giá' },
			{ t: 5, b: 5, l: 10, r: 10, val: 'Thành tiền (Tổng nhu cầu năm nay)' },

			{ t: 6, b: 6, l: 0, r: 0, val: 'A' },
			{ t: 6, b: 6, l: 1, r: 1, val: 'B' },
			{ t: 6, b: 6, l: 2, r: 2, val: 'C' },
			{ t: 6, b: 6, l: 3, r: 3, val: '1' },
			{ t: 6, b: 6, l: 4, r: 4, val: '2' },
			{ t: 6, b: 6, l: 5, r: 5, val: '3' },
			{ t: 6, b: 6, l: 6, r: 6, val: '4 = 1 + 2 + 3 ' },
			{ t: 6, b: 6, l: 7, r: 7, val: '5' },
			{ t: 6, b: 6, l: 8, r: 8, val: '6' },
			{ t: 6, b: 6, l: 9, r: 9, val: '7' },
			{ t: 6, b: 6, l: 10, r: 10, val: '8 = 6 x 7' },
		]
		const fieldOrder = [
			'tenDanhMuc',
			'dviTinh',
			'sluongTdiemBc',
			'sluongDaNhan',
			'sluongDaPd',
			'sluongCong',
			'sluongDmuc',
			'sluongDtoan',
			'mucGia',
			'ttien',
			'stt',
		]

		const filterData = this.lstCtietBcaos.map(item => {
			const row: any = {};
			fieldOrder.forEach(field => {
				row[field] = field == 'stt' ? item.index() : item[field]
			})
			return row;
		})

		let row: any = {};
		row = {}
		fieldOrder.forEach(field => {
			row[field] = field == 'tenDanhMuc' ? 'Tổng cộng' : (!this.total[field] && this.total[field] !== 0) ? '' : this.total[field];
		})
		filterData.unshift(row)

		const workbook = XLSX.utils.book_new();
		const worksheet = Table.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
		for (const cell in worksheet) {
			if (cell.startsWith('!') || XLSX.utils.decode_cell(cell).r < 4) continue;
			worksheet[cell].s = Table.borderStyle;
		}
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		let excelName = this.dataInfo.maBcao;
		excelName = excelName + '_GSTC_PL05.xlsx'
		XLSX.writeFile(workbook, excelName);
	}
}
