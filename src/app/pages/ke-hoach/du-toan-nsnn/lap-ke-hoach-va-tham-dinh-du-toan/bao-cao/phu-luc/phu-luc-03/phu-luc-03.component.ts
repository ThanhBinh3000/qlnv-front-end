import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Operator, Status, Table, Utils } from 'src/app/Utility/utils';
import { DialogDanhSachVatTuHangHoaComponent } from 'src/app/components/dialog/dialog-danh-sach-vat-tu-hang-hoa/dialog-danh-sach-vat-tu-hang-hoa.component';
import { DialogTuChoiComponent } from 'src/app/components/dialog/dialog-tu-choi/dialog-tu-choi.component';
import { MESSAGE } from 'src/app/constants/message';
import { MESSAGEVALIDATE } from 'src/app/constants/messageValidate';
import { LapThamDinhService } from 'src/app/services/quan-ly-von-phi/lapThamDinh.service';
import { QuanLyVonPhiService } from 'src/app/services/quanLyVonPhi.service';
import { UserService } from 'src/app/services/user.service';
import * as uuid from 'uuid';
import * as XLSX from 'xlsx';
import { BtnStatus, Doc, Form } from '../../../lap-ke-hoach-va-tham-dinh-du-toan.constant';

export class ItemData {
	id: any;
	stt: string;
	matHang: string;
	maDmuc: string;
	tenMatHang: string;
	dvTinh: string;
	thucHienNamTruoc: number;
	dtoanNamHtai: number;
	uocThNamHtai: number;
	dmucNamDtoan: number;
	sluongNamDtoan: number;
	ttienNamDtoan: number;
	sluongNamN1Td: number;
	ttienNamN1Td: number;
	chenhLech: number;
	ghiChu: string;
	ykienDviCtren: string;
	level: any;
	checked: boolean;

	constructor(data: Partial<Pick<ItemData, keyof ItemData>>) {
		Object.assign(this, data);
	}

	changeModel() {
		if (this.dmucNamDtoan) {
			this.ttienNamDtoan = Operator.mul(this.dmucNamDtoan, this.sluongNamDtoan);
			this.ttienNamN1Td = Operator.mul(this.dmucNamDtoan, this.sluongNamN1Td);
		}
		this.chenhLech = Operator.sum([this.ttienNamN1Td, -this.ttienNamDtoan]);
	}

	upperBound() {
		return this.ttienNamDtoan > Utils.MONEY_LIMIT;
	}

	index() {
		const str = this.stt.substring(this.stt.indexOf('.') + 1, this.stt.length);
		const chiSo: string[] = str.split('.');
		const n: number = chiSo.length - 1;
		switch (n) {
			case 0:
				return chiSo[n];
			case 1:
				return "-";
			default:
				return '';
		}
	}

	clear() {
		Object.keys(this).forEach(key => {
			if (typeof this[key] === 'number' && key != 'level' && key != 'dmucNamDtoan') {
				this[key] = null;
			}
		})
	}

	sum(data: ItemData) {
		Object.keys(data).forEach(key => {
			if (key != 'level' && key != 'dmucNamDtoan' && (typeof this[key] == 'number' || typeof data[key] == 'number')) {
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
	selector: 'app-phu-luc-03',
	templateUrl: './phu-luc-03.component.html',
	styleUrls: ['../../bao-cao.component.scss']
})

export class PhuLuc03Component implements OnInit {
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
		private quanLyVonPhiService: QuanLyVonPhiService,
		public userService: UserService,
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
			this.scrollX = Table.tableWidth(350, 7, 1, 110);
			await this.getDinhMuc();
		} else {
			if (this.status.editAppVal) {
				this.scrollX = Table.tableWidth(350, 10, 2, 60);
			} else if (this.status.viewAppVal) {
				this.scrollX = Table.tableWidth(350, 10, 2, 0);
			} else {
				this.scrollX = Table.tableWidth(350, 7, 1, 0);
			}
		}
		if (this.formDetail.trangThai == Status.NEW) {
			this.lstCtietBcao.forEach(item => {
				if (!item.tenMatHang) {
					const dinhMuc = this.dsDinhMuc.find(e => e.cloaiVthh == item.matHang && e.loaiBaoQuan == item.maDmuc);
					item.tenMatHang = dinhMuc?.tenDinhMuc;
					item.dmucNamDtoan = dinhMuc?.tongDmuc;
					item.dvTinh = dinhMuc?.donViTinh;
					item.changeModel();
					// item.ttienNamDtoan = Operator.mul(item.dmucNamDtoan, item.sluongNamDtoan);
				}
			})
		}

		if (!this.lstCtietBcao[0]?.stt) {
			this.setIndex();
		}
		this.lstCtietBcao = Table.sortByIndex(this.lstCtietBcao);
		this.getTotal();
		this.updateEditCache();
		this.getStatusButton();
		this.spinner.hide();
	}

	getStatusButton() {
		this.status.ok = this.status.ok && (this.formDetail.trangThai == Status.NOT_RATE || this.formDetail.trangThai == Status.COMPLETE);
	}

	async getFormDetail() {
		await this.lapThamDinhService.ctietBieuMau(this.dataInfo.id).toPromise().then(
			data => {
				if (data.statusCode == 0) {
					this.formDetail = data.data;
					this.formDetail.maDviTien = '1';
					this.formDetail.lstCtietLapThamDinhs.forEach(item => {
						this.lstCtietBcao.push(new ItemData(item))
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
				item.sluongNamN1Td = item.sluongNamDtoan;
				item.ttienNamN1Td = item.ttienNamDtoan;
				item.chenhLech = Operator.sum([item.ttienNamN1Td, -item.ttienNamDtoan]);
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
						lyDoTuChoi: data.data.lyDoTuChoi,
						thuyetMinh: data.data.thuyetMinh,
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

	async getDinhMuc() {
		const request = {
			loaiDinhMuc: '03',
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
		const lstVtuTemp = this.lstCtietBcao.filter(e => !e.maDmuc);
		for (let i = 0; i < lstVtuTemp.length; i++) {
			const stt = '0.' + (i + 1).toString();
			const index = this.lstCtietBcao.findIndex(e => e.id == lstVtuTemp[i].id);
			this.lstCtietBcao[index].stt = stt;
			const lstDmTemp = this.lstCtietBcao.filter(e => e.matHang == lstVtuTemp[i].matHang && !!e.maDmuc);
			for (let j = 0; j < lstDmTemp.length; j++) {
				const ind = this.lstCtietBcao.findIndex(e => e.id == lstDmTemp[j].id);
				this.lstCtietBcao[ind].stt = stt + '.' + (j + 1).toString();
			}
		}
		lstVtuTemp.forEach(item => {
			this.sum(item.stt + '.1');
		})
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

	// luu thay doi
	saveEdit(id: string): void {
		const index = this.lstCtietBcao.findIndex(item => item.id === id); // lay vi tri hang minh sua
		Object.assign(this.lstCtietBcao[index], this.editCache[id].data); // set lai data cua lstCtietBcao[index] = this.editCache[id].data
		this.editCache[id].edit = false; // CHUYEN VE DANG TEXT
		this.sum(this.lstCtietBcao[index].stt);
		this.updateEditCache();
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

	checkEdit(stt: string) {
		return this.lstCtietBcao.every(e => Table.preIndex(e.stt) != stt);
	}

	checkDelete(stt: string) {
		const level = stt.split('.').length - 2;
		return level == 0;
	}

	// start edit
	startEdit(id: string): void {
		if (this.lstCtietBcao.every(e => !this.editCache[e.id].edit)) {
			this.editCache[id].edit = true;
		} else {
			this.notification.warning(MESSAGE.WARNING, 'Vui lòng lưu bản ghi đang sửa trước khi thực hiện thao tác');
			return;
		}
	}

	// click o checkbox single
	updateSingleChecked(): void {
		if (this.lstCtietBcao.every(item => item.checked || item.level != 0)) {     // tat ca o checkbox deu = true thi set o checkbox all = true
			this.allChecked = true;
		} else {                                                        // o checkbox vua = false, vua = true thi set o checkbox all = indeterminate
			this.allChecked = false;
		}
	}

	// click o checkbox all
	updateAllChecked(): void {
		this.lstCtietBcao.forEach(item => {
			item.checked = this.allChecked;
		})
	}

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
				if (this.lstCtietBcao.findIndex(e => e.matHang == data.ma) == -1) {
					//tim so thu tu cho loai vat tu moi
					let index = 1;
					this.lstCtietBcao.forEach(item => {
						if (item.matHang && !item.maDmuc) {
							index += 1;
						}
					})
					const stt = '0.' + index.toString();
					//them vat tu moi vao bang
					this.lstCtietBcao.push(new ItemData({
						id: uuid.v4() + 'FE',
						stt: stt,
						matHang: data.ma,
						tenMatHang: data.ten,
						level: 0,
					}))
					const lstTemp = this.dsDinhMuc.filter(e => e.cloaiVthh == data.ma);
					for (let i = 1; i <= lstTemp.length; i++) {
						this.lstCtietBcao.push(new ItemData({
							id: uuid.v4() + 'FE',
							stt: stt + '.' + i.toString(),
							matHang: data.ma,
							maDmuc: lstTemp[i - 1].loaiBaoQuan,
							tenMatHang: lstTemp[i - 1].tenDinhMuc,
							dvTinh: lstTemp[i - 1].donViTinh,
							level: 1,
							dmucNamDtoan: lstTemp[i - 1].tongDmuc,
						}))
					}
					this.updateEditCache();
				}
			}
		});
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

	getTotal() {
		this.total.clear();
		this.lstCtietBcao.forEach(item => {
			if (item.level == 0) {
				this.total.sum(item);
			}
		})
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
		if (this.lstCtietBcao.some(e => this.editCache[e.id].edit)) {
			this.notification.warning(MESSAGE.WARNING, MESSAGEVALIDATE.NOTSAVE);
			return;
		}
		let header = [];
		let fieldOrder = [];
		let calHeader = [];
		if (this.status.viewAppVal) {
			header = [
				{ t: 0, b: 5, l: 0, r: 13, val: null },
				{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
				{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
				{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
				{ t: 4, b: 5, l: 0, r: 0, val: 'STT' },
				{ t: 4, b: 5, l: 1, r: 1, val: 'Mặt hàng' },
				{ t: 4, b: 5, l: 2, r: 2, val: 'Đơn vị tính' },
				{ t: 4, b: 5, l: 3, r: 3, val: 'Thực hiện năm trước' },
				{ t: 4, b: 4, l: 4, r: 5, val: 'Năm ' + (this.namBcao - 1).toString() },
				{ t: 5, b: 5, l: 4, r: 4, val: 'Dự toán' },
				{ t: 5, b: 5, l: 5, r: 5, val: 'Ước thực hiện' },
				{ t: 4, b: 4, l: 6, r: 8, val: 'Năm dự toán' },
				{ t: 5, b: 5, l: 6, r: 6, val: 'Định mức' },
				{ t: 5, b: 5, l: 7, r: 7, val: 'Số lượng bảo quản' },
				{ t: 5, b: 5, l: 8, r: 8, val: 'Thành tiền' },
				{ t: 4, b: 4, l: 9, r: 10, val: 'Thẩm định' },
				{ t: 5, b: 5, l: 9, r: 9, val: 'Số lượng bảo quản' },
				{ t: 5, b: 5, l: 10, r: 10, val: 'Thành tiền' },
				{ t: 4, b: 5, l: 11, r: 11, val: 'Chênh lệch giữa thẩm định của DVCT và nhu cầu của DVCD' },
				{ t: 4, b: 5, l: 12, r: 12, val: 'Ghi chú' },
				{ t: 4, b: 5, l: 13, r: 13, val: 'Ý kiến của đơn vị cấp trên' },
			]
			fieldOrder = ['stt', 'tenMatHang', 'dvTinh', 'thucHienNamTruoc', 'dtoanNamHtai', 'uocThNamHtai', 'dmucNamDtoan', 'sluongNamDtoan', 'ttienNamDtoan',
				'sluongNamN1Td', 'ttienNamN1Td', 'chenhLech', 'ghiChu', 'ykienDviCtren'];
			calHeader = ['A', 'B', 'C', '1', '2', '3', '4', '5', '6=4*5', '5A', '6A=4*5A', '7', '8', '9'];
		} else {
			header = [
				{ t: 0, b: 5, l: 0, r: 9, val: null },
				{ t: 0, b: 0, l: 0, r: 1, val: this.dataInfo.tenPl },
				{ t: 1, b: 1, l: 0, r: 8, val: this.dataInfo.tieuDe },
				{ t: 2, b: 2, l: 0, r: 8, val: this.dataInfo.congVan },
				{ t: 4, b: 5, l: 0, r: 0, val: 'STT' },
				{ t: 4, b: 5, l: 1, r: 1, val: 'Mặt hàng' },
				{ t: 4, b: 5, l: 2, r: 2, val: 'Đơn vị tính' },
				{ t: 4, b: 5, l: 3, r: 3, val: 'Thực hiện năm trước' },
				{ t: 4, b: 4, l: 4, r: 5, val: 'Năm ' + (this.namBcao - 1).toString() },
				{ t: 5, b: 5, l: 4, r: 4, val: 'Dự toán' },
				{ t: 5, b: 5, l: 5, r: 5, val: 'Ước thực hiện' },
				{ t: 4, b: 4, l: 6, r: 8, val: 'Năm dự toán' },
				{ t: 5, b: 5, l: 6, r: 6, val: 'Định mức' },
				{ t: 5, b: 5, l: 7, r: 7, val: 'Số lượng bảo quản' },
				{ t: 5, b: 5, l: 8, r: 8, val: 'Thành tiền' },
				{ t: 4, b: 5, l: 9, r: 9, val: 'Ghi chú' },
			]
			fieldOrder = ['stt', 'tenMatHang', 'dvTinh', 'thucHienNamTruoc', 'dtoanNamHtai', 'uocThNamHtai', 'dmucNamDtoan', 'sluongNamDtoan', 'ttienNamDtoan',
				'ghiChu'];
			calHeader = ['A', 'B', 'C', '1', '2', '3', '4', '5', '6=4*5', '7'];
		}

		const filterData = this.lstCtietBcao.map(item => {
			const row: any = {};
			fieldOrder.forEach(field => {
				row[field] = field == 'stt' ? item.index() : ((!item[field] && item[field] !== 0) ? '' : item[field]);
			})
			return row;
		})
		let row: any = {};
		fieldOrder.forEach(field => {
			if (field == 'tenMatHang') {
				row[field] = 'Tổng cộng'
			} else {
				if (!['dmucNamDtoan', 'sluongNamDtoan', 'sluongNamN1Td'].includes(field)) {
					row[field] = (!this.total[field] && this.total[field] !== 0) ? '' : this.total[field];
				} else {
					row[field] = '';
				}
			}
		})
		filterData.unshift(row);
		// thêm công thức tính cho biểu mẫu
		let cal = {};
		fieldOrder.forEach((field, index) => {
			cal[field] = calHeader[index];
		})
		filterData.unshift(cal);
		const workbook = XLSX.utils.book_new();
		const worksheet = Table.initExcel(header);
		XLSX.utils.sheet_add_json(worksheet, filterData, { skipHeader: true, origin: Table.coo(header[0].l, header[0].b + 1) })
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
		XLSX.writeFile(workbook, this.dataInfo.maBcao + '_Phu_luc_III.xlsx');
	}
}
